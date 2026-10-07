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



class EmailTemplateListSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        fields = ("id", "name","subject","body_html")






class ItineraryEmailSendSerializer(serializers.Serializer):
    version_id = serializers.UUIDField(required=True)
    channel_id = serializers.UUIDField(required=True)
    template_id = serializers.UUIDField(required=True)  
    
    subject = serializers.CharField(max_length=255, required=True)
    body_html = serializers.CharField(required=True)  
    custom_note = serializers.CharField(required=False, allow_blank=True, max_length=1000)

    def validate_channel_id(self, value):
        try:
            channel = CommunicationChannel.objects.get(id=value, is_active=True)
            if channel.name.upper() != "EMAIL":
                raise serializers.ValidationError("Currently, only EMAIL channel is supported.")
            return channel
        except CommunicationChannel.DoesNotExist:
            raise serializers.ValidationError("Invalid or inactive communication channel.")

    def validate_version_id(self, value):
        try:
            return ItineraryVersion.objects.select_related(
                'client_request__client_requested',
                'created_by'
            ).get(id=value)
        except ItineraryVersion.DoesNotExist:
            raise serializers.ValidationError("Itinerary version not found.")
    
    def validate_template_id(self, value):
        try:
            return EmailTemplate.objects.get(id=value, is_active=True)
        except EmailTemplate.DoesNotExist:
            raise serializers.ValidationError("Invalid or inactive email template.")


        
        