from rest_framework import serializers
from Clients.models import ClientInformation, ClientRequestInformation, Traveller, RoomSelection
from Destinations.models import Destination
from django.utils import timezone
from django.db import transaction
from Configuration.models import ConfigurationData

import math
 

# 1. CREATE A CLIENTS INFORMATIONS 
class ClientInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientInformation
        fields = (
            "id","created_by","email",

            "salutation","first_name","last_name",

            "country","phone","source","created_at"
        )

        read_only_fields = (
            "id","created_by","created_at"
        )

    def validate(self, attrs):
        email = attrs.get("email")
        instance = getattr(self, "instance", None)
        if (ClientInformation.objects.filter(email=email).exclude(id = getattr(instance, "id", None)).exists()):
            raise serializers.ValidationError("It seem you already have this client. Select them to proceed.")
        return super().validate(attrs)

    

    def create(self, validated_data):
        user = self.context.get("request").user
        staff =  getattr(user, "staff_profile", None)
        if staff is None:
            raise serializers.ValidationError("You are not allowed here!.")

        validated_data["created_by"] = staff
        return super().create(validated_data)


    def update(self, instance, validated_data):
        staff = getattr(self.context.get("request").user, "staff_profile", None)
        if staff is None:
            raise serializers.ValidationError("You are not allowed here")

        if instance.created_by != staff:
            raise serializers.ValidationError("You are not allowed to update this Client")
        
        return super().update(instance, validated_data)

 




 




class TravellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Traveller
        fields = ( "id", "age_category","is_resident", "number" )


class RoomSelectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomSelection
        fields = (
            "id","label","number"
        )





 

# 2. REQUEST CLIENT INFORMATION
class ClientRequestInformationSerializer(serializers.ModelSerializer):
    start_destination = serializers.PrimaryKeyRelatedField(
        queryset = Destination.objects.all()
    )
    end_destination = serializers.PrimaryKeyRelatedField(
        queryset = Destination.objects.all()
    )

    client_requested = serializers.PrimaryKeyRelatedField(
        queryset = ClientInformation.objects.all(),
    ) # this is a reall client. 


    travellers = TravellerSerializer(many=True, required=False)
    room_selected = RoomSelectionSerializer(many=True, required=False)

    start_destination_name = serializers.CharField(source="start_destination.name", required=False)
    end_destination_name = serializers.CharField(source="end_destination.name", required=False)



    class Meta:
        model = ClientRequestInformation
        fields = (
            "id","tour_code","client_requested",

            "tour_title","tour_type","tour_length",

            "country_visited","tour_start_date",

            "start_destination","end_destination",

            "request_info", "travellers","room_selected",
            "created_at",

            "start_destination_name","end_destination_name"

        )
        read_only_fields = ("id","tour_code","created_at")
    
 
    def validate(self, attrs):
        start_date = attrs.get("tour_start_date")
        current_date = timezone.now().date()

        if start_date < current_date:
            raise serializers.ValidationError("Start date can not be the previous date")
        
        return super().validate(attrs)



    @transaction.atomic
    def create(self, validated_data):
        staff = getattr(self.context.get("request").user, "staff_profile", None)
        if staff is None:
            raise serializers.ValidationError("You are not allowed here")

        client = validated_data.get("client_requested")

        if client.created_by != staff:
            raise serializers.ValidationError("You are not allowed to create a tour info for this client")


        travellers_data = validated_data.pop('travellers', [])
        rooms_data = validated_data.pop("room_selected", [])

     
        request_instance = super().create(validated_data)

        for traveller in travellers_data:
            Traveller.objects.create(
                request = request_instance,
                **traveller
            )

        for room in rooms_data:
            RoomSelection.objects.create(
                request = request_instance,
                **room
            )


        return request_instance


    

    @transaction.atomic
    def update(self, instance, validated_data):
        if instance.client_requested.created_by != self.context.get("request").user.staff_profile:
            raise serializers.ValidationError("You are not allowed to update this client")

        room_data = validated_data.pop("room_selected", [])
        traveller_data = validated_data.pop("travellers", [])



        request_update = super().update(instance, validated_data)

        if room_data is not None: 
            RoomSelection.objects.filter( 
                request = request_update
            ).delete()


            for room in room_data:
                RoomSelection.objects.create(
                    request = request_update,
                    **room
                )

  


        if traveller_data is not None:
            Traveller.objects.filter(request = request_update).delete()


            for traveller in traveller_data:
                Traveller.objects.create(
                    request=request_update,
                    **traveller
                )

        return request_update




class ClientInformationToPreviewSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="client_requested.email", required=False)
    salutation = serializers.CharField(source="client_requested.salutation", required=False)
    first_name = serializers.CharField(source="client_requested.first_name", required=False)
    last_name = serializers.CharField(source="client_requested.last_name", required=False)

    country = serializers.CharField(source="client_requested.country", required=False)
    phone = serializers.CharField(source="client_requested.phone", required=False)
    source = serializers.CharField(source="client_requested.source", required=False)

    start_destination = serializers.CharField(source="start_destination.name", required=False)
    end_destination = serializers.CharField(source="end_destination.name", required=False)




    travellers = TravellerSerializer(many=True, required=False)
    room_selected = RoomSelectionSerializer(many=True, required=False)

    class Meta:
        model = ClientRequestInformation
        fields = (
            # personal info
            "email","salutation","first_name","last_name",
            "country","phone","source",


            # request Info
            "id","tour_code","tour_title","tour_type",
            "tour_length","country_visited","tour_start_date",
            "start_destination","end_destination","request_info",

            "travellers","room_selected"


        )






class SmallClientInfoToBuildItinerarySerializer(serializers.ModelSerializer):
    start_destination = serializers.ReadOnlyField(source="start_destination.name")
    end_destination = serializers.ReadOnlyField(source="end_destination.name")

    travellers = TravellerSerializer(many=True, required=False)
    room_selected = RoomSelectionSerializer(many=True, required=False)



    vehicle_rent_pricing = serializers.SerializerMethodField()

    class Meta:
        model = ClientRequestInformation
        fields = (
            "id","tour_title",
            "tour_type","tour_length",
            "tour_start_date", 

            "start_destination",
            "end_destination",

            "vehicle_rent_pricing",

            "travellers",
            "room_selected"
        )
 

    def get_vehicle_rent_pricing(self, obj):
            config = ConfigurationData.objects.first()
            if config and config.vehicle_rent_pricing:
                return {"vehicle_rent_pricing": float(config.vehicle_rent_pricing)}

            return {"vehicle_rent_pricing": 250.00} 