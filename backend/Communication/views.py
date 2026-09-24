# Communication/views.py
import logging
from django.conf import settings
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.exceptions import PermissionDenied

from Users.authentication import CustomJwtCookiesAuth
from Users.views import IsStaff
from Communication.serializers import ItineraryEmailSendSerializer, ListCommunicationChannelSerializer, EmailTemplateListSerializer
from Communication.models import CommunicationLog, CommunicationChannel, EmailTemplate
from Itinerary.models import ItineraryVersion

from django.template import Template, Context
from django.db import transaction

logger = logging.getLogger(__name__)





class ListCommunicationChannelView(generics.ListAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaff]
    serializer_class = ListCommunicationChannelSerializer

    queryset = CommunicationChannel.objects.filter(is_active=True)










class SendItineraryQuoteEmailView(APIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaff]

    def post(self, request, client_id, version_id):
        try:
            version = ItineraryVersion.objects.select_related(
                'client_request__client_requested', 'created_by__user', 'version_pricing_snapshot'
            ).get(id=version_id, client_request_id=client_id)
        except ItineraryVersion.DoesNotExist:
            return Response({"error": "Itinerary version not found."}, status=status.HTTP_404_NOT_FOUND)

        client_info = version.client_request.client_requested
        secure_recipient_email = client_info.email

        if not secure_recipient_email:
            return Response({"error": "Client does not have a valid email address."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate Channel
        try:
            channel = CommunicationChannel.objects.get(id=request.data.get("channel_id"), is_active=True)
            if channel.name.upper() != "EMAIL":
                return Response({"error": "Currently, only EMAIL channel is supported."}, status=status.HTTP_400_BAD_REQUEST)
        except CommunicationChannel.DoesNotExist:
            return Response({"error": "Invalid or inactive communication channel."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate Template
        try:
            email_template = EmailTemplate.objects.get(id=request.data.get("template_id"), is_active=True)
        except EmailTemplate.DoesNotExist:
            return Response({"error": "Invalid or inactive email template."}, status=status.HTTP_400_BAD_REQUEST)

        staff_profile = getattr(request.user, "staff_profile", None)
        company_name = staff_profile.user.company_name if staff_profile else "Our Safari Team"
        sender_name = staff_profile.full_name if staff_profile else request.user.email

        edited_body = request.data.get('edited_body', '').strip()
        subject = request.data.get('subject', '').strip()
        
        # FIXED VALIDATION LOGIC
        if not edited_body or not subject:
            return Response({"error": "Email body and subject are required!"}, status=status.HTTP_400_BAD_REQUEST)


        salutation = client_info.salutation or ""
        first_name = client_info.first_name or ""
        last_name = client_info.last_name or ""
        clean_client_name = f"{salutation} {first_name} {last_name}".strip() or "Valued Guest"

        # 2. Hakikisha preview_link ipo
        frontend_preview_link = request.data.get('preview_link', '').strip()
        fallback_preview_link = f"{getattr(settings, 'FRONTEND_URL', '')}/preview/safari/itinerary/{client_id}/{version_id}"
        final_preview_link = frontend_preview_link or fallback_preview_link

        # 3. Tengeneza Context Data kwa usahihi
        context_data = {
            'client_name': clean_client_name,
            'tour_title': version.snapshot_tour_title or version.client_request.tour_title or "Your Safari",
            'tour_code': version.client_request.tour_code or "SAF-2024",
            'company_name': company_name,
            'sender_name': sender_name,
            'preview_link': final_preview_link, 
            'grand_total': str(version.version_pricing_snapshot.grand_total) if version.version_pricing_snapshot else "0.00",
        }
        
        context = Context(context_data)
        final_subject = Template(subject).render(context)
        final_body_html = Template(edited_body).render(context)
        
        # Plain text fallback for email clients that don't support HTML
        text_fallback = f"Dear {context_data['client_name']},\n\nPlease view your personalized itinerary online at:\n{context_data['preview_link']}\n\nWarm regards,\n{sender_name}\n{company_name}"

        # 3. Send Email inside atomic transaction
        with transaction.atomic():
            email = EmailMultiAlternatives(
                subject=final_subject,
                body=text_fallback,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[secure_recipient_email],
                reply_to=[request.user.email],
            )
            email.attach_alternative(final_body_html, "text/html")

            try:
                email.send(fail_silently=False)
                
                CommunicationLog.objects.create(
                    version=version, channel=channel, recipient=secure_recipient_email,
                    sent_by=request.user.staff_profile, status="SENT",
                    external_message_id=f"sent_{timezone.now().strftime('%Y%m%d%H%M%S')}"
                )
                
                if version.status == "DRAFT":
                    version.status = "SENT"
                    version.save(update_fields=['status'])
                
                return Response({"status": "success", "message": "Email sent successfully."}, status=status.HTTP_200_OK)

            except Exception as e:
                logger.error(f"Failed to send email to {secure_recipient_email}: {str(e)}")
                CommunicationLog.objects.create(
                    version=version, channel=channel, recipient=secure_recipient_email,
                    sent_by=request.user.staff_profile, status="FAILED", error_message=str(e)
                )
                return Response({"status": "error", "message": "Failed to send email.", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)























class ListEmailTemplatesView(generics.ListAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated]
    serializer_class = EmailTemplateListSerializer


    def get_queryset(self):
        return EmailTemplate.objects.filter(is_active=True).order_by("name")