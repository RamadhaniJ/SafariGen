import logging
from django.conf import settings
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.exceptions import PermissionDenied, ValidationError 
 
from Users.authentication import CustomJwtCookiesAuth
from Users.view_auth import IsStaff, IsStaffOrManager
from Communication.serializers import  ListCommunicationChannelSerializer, ListEmailTemplateSerializer
from Communication.models import CommunicationLog, CommunicationChannel, EmailTemplate
from Itinerary.models import ItineraryVersion
from ActivityLog.models import ActivitiesLogs

from django.template import Template, Context, TemplateSyntaxError
from django.db import transaction

logger = logging.getLogger(__name__)





class ListCommunicationChannelView(generics.ListAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaffOrManager]
    serializer_class = ListCommunicationChannelSerializer

    def get_queryset(self):
        return  CommunicationChannel.objects.filter(is_active=True)




class ListEmailTemplatesView(generics.ListAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaffOrManager]
    serializer_class = ListEmailTemplateSerializer


    def get_queryset(self):
        return EmailTemplate.objects.filter(is_active=True).order_by("name")









class SendItineraryQuoteViaEmailView(APIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaffOrManager]



    def post(self, request, client_id, version_id):
        channel_id = request.data.get("channel_id")
        template_id = request.data.get("template_id")

        if not channel_id  or not template_id :
             raise ValidationError({"detail":"Channel Id or Template Id is required"})
        
        try:
            channel = CommunicationChannel.objects.get(
                id = channel_id,
                is_active = True
            )
        except (CommunicationChannel.DoesNotExist , ValidationError, ValueError):
            raise ValidationError({"channel":"Channel does not exists"})


        try:
            template = EmailTemplate.objects.get(
                id = template_id,
                is_active = True
            )
        except (EmailTemplate.DoesNotExist, ValidationError, ValueError):
            raise ValidationError({"template":"Template selected does not exists"})
        
        try:
            version = ItineraryVersion.objects.select_related(
                'client_request__client_requested',
                'created_by'
            ).get(
                id = version_id
            )
        except ItineraryVersion.DoesNotExist:
            raise ValidationError({"version":"Itinerary version selected does not exists"})

        subject = request.data.get("subject")
        body_html = request.data.get("body_html")


        if channel and (channel.name or "").upper() != "EMAIL":
            raise ValidationError({"channel":"We a sorry, the Currently supported channel is Email."})

        if subject is None or body_html is None:
            raise ValidationError({"detail":"Subject or message body is missing"})





        client_info = version.client_request.client_requested
        is_owner = client_info.company.owner == request.user
        is_member = request.user.companies.filter(pk=client_info.company.pk).exists()
        
        if not (is_owner or is_member):
            raise PermissionDenied({"detail": "You don't have access to send this email."})
        

        if not client_info.email:
            return Response({"error": "Client does not have a valid email address."}, status=status.HTTP_400_BAD_REQUEST)
        
        company_name = client_info.company.name
        sender_name = version.created_by.full_name if version.created_by else "Our Team"

        
        salutation = client_info.salutation or ""
        first_name = client_info.first_name or ""
        last_name = client_info.last_name or ""
        clean_client_name = f"{salutation} {first_name} {last_name}".strip() or "Valued Guest"
        
        frontend_preview_link = request.data.get('preview_link', '').strip()
        fallback_preview_link = f"{getattr(settings, 'FRONTEND_URL', '')}/preview/safari/itinerary/{client_id}/{version_id}"
        final_preview_link = frontend_preview_link or fallback_preview_link

        def _format_money(value):
            try:
                return f"{float(value):,.2f}"
            except (TypeError, ValueError):
                return "0.00"
        
        context_data = {
            'client_name': clean_client_name,
            'tour_title': version.snapshot_tour_title or version.client_request.tour_title or "Your Safari",
            'tour_code': version.client_request.tour_code or "SAF-2024",
            'company_name': company_name,
            'sender_name': sender_name,
            'preview_link': final_preview_link,
            'grand_total': _format_money(version.version_pricing_snapshot.grand_total) if version.version_pricing_snapshot else "0.00",
            'price_per_person': _format_money(version.version_pricing_snapshot.price_per_person) if version.version_pricing_snapshot else "0.00",
        } 
        
        context = Context(context_data)
        try:
            final_subject = Template(subject).render(context)
            final_body_html = Template(body_html).render(context)
        except TemplateSyntaxError as e:
            logger.warning(f"Template syntax error, using raw content: {e}")

            final_subject = subject
            final_body_html = body_html
        
        text_fallback = f"Dear {context_data['client_name']},\n\nPlease view your personalized itinerary online at:\n{context_data['preview_link']}\n\nWarm regards,\n{sender_name}\n{company_name}"
        

        log = CommunicationLog.objects.create(
            version=version,
            channel=channel,
            template = template,
            recipient=client_info.email,
            sent_by=request.user,
            status="QUEUED"
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



