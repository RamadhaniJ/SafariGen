from rest_framework import serializers
from Clients.models import ClientInformation, ClientRequestInformation, Traveller, RoomSelection
from Users.models import Company, CustomUserModel
from ActivityLog.models import ActivitiesLogs
from Destinations.models import Destination
from django.utils import timezone
from django.db import transaction
from Configuration.models import ConfigurationData


from Destinations.Serializer import DestinationListSerializer
import math 
 
 

 
def track_model_changes(instance, validated_data):
    changes = {}
    for field, new_value in validated_data.items():
        old_value = getattr(instance, field)
        if old_value != new_value:
             changes[field] = {
                                "from": str(old_value) if old_value is not None else None,
                                "to": str(new_value) if new_value is not None else None
                            }
    return changes
  
 

# ===================== STEP 1. CREATE A CLIENTS INFORMATIONS 
class ClientInformationSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(
            required=True,
            queryset= Company.objects.all(),
        )

    class Meta:
        model = ClientInformation
        fields = (
            "id", "company", "created_by", "email",

            "salutation","first_name","last_name",

            "country","phone","source","created_at"
        )

        read_only_fields = (
            "id","created_by","created_at"
        )

    def validate(self, attrs):
        user = self.context.get("request").user
        company = attrs.get("company")


        email = attrs.get("email")
        email_qs = ClientInformation.objects.filter(email__iexact=email)
        if self.instance:
            email_qs = email_qs.exclude(id = self.instance.id)
        if email_qs.exists():
            raise serializers.ValidationError("It seem you already have this client. Select them to proceed.")



        if company.status != "VERIFIED":
            raise serializers.ValidationError("Client must originate from a verified company. ")

        is_owner = company.owner == user
        is_member = user.companies.filter(pk = company.pk).exists()
        
        if not (is_owner or is_member):
            raise serializers.ValidationError("You don't have access to this company.")
        
        return super().validate(attrs)

    

    def create(self, validated_data):
        user = self.context.get("request").user
        validated_data["created_by"] = user
        return super().create(validated_data)


    def update(self, instance, validated_data):
        user = getattr(self.context.get("request"), "user", None)

        new_company = validated_data.get("company")
        is_owner = instance.company.owner == user
        is_member = user.companies.filter(pk = instance.company.pk).exists()
        
        if not (is_owner or is_member):
                raise serializers.ValidationError(
                    {"detail": "You don't have access to update this client."}
                )
    

        if new_company and new_company != instance.company:
            is_new_owner = new_company.owner == user
            is_new_member = user.companies.filter(id = new_company.id).exists()

            if not (is_new_member or is_new_owner):
                raise serializers.ValidationError(
                      {"detail": "You don't have access to update this client."}
                    )




        with transaction.atomic():
                changes = track_model_changes(instance=instance, validated_data=validated_data)
                updated_instance = super().update(instance, validated_data)

                if instance.created_by != user:

                   if changes:
                        ActivitiesLogs.objects.create(
                            client = updated_instance,
                            actor = user,
                            action = "UPDATED",
                            changes = changes,
                            module = "CLIENT",
                            description=f"{user.full_name or user.email} updated this client. (Originally created by {instance.created_by.full_name or instance.created_by.email})"
                        )

        return updated_instance

 



class ShortCompanyInfoToCreateClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = (
            "id","owner","name","logo"
        )



class ClientInformationListSerializer(serializers.ModelSerializer):
    company_id = serializers.UUIDField(source="company.id")
    company_name = serializers.CharField(source="company.name")
    company_logo = serializers.SerializerMethodField()
    created_by = serializers.CharField(source="created_by.full_name")

    user_role = serializers.CharField(source="created_by.role")
    class Meta:
        model = ClientInformation
        fields = (
                    "id",
                      "company_name","company_logo","company_id",
                     
                      "created_by","user_role",

                      "email", "salutation","first_name","last_name",
                    "country","phone","source","created_at"
                )

    def get_company_logo(self, obj):
            if  obj.company.logo:
                  request = self.context.get("request")
                  if request:
                      return request.build_absolute_uri(obj.company.logo.url)
                  else:
                    return obj.company.logo.url
        





 





 

# ======================= STEP 2.

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




 
 

