from django.db import models
from uuid6 import uuid7
from Itinerary.models import ItineraryVersion
from Users.models import CustomUserModel

# Create your models here.
class CommunicationChannel(models.Model):
    id = models.UUIDField(default=uuid7, primary_key=True, editable=False)
    name = models.CharField(unique=True, max_length=100, help_text="EMAIL, WHATSAPP, SMS")
    is_active= models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):  
        return self.name





 

class EmailTemplate(models.Model):
    id = models.UUIDField(default= uuid7, primary_key=True, editable=False)
    name = models.CharField(max_length=100, unique=True, help_text="eg. Default safari Quote, (Follow up Template, Template for new Quote.)")

    subject = models.CharField(
        max_length=255,
        help_text="eg. Your safari Proposal: {{tour_code}} - {{company_name}}"
    )

    body_html = models.TextField(
        help_text="HTML body of email {{client_ame}}, {{tour_title}}, {{grand_total}}, {{preview_link}}"

    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.name

    






 
class CommunicationLog(models.Model):
    id = models.UUIDField(default= uuid7, primary_key=True, editable=False)

    version = models.ForeignKey(
        ItineraryVersion,
        on_delete=models.CASCADE,
        related_name="communication_logs",
        help_text="Itinerary version sent to guest."
    )

    channel = models.ForeignKey(
        CommunicationChannel, 
        on_delete=models.CASCADE, 
        related_name="channel_logs"
        ) 

    template = models.ForeignKey(
        EmailTemplate,
        on_delete=models.SET_NULL, blank=True, null=True
    )

    recipient = models.CharField(
        max_length=255,
        help_text="Email address or phone number of the guest"
    )

    sent_by = models.ForeignKey(
        CustomUserModel,
        on_delete=models.CASCADE,
        related_name="user_sent_quote",
        blank=True, null=True
    )

    STATUS_CHOICES = [
        ("QUEUED", "Queued"),
        ("SENT", "Sent Successfully"),
        ("FAILED", "Failed to Send"),
        ("DELIVERED", "Delivered"),
        ("READ", "Read by Guest"),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='QUEUED')

    error_message = models.TextField(blank=True, null=True, help_text="reason why message failed")
    external_message_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Message ID from email/WhatsApp provider"
    )
    

    sent_at = models.DateTimeField(auto_now_add=True)

    delivered_at = models.DateTimeField(blank=True, null=True)
    read_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-sent_at']


    def __str__(self):
        return f"{self.version} sent via {self.channel} to {self.recipient} ({self.status})"







