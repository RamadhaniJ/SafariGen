from rest_framework import serializers
from Clients.models import Traveller, RoomSelection, ClientRequestInformation
from Activities.models import Activity
from Meal.models import OptionalMeal
from Itinerary.models import ( 
     SelectedDayRoom, MainDayByDayItinerary,
       ItineraryVersion,
         ItineraryPricingSnapshot ,
         
           )
from django.db import transaction
from django.utils import timezone
import math
import uuid
from Destinations.models import Destination
from Itinerary.pricing import calculate_and_save_pricing_snapshot



class TravellerForEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Traveller
        fields = (
            "id", "age_category", "is_resident", "number"
        )


class RoomSelectionForEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomSelection
        fields = (
            "id", "label", "number"
        )


class ClientRequestInformationForEditSerializer(serializers.ModelSerializer):
    start_destination_name = serializers.CharField(source="start_destination.name", read_only=True, allow_null=True)
    end_destination_name = serializers.CharField(source="end_destination.name", read_only=True, allow_null=True)

    short_client_detail = serializers.SerializerMethodField()

    rooms = RoomSelectionForEditSerializer(source="room_selected", many=True, read_only=True)
    travellers = TravellerForEditSerializer(many=True, read_only=True)  
    
    class Meta:
        model = ClientRequestInformation
        fields = (
            "id",
            "tour_code",
            "tour_title",
            "tour_type",
            "tour_length",
            "country_visited",
            "tour_start_date",
            "start_destination",
            "start_destination_name",
            "end_destination",
            "end_destination_name",
            "request_info",
            "rooms",
            "travellers",

            "short_client_detail"
        )

    def get_short_client_detail(self, obj):
        return {
            "full_name": f"{obj.client_requested.salutation}.  {obj.client_requested.first_name} {obj.client_requested.last_name}",
            "country": obj.client_requested.country
        }


class ActivitiesDataForEditSerializer(serializers.ModelSerializer):
    activity_type_name = serializers.CharField(source="activity_type.title", read_only=True)
    main_location_name = serializers.CharField(source="main_location.location_name", read_only=True, allow_null=True)
    start_location_name = serializers.CharField(source="start_location.location_name", read_only=True, allow_null=True)
    via_location_name = serializers.CharField(source="via_location.location_name", read_only=True, allow_null=True)
    end_location_name = serializers.CharField(source="end_location.location_name", read_only=True, allow_null=True)
    moment_display = serializers.CharField(source="get_moment_display", read_only=True)
    price_per = serializers.CharField(source="get_price_per_display", read_only=True)

    class Meta:
        model = Activity
        fields = (
            "id",
            "activity_type_name",
            "activity_type",
            "main_location_name",
            "main_location",
            "start_location_name",
            "start_location",
            "via_location_name",
            "via_location",
            "end_location_name",
            "end_location",
            "moment",
            "moment_display",
            "transit_fee_included",
            "transit_fee",
            "transit_fee_per",
            "is_optional",
            "optional_activity_price",
            "price_per"
        )


class OptionalMealForEditSerializer(serializers.ModelSerializer):
    meal_name = serializers.CharField(source="meal.name", read_only=True)

    class Meta:
        model = OptionalMeal
        fields = (
            "id",
            "meal_name",
            "meal",
            "is_optional",
            "price"
        )


class SelectedDayRoomForEditSerializer(serializers.ModelSerializer):
    room_type_name = serializers.CharField(source="room_type.name", read_only=True)

    class Meta:
        model = SelectedDayRoom
        fields = (
            "id",
            "room_type_name",
            "room_type",
            "quantity"
        )