#______________________________ 2. CLIENT REQUEST INFORMATION
class CreateClientRequestInformationSerializer(serializers.ModelSerializer):
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
        user = self.context.get("request").user
        client = attrs.get("client_requested")
        start_date = attrs.get("tour_start_date")
        current_date = timezone.now().date()

        is_owner = client.company.owner == user
        is_member = user.companies.filter(id = client.company.id).exists()

        if not (is_owner or is_member):
            raise serializers.ValidationError(
                {"client_requested": "You don't have access to this client's company."}
            )


        if start_date and start_date < current_date:
            raise serializers.ValidationError("Start date cannot be in the past.")
        
        return super().validate(attrs)



    @transaction.atomic
    def create(self, validated_data):
        current_user = getattr(self.context.get("request"), "user", None)
        if current_user is None:
            raise serializers.ValidationError("You are not allowed here")

        client = validated_data.get("client_requested")
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


    
        if client.created_by != current_user:
                ActivitiesLogs.objects.create(
                    client = client,
                    client_request = request_instance,
                    actor = current_user,
                    action = "CREATED",
                    changes = {
                            "tour_code": request_instance.tour_code,
                            "tour_title": request_instance.tour_title,
                            "tour_type": request_instance.tour_type,
                        },
                    module = "REQUEST",
                    description=(
                                f"{current_user.full_name or current_user.email} created a request for "
                                f"client {client.first_name} {client.last_name} "
                                f"(Client originally created by {client.created_by.full_name or client.created_by.email})"
                            )
                )




        return request_instance
    

    @transaction.atomic
    def update(self, instance, validated_data):
        user = self.context.get("request").user
        client = instance.client_requested

        is_owner = client.company.owner == user
        is_member = user.companies.filter(id = client.company.id).exists()

        if not (is_owner or is_member):
            raise serializers.ValidationError(
                {"detail": "You don't have access to update this request."}
            )

        travellers_data = validated_data.pop('travellers', None)
        rooms_data = validated_data.pop("room_selected", None)

        with transaction.atomic():
            changes = track_model_changes(instance, validated_data)
            updated_instance = super().update(instance, validated_data)


            if travellers_data is not None:
                instance.travellers.all().delete()

                for traveller in travellers_data:
                    Traveller.objects.create(
                        request=updated_instance,
                        **traveller
                    )

            if rooms_data is not None:
                instance.room_selected.all().delete()

                for room in rooms_data:
                    RoomSelection.objects.create(
                        request=updated_instance,
                        **room
                    )

            

            if client.created_by != user:
                
                if changes:
                    ActivitiesLogs.objects.create(
                        client=client,
                        client_request=updated_instance,
                        actor=user,
                        action="UPDATED",
                        changes=changes,
                        module="REQUEST",
                        description=(
                            f"{user.full_name or user.email} updated request for "
                            f"client {client.first_name} {client.last_name} "
                            f"(Client created by {client.created_by.full_name or client.created_by.email})"
                        )
                    )
        return updated_instance



    







#______________________________________STEP: 3. PREVIEW _______________________
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
    start_destination_info = serializers.SerializerMethodField()
    end_destination_info = serializers.SerializerMethodField()

    travellers = TravellerSerializer(many=True, required=False)
    room_selected = RoomSelectionSerializer(many=True, required=False)

 

    vehicle_rent_pricing = serializers.SerializerMethodField()

    class Meta:
        model = ClientRequestInformation
        fields = (
            "id","tour_title",
            "tour_type","tour_length",
            "tour_start_date", 

            "start_destination_info",
            "end_destination_info",

            "vehicle_rent_pricing",

            "travellers",
            "room_selected"
        )
 

    def get_vehicle_rent_pricing(self, obj):
            config = ConfigurationData.objects.first()
            if config and config.vehicle_rent_pricing:
                return {"vehicle_rent_pricing": float(config.vehicle_rent_pricing)}

            return {"vehicle_rent_pricing": 250.00} 


    def get_start_destination_info(self, obj):
        if not obj.start_destination:
            return None

        return DestinationListSerializer(
            obj.start_destination,
            context = {
                "request": self.context.get("request"),
                 "client_request_id": str(obj.id), 
                }
        ).data



    def get_end_destination_info(self, obj):
        if not obj.end_destination:
            return None

        return DestinationListSerializer(
            obj.end_destination,
            context = {
                "request": self.context.get("request"),
                 "client_request_id": str(obj.id), 
                 }
        ).data
               