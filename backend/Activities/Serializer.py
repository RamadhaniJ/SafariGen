from rest_framework import serializers
from Activities.models import ActivityType, ActivityLocation


 
# 1. LIST ACTIVITIES TYPES TO PERFORM LIVE SEARCH 
class ActivitiesTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityType
        fields = (
            "id",
            "title",
            "involve_transport"
        ) 

# 1. LIST ACTIVITIES LOCATION TO PERFORM LIVE SEARCH 
class ActivitiesLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLocation
        fields = (
            "id",
            "location_name",
        ) 
