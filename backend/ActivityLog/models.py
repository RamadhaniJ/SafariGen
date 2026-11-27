from django.db import models
from uuid6 import uuid7
from Clients.models import(
      ClientInformation, ClientRequestInformation,
      CustomUserModel
     )

from Itinerary.models import  ItineraryVersion

# Create your models here.
  

 


class ActivitiesLogs(models.Model):
        ACTIONS = [
        ("CREATED", "Created"),
        ("UPDATED", "Updated"),
        ("DELETED", "Deleted"),
        ("STATUS_CHANGED", "Status Changed"),

    ]

        MODULE_CHOICES = [
            ("CLIENT", "Client Information"),
            ("REQUEST", "Client Request"),
            ("ITINERARY", "Itinerary / Day-by-Day"),
            ("PRICING", "Pricing / Snapshot"),
        ]

        id = models.UUIDField(primary_key=True, editable=False, default=uuid7)

        client = models.ForeignKey(
             ClientInformation,
             on_delete=models.CASCADE,
             related_name="activities_logs",
        )

        actor = models.ForeignKey(
             CustomUserModel,
             on_delete=models.SET_NULL,
             null=True,
             related_name="client_activities"
        )
        
        client_request = models.ForeignKey(
             ClientRequestInformation,
             on_delete=models.SET_NULL,
             related_name='client_request_logs',
             null=True,
             blank=True
        )

        itinerary_version = models.ForeignKey(
             ItineraryVersion,
             on_delete=models.SET_NULL,
             related_name='version_logs',
             null=True,
             blank=True
        )

        action = models.CharField(max_length=20, choices=ACTIONS)
        module = models.CharField(max_length=20, choices=MODULE_CHOICES, default="CLIENT")


        changes = models.JSONField(default=dict, blank=True)
        description = models.CharField(
                  max_length=255, blank=True, null=True
             )
        
        created_at = models.DateTimeField(auto_now_add=True)
 

        class Meta:
             verbose_name = "staff activity"
             verbose_name_plural = "staff activity log"
             ordering = ['-created_at']
             indexes = [
                  models.Index(fields=["client","-created_at"]),
                  models.Index(fields=["client_request","-created_at"]),
             ]


        def __str__(self):
         return f"{self.actor} {self.action} on {self.module} ({self.client.first_name} {self.client.last_name})"




