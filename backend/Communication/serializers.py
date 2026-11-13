from rest_framework import serializers
from Communication.models import CommunicationChannel, CommunicationLog, EmailTemplate
from Itinerary.models import ItineraryVersion


# this to list so as the user can select 
class ListCommunicationChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunicationChannel
        fields = (
            "id", "name"
        )
  

 
class ListEmailTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        fields = ("id", "name","subject","body_html")





