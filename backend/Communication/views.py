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
from Users.view_auth import IsStaff, IsStaffOrManager
from Communication.serializers import ItineraryEmailSendSerializer, ListCommunicationChannelSerializer, EmailTemplateListSerializer
from Communication.models import CommunicationLog, CommunicationChannel, EmailTemplate
from Itinerary.models import ItineraryVersion
from ActivityLog.models import ActivitiesLogs

from django.template import Template, Context
from django.db import transaction

logger = logging.getLogger(__name__)





class ListCommunicationChannelView(generics.ListAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaffOrManager]
    serializer_class = ListCommunicationChannelSerializer

    queryset = CommunicationChannel.objects.filter(is_active=True)




class ListEmailTemplatesView(generics.ListAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated]
    serializer_class = EmailTemplateListSerializer


    def get_queryset(self):
        return EmailTemplate.objects.filter(is_active=True).order_by("name")





class SendItineraryQuoteEmailView(APIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaffOrManager]

    def post(self, request, client_id, version_id):
        serializer = ItineraryEmailSendSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        version = serializer.validated_data['version_id']
        channel = serializer.validated_data['channel_id']
        email_template = serializer.validated_data['template_id']
        

        client_info = version.client_request.client_requested
        is_owner = client_info.company.owner == request.user
        is_member = request.user.companies.filter(pk=client_info.company.pk).exists()
        
        if not (is_owner or is_member):
            raise PermissionDenied({"detail": "You don't have access to send this email."})
        

        if not client_info.email:
            return Response({"error": "Client does not have a valid email address."}, status=status.HTTP_400_BAD_REQUEST)
        
        company_name = client_info.company.name
        sender_name = version.created_by.full_name if version.created_by else "Our Team"
        
        subject = serializer.validated_data.get('subject', '').strip()
        body_html = serializer.validated_data.get('body_html', '').strip()
        
        if not body_html or not subject:
            return Response({"error": "Email body and subject are required!"}, status=status.HTTP_400_BAD_REQUEST)
        

        salutation = client_info.salutation or ""
        first_name = client_info.first_name or ""
        last_name = client_info.last_name or ""
        clean_client_name = f"{salutation} {first_name} {last_name}".strip() or "Valued Guest"
        
        frontend_preview_link = request.data.get('preview_link', '').strip()
        fallback_preview_link = f"{getattr(settings, 'FRONTEND_URL', '')}/preview/safari/itinerary/{client_id}/{version_id}"
        final_preview_link = frontend_preview_link or fallback_preview_link
        
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
        final_body_html = Template(body_html).render(context)
        
        text_fallback = f"Dear {context_data['client_name']},\n\nPlease view your personalized itinerary online at:\n{context_data['preview_link']}\n\nWarm regards,\n{sender_name}\n{company_name}"
        

        log = CommunicationLog.objects.create(
            version=version,
            channel=channel,
            recipient=client_info.email,
            sent_by=request.user,
            status="PENDING"
        )
        

        try:
            email = EmailMultiAlternatives(
                subject=final_subject,
                body=text_fallback,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[client_info.email],
                reply_to=[request.user.email],
            )
            email.attach_alternative(final_body_html, "text/html")
            email.send(fail_silently=False)
            

            log.status = "SENT"
            log.external_message_id = f"sent_{timezone.now().strftime('%Y%m%d%H%M%S')}"
            log.save()
            

            with transaction.atomic():
                if version.status == "DRAFT":
                    version.status = "SENT"
                    version.save(update_fields=['status'])
            

            ActivitiesLogs.objects.create(
                client=client_info,
                client_request=version.client_request,
                actor=request.user,
                itinerary_version=version,  
                action="SENT",  
                changes={
                    "tour_title": version.snapshot_tour_title,
                    "status": version.status,
                    "version_number": version.version_number,
                    "recipient": client_info.email,
                },
                module="ITINERARY",
                description=f"{request.user.full_name or request.user.email} sent itinerary quote to {client_info.first_name} {client_info.last_name}"
            )
            
            return Response({"status": "success", "message": "Email sent successfully."}, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Failed to send email to {client_info.email}: {str(e)}", exc_info=True)
            
       
            log.status = "FAILED"
            log.error_message = str(e)
            log.save()
            
            return Response({
                "status": "error",
                "message": "Failed to send email.",
                "detail": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