class DayByDayItinenaryDataForEditSerialzier(serializers.ModelSerializer):
    activities = ActivitiesDataForEditSerializer(source="day_activities", many=True, read_only=True)
    optional_meals = OptionalMealForEditSerializer(source="day_optionals_meal", many=True, read_only=True)
    selected_rooms = SelectedDayRoomForEditSerializer(many=True, read_only=True)  # ← MAREKEBISHO HAPA

    destination_name = serializers.CharField(source="destination.name", read_only=True, allow_null=True)
    accommodation_name = serializers.CharField(source="accommodation.name", read_only=True, allow_null=True)

    class Meta:
        model = MainDayByDayItinerary
        fields = (
            "id",
            "day_number",
            "nights_number",
            "destination",
            "destination_name",
            "accommodation",
            "accommodation_name",
            "included_meals",
            "selected_rooms",
            "optional_meals",
            "activities",
        )


class ItineraryPricingSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryPricingSnapshot
        fields = (
            "id",
            "total_accommodation",
            "total_park_fees",
            "total_concession_fees",
            "total_transport_vehicle",
            "total_activities",
            "total_optional_meals",
            "subtotal_net",
            "commission_percentage",
            "commission_amount",
            "grand_total",
            "price_per_person"
        )


class VersionForEditSerializer(serializers.ModelSerializer):
    client_info = serializers.SerializerMethodField()
    days = serializers.SerializerMethodField()
    pricing = serializers.SerializerMethodField()

    class Meta:
        model = ItineraryVersion
        fields = (
            "id",
            "version_number",
            "status",
            "is_current",
            "change_summary",
            "client_info",
            "days",
            "pricing",
        )

    def get_client_info(self, obj):
        serializer = ClientRequestInformationForEditSerializer(obj.client_request)
        return serializer.data

    def get_days(self, obj):
        days = obj.version_daybyday.all().order_by("day_number")
        return DayByDayItinenaryDataForEditSerialzier(days, many=True, context=self.context).data

    def get_pricing(self, obj):
        try:
            snapshot = obj.version_pricing_snapshot
            return ItineraryPricingSnapshotSerializer(snapshot).data
        except Exception:
            return None

























class TravellerInputForEditSerializer(serializers.Serializer):

    age_category = serializers.ChoiceField(
        choices=[
            ("ADULT", "Adult (16+)"),
            ("CHILD", "Child (5-15)"),
            ("INFANT", "Infant (0-4)"),
        ]
    )
    number = serializers.IntegerField(min_value=1)
    is_resident = serializers.BooleanField(default=False)





class RoomInputForEditSerializer(serializers.Serializer):
    label = serializers.ChoiceField(
        choices=[
            ("SINGLE", "Single Room"),
            ("DOUBLE", "Double Room"),
            ("TWIN", "Twin Room"),
            ("TRIPLE", "Triple Room"),
            ("FAMILY", "Family Suite"),
        ]
    )
    number = serializers.IntegerField(min_value=1)





class ClientInfoInputForEditSerializer(serializers.Serializer):

    tour_title = serializers.CharField(max_length=250)
    tour_type = serializers.CharField(max_length=100)
    tour_length = serializers.IntegerField(min_value=1)
    tour_start_date = serializers.DateField()
    country_visited = serializers.CharField(max_length=250, required=False, allow_blank=True)
    start_destination = serializers.IntegerField(required=False, allow_null=True)
    end_destination = serializers.IntegerField(required=False, allow_null=True)
    request_info = serializers.CharField(required=False, allow_blank=True)
    
    travellers = TravellerInputForEditSerializer(many=True)
    rooms = RoomInputForEditSerializer(many=True)





class EditItinerarySerializer(serializers.Serializer):

    client_info = ClientInfoInputForEditSerializer()
    days = serializers.ListField(
        child=serializers.DictField(),  
        min_length=1
    )
    change_summary = serializers.CharField(required=False, allow_blank=True, default="")
    commission_percentage = serializers.DecimalField(
        max_digits=5, decimal_places=2, required=False, default=0
    )


    def validate(self, attrs):
        version_id = self.context.get('version_id')
        client_id = self.context.get('client_id')

        if not version_id or not client_id:
                    raise serializers.ValidationError("version id and client id is required.")

                
        try:
            version = ItineraryVersion.objects.get(id=version_id)
        except ItineraryVersion.DoesNotExist:
            raise serializers.ValidationError("Version id Not found.")

        if str(version.client_request.id) != str(client_id):
                    raise serializers.ValidationError(
                        "Incorrect client id. current client id is miss-match"
                    )

        if not version.is_current:
            raise serializers.ValidationError(
                "You can able to edit only the current version."
            )

        self.context['old_version'] = version
        self.context['client_request'] = version.client_request
                
        
       

        client_info = attrs.get('client_info')
        days = attrs.get('days')
        client_request = version.client_request
        

        request = self.context.get('request')
        if request and hasattr(request.user, 'staff_profile'):
            if client_request.client_requested.created_by != request.user.staff_profile:
                raise serializers.ValidationError(
                    "You do not allowed to edit this itinerary."
                )

        for i, day in enumerate(days):
            day_num = day.get('day_number')
            dest_id = day.get('destination_id')
            

            if day_num == 1 and not dest_id and client_request.start_destination:
                day['destination_id'] = client_request.start_destination.id
            elif day_num == client_info.get('tour_length') and not dest_id and client_request.end_destination:
                day['destination_id'] = client_request.end_destination.id
            
            if not day.get('destination_id'):
                raise serializers.ValidationError(
                    f"Day {day_num} has no destination."
                )
        
        return attrs





    def create(self, validated_data):
        old_version = self.context['old_version']
        client_request = self.context['client_request']
        request = self.context.get('request')
        staff = getattr(request.user, 'staff_profile', None) if request else None
        
        client_info = validated_data['client_info']
        days_data = validated_data['days']
        change_summary = validated_data.get('change_summary', '')
        commission_pct = validated_data.get('commission_percentage', 0)
        
        with transaction.atomic():
            # ==========================================
            # HATUA 1: Update ClientRequestInformation (LIVE)
            # ==========================================
            client_request.tour_title = client_info['tour_title']
            client_request.tour_type = client_info['tour_type']
            client_request.tour_length = client_info['tour_length']
            client_request.tour_start_date = client_info['tour_start_date']
            client_request.country_visited = client_info.get('country_visited', '')
            client_request.request_info = client_info.get('request_info', '')
            
            if client_info.get('start_destination'):
                client_request.start_destination_id = client_info['start_destination']
            if client_info.get('end_destination'):
                client_request.end_destination_id = client_info['end_destination']
            
            client_request.save()
            
            # ==========================================
            # HATUA 1b: Update Travellers (delete + recreate)
            # ==========================================
            client_request.travellers.all().delete()
            for trav_data in client_info['travellers']:
                Traveller.objects.create(
                    request=client_request,
                    age_category=trav_data['age_category'],
                    number=trav_data['number'],
                    is_resident=trav_data.get('is_resident', False)
                )
            
            # ==========================================
            # HATUA 1c: Update Rooms (delete + recreate)
            # ==========================================
            client_request.room_selected.all().delete()
            for room_data in client_info['rooms']:
                RoomSelection.objects.create(
                    request=client_request,
                    label=room_data['label'],
                    number=room_data['number']
                )
            
            # ==========================================
            # HATUA 2: Tengeneza ItineraryVersion MPYA
            # ==========================================
            
            # Fanya versions za zamani ziwe is_current=False
            ItineraryVersion.objects.filter(
                client_request=client_request,
                is_current=True
            ).update(is_current=False)
            
            # Tengeneza version mpya
            new_version = ItineraryVersion.objects.create(
                client_request=client_request,
                version_number=old_version.version_number + 1,
                status="DRAFT",
                is_current=True,
                based_on=old_version,
                change_summary=change_summary,
                created_by=staff,
                
                # SNAPSHOT FIELDS (Muhimu!)
                snapshot_tour_title=client_info['tour_title'],
                snapshot_tour_type=client_info['tour_type'],
                snapshot_tour_country_visited=client_info.get('country_visited', ''),
                snapshot_tour_length=client_info['tour_length'],
                snapshot_tour_start_date=client_info['tour_start_date'],
                snapshot_travellers_json=list(client_info['travellers']),
                snapshot_rooms_json=list(client_info['rooms']),
                snapshot_start_destination_id=client_info.get('start_destination'),
                snapshot_end_destination_id=client_info.get('end_destination'),
            )
            
            # ==========================================
            # HATUA 3: Tengeneza Days, Activities, Meals, Rooms
            # ==========================================
            
            # Hesabu total travellers (kwa ajili ya pricing)
            total_travellers = sum(
                t['number'] for t in client_info['travellers']
                if t['age_category'] != 'INFANT'
            )
            
            for day_data in days_data:
                itinerary_day = MainDayByDayItinerary.objects.create(
                    version=new_version,
                    day_number=day_data['day_number'],
                    nights_number=day_data.get('nights', 1),
                    destination_id=day_data['destination_id'],
                    accommodation_id=day_data.get('accommodation_id'),
                    included_meals=", ".join(day_data.get('included_meals', []))
                )
                
                # Save Selected Rooms
                for room_data in day_data.get('selected_rooms', []):
                    SelectedDayRoom.objects.create(
                        day_itinerary=itinerary_day,
                        room_type_id=room_data['room_type_id'],
                        quantity=room_data['quantity']
                    )
                
                # Save Activities
                for act_data in day_data.get('activities', []):
                    final_transit_fee = act_data.get('transit_fee')
                    if act_data.get('transit_fee_included') and final_transit_fee is not None:
                        if act_data.get('transit_fee_per') == 'Pax':
                            final_transit_fee = float(final_transit_fee) * total_travellers
                        elif act_data.get('transit_fee_per') == 'Vehicle':
                            vehicles = math.ceil(total_travellers / 6)
                            final_transit_fee = vehicles * float(final_transit_fee)
                    
                    final_optional_price = act_data.get('optional_activity_price')
                    if act_data.get('is_optional') and final_optional_price is not None:
                        if act_data.get('price_per') == 'PerPersonal':
                            final_optional_price = float(final_optional_price) * total_travellers
                        elif act_data.get('price_per') == 'PerVehicle':
                            vehicles = math.ceil(total_travellers / 6)
                            final_optional_price = float(final_optional_price) * vehicles
                    
                    Activity.objects.create(
                        day_itinerary=itinerary_day,
                        activity_type_id=act_data['activity_type_id'],

                        main_location_id=act_data.get('main_location_id'),
                        start_location_id=act_data.get('start_location_id'),
                        via_location_id=act_data.get('via_location_id'),
                        end_location_id=act_data.get('end_location_id'),
                        moment=act_data['moment'],

                        transit_fee_included=act_data.get('transit_fee_included', False),
                        transit_fee=final_transit_fee,
                        transit_fee_per=act_data.get('transit_fee_per'),

                        is_optional=act_data.get('is_optional', False),
                        optional_activity_price=final_optional_price,
                        price_per=act_data.get('price_per')
                    )
                
                # Save Optional Meals
                for meal_data in day_data.get('optional_meals', []):
                    OptionalMeal.objects.create(
                        day_optional_meal=itinerary_day,
                        meal_id=meal_data['meal_id'],
                        is_optional=meal_data.get('is_optional', True),
                        price=meal_data.get('price', 0.00)
                    )
            
            # ==========================================
            # HATUA 4: Calculate Pricing Mpya
            # ==========================================
            snapshot = calculate_and_save_pricing_snapshot(
                itinerary_version=new_version,
                commission_percentage=commission_pct,
                staff_profile=staff
            )
            
            # Update grand total kwenye ClientRequestInformation (kwa summary)
            client_request.safari_grand_total = snapshot.grand_total
            client_request.price_per_personal = snapshot.price_per_person
            client_request.save(update_fields=['safari_grand_total', 'price_per_personal'])
        
        return {
            "success": True,
            "message": f"Itinerary Version {new_version.version_number} saved successfully",
            "version_id": str(new_version.id),
            "version_number": new_version.version_number,
            "client_id": str(client_request.id),
            "grand_total": str(snapshot.grand_total),
            "price_per_person": str(snapshot.price_per_person),
        }



