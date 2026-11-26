from rest_framework import serializers
from django.db import transaction
from django.core.exceptions import ValidationError
from django.utils import timezone
import math
from django.db.models import Sum
import random

 
from Activities.models import ActivityLocation, ActivityType, Activity
from Destinations.models import Destination
from Configuration.models import HeroSectionImages

from Itinerary.models import (MainDayByDayItinerary,
                               SelectedDayRoom, 
                               ItineraryPricingBreakdownItem, 
                               ItineraryPricingSnapshot, ItineraryVersion)
from Meal.models import OptionalMeal, MealPlan
from Accommodation.models import Accommodation, AccommodationRoomType
from ActivityLog.models import ActivitiesLogs
from Clients.models import ClientRequestInformation, Traveller
from Itinerary.pricing import calculate_and_save_pricing_snapshot
from Itinerary.pdf_cache import schedule_warm




class ActivityItemSerializer(serializers.Serializer):
    activity_type_id = serializers.UUIDField()
    main_location_id = serializers.UUIDField(required=False, allow_null = True)
    start_location_id = serializers.UUIDField(required=False, allow_null = True)
    via_location_id = serializers.UUIDField(required=False, allow_null = True)
    end_location_id = serializers.UUIDField(required=False, allow_null = True)

    moment = serializers.ChoiceField(choices=Activity._meta.get_field("moment").choices)
    transit_fee_included = serializers.BooleanField(default = False)
    transit_fee = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    transit_fee_per = serializers.ChoiceField(choices=Activity._meta.get_field("transit_fee_per").choices, required=False, allow_null=True)
 

    is_optional = serializers.BooleanField(default=False)
    optional_activity_price = serializers.DecimalField(max_digits=10, decimal_places=2, allow_null = True, required=False)
    price_per = serializers.ChoiceField(choices=Activity._meta.get_field("price_per").choices, required=False, allow_null=True)



    def validate(self, attrs):
        try:
            activity_type = ActivityType.objects.get(id = attrs.get("activity_type_id"))
        except ActivityType.DoesNotExist:
            raise serializers.ValidationError("selected activity type does not exist!.")

        if activity_type.involve_transport:
            if not attrs.get("start_location_id") or not attrs.get("end_location_id"):
                raise serializers.ValidationError("Transport activities require start location and end location")
        else:
            if not attrs.get("main_location_id"):
                raise serializers.ValidationError("Activity main location is required")

        if attrs.get("is_optional") and not attrs.get("optional_activity_price"):
            raise serializers.ValidationError("Optional activities must have a price.")
        
        return attrs




class OptionalMealItemSerializer(serializers.Serializer):
    meal_id = serializers.UUIDField()
    is_optional = serializers.BooleanField(default=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, allow_null = True, required=False) 




class SelectedRoomItemSerializer(serializers.Serializer):
    room_type_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)



class DayItineraryItemSerializer(serializers.Serializer):
    day_number = serializers.IntegerField(min_value=1)
    nights = serializers.IntegerField(min_value=1, default=1)

    destination_id = serializers.IntegerField(required=False, allow_null = True)
    accommodation_id = serializers.IntegerField(required=False, allow_null = True)
    included_meals = serializers.ListField(required=False, child=serializers.CharField(), default=list)

    activities = serializers.ListField(child=ActivityItemSerializer(), required=False, default = list)
    optional_meals = serializers.ListField(child=OptionalMealItemSerializer(), default=list, required=False)
    selected_rooms = serializers.ListField(child=SelectedRoomItemSerializer(), default=list, required=False)




class BulkItineraryCreateSerializer(serializers.Serializer):
    client_id = serializers.UUIDField()
    new_tour_length = serializers.IntegerField(min_value=1, required=False)

    commission_percentage = serializers.DecimalField(  # <-- ONGEZA HII
        max_digits=5, decimal_places=2, required=False, default=0
    )
    change_summary = serializers.CharField(
        required=False,
        allow_blank = True,
        default = "",
        help_text = "Reason why change the itinerary."
    )
    days = serializers.ListField(child=DayItineraryItemSerializer(), min_length=1)


    def validate(self, attrs):
        client_id  = attrs.get("client_id")
        days_data = attrs.get("days")
        user = self.context.get("request").user
        new_tour_length = attrs.get("new_tour_length")



        try:
            client = ClientRequestInformation.objects.select_related("client_requested").get(id = client_id)
        except ClientRequestInformation.DoesNotExist:
            raise serializers.ValidationError("Client request information not found")
        

        is_owner = client.client_requested.company.owner == user
        is_member = user.companies.filter(id = client.client_requested.company.id).exists()
        if not (is_owner or is_member):
            raise serializers.ValidationError(
                {"detail": "You don't have access to create this Itinerary."}
            )


        total_travellers = sum(
            t.number for t in client.travellers.all() if t.age_category != "INFANT"
        )

        attrs["client_instance"] = client
        attrs["total_travellers"] = total_travellers





        for day in days_data:
            day_num = day["day_number"]
            dest_id = day.get("destination_id")


            if day_num == 1 and not dest_id and client.start_destination:
                day["destination_id"] = client.start_destination.id

            elif day_num == (attrs.get("new_tour_length") or client.tour_length)  and  not dest_id  and client.end_destination:
                day["destination_id"] = client.end_destination.id


            if not day.get("destination_id"):
                raise serializers.ValidationError(f"Day {day_num} is missing a destination.")


        return attrs
 

    def create(self, validated_data):
        client = validated_data["client_instance"]
        total_travellers = validated_data["total_travellers"]
        days_data = validated_data["days"]

        new_tour_length = validated_data.get("new_tour_length", client.tour_length)
        commission_pct = validated_data.get("commission_percentage", 0)
        change_summary = validated_data.get("change_summary", "")

        with transaction.atomic():

            ItineraryVersion.objects.filter(
                 client_request = client,
                 is_current = True
            ).update( is_current=False)
 
            latest_version = ItineraryVersion.objects.filter(
                client_request = client 
            ).order_by("-version_number").first()
 
            next_version_number = 1 if not latest_version else latest_version.version_number + 1

            new_version = ItineraryVersion.objects.create(
                client_request = client,
                version_number = next_version_number,
                is_current = True,
                based_on = latest_version,
                status="DRAFT",
                change_summary= change_summary,
                created_by = getattr(self.context.get("request"), "user", None),

                snapshot_tour_title=client.tour_title,
                snapshot_tour_type=client.tour_type,
                snapshot_tour_country_visited=client.country_visited,
                snapshot_tour_length=new_tour_length,
                snapshot_tour_start_date=client.tour_start_date,
                snapshot_travellers_json=list(
                    client.travellers.values('age_category', 'number', 'is_resident')
                ),
                snapshot_rooms_json=list(
                    client.room_selected.values('label', 'number')
                ),
                snapshot_start_destination=client.start_destination,
                snapshot_end_destination=client.end_destination,



            )




            client.tour_length = new_tour_length
            client.save(update_fields = ["tour_length"])

            created_days = []


            for day_data in days_data:

                itinerary_day = MainDayByDayItinerary.objects.create(
                    version=new_version,
                    day_number = day_data["day_number"],
                    nights_number = day_data["nights"],
                    destination_id = day_data["destination_id"],
                    accommodation_id = day_data.get("accommodation_id"),
                    included_meals = ", ".join(day_data.get("included_meals", []))
                )

                created_days.append(itinerary_day)

                for room_data in day_data.get("selected_rooms", []):
                    SelectedDayRoom.objects.create(
                        day_itinerary=itinerary_day,
                        room_type_id = room_data["room_type_id"],
                        quantity = room_data["quantity"]
                    )

                for act_data  in day_data.get("activities", []):
                   
                   
                    Activity.objects.create(
                        day_itinerary = itinerary_day,
                        activity_type_id = act_data["activity_type_id"],

                        main_location_id = act_data.get("main_location_id"),
                        start_location_id = act_data.get("start_location_id"),
                        via_location_id = act_data.get("via_location_id"),
                        end_location_id = act_data.get("end_location_id"),
                        moment = act_data["moment"],

                        transit_fee_included = act_data.get("transit_fee_included"),
                        transit_fee = act_data.get("transit_fee"),
                        transit_fee_per = act_data.get("transit_fee_per"),

                        is_optional = act_data.get("is_optional"),
                        optional_activity_price = act_data.get("optional_activity_price"),
                        price_per = act_data.get("price_per")
                    )

                for meal_data in day_data.get("optional_meals", []):
                    OptionalMeal.objects.create(
                        day_optional_meal = itinerary_day,
                        meal_id = meal_data["meal_id"],
                        is_optional = meal_data.get("is_optional"),
                        price = meal_data.get("price", 0.00)
                )


            

            current_user = getattr(self.context.get("request"), "user", None)
            snapshot = calculate_and_save_pricing_snapshot(
                itinerary_version=new_version,
                commission_percentage=commission_pct,
                current_user=current_user
            )
            schedule_warm(new_version.id)  # pre-build the guest PDF once saved

            if client.client_requested.created_by != current_user:
                ActivitiesLogs.objects.create(
                    client = client.client_requested,
                    client_request = client,
                    actor=current_user,
                    itinerary_version= new_version,
                    action="CREATED",
                    changes={
                        "tour_title": new_version.snapshot_tour_title,
                        "status" : new_version.status,
                        "version_number": new_version.version_number,

                    },
                    module="ITINERARY",
                    description=(
                                f"{current_user.full_name or current_user.email} created itinerary version "
                                f"{next_version_number} for client {client.client_requested.first_name} {client.client_requested.last_name} "
                                f"(Client originally created by {client.client_requested.created_by.full_name or client.client_requested.created_by.email})"
                            )
                )
                
        return {"success":True, 
                "message":f"Itinerary Version {next_version_number} saved successfully", 
                "client_id": str(client.id),
                "version_id": str(new_version.id),
                "version_number": next_version_number,
                "grand_total": str(snapshot.grand_total),
                "price_per_person": str(snapshot.price_per_person),
                }

                












    # ============PREVIEW========================================
    # 1. Activities preview   
    # ========================================================       



class ActivitiesPreviewSerializer(serializers.ModelSerializer):
    activity_type_name = serializers.CharField(
        source="activity_type.title", read_only=True,
    )

    main_location_name = serializers.CharField(
            source="main_location.location_name", read_only=True, allow_null=True
        )

    start_location_name = serializers.CharField(
            source="start_location.location_name", read_only=True, allow_null=True
        )

    via_location_name = serializers.CharField(
            source="via_location.location_name", read_only=True, allow_null=True
        )

    end_location_name = serializers.CharField(
            source="end_location.location_name", read_only=True, allow_null=True
        )

    moment_display = serializers.CharField(
        source="get_moment_display", read_only=True
    )

    price_per = serializers.CharField(
        source="get_price_per_display", read_only=True
    )

    class Meta:
        model = Activity
        fields = (
            "id","activity_type_name",
            "main_location_name", "start_location_name",
            "via_location_name","end_location_name",
            "moment", "moment_display",
            "is_optional","optional_activity_price",
            "price_per"

        )



class OptionalMealPreviewSerializer(serializers.ModelSerializer):
    meal_name = serializers.CharField(source="meal.name", read_only=True)

    class Meta:
        model = OptionalMeal
        fields = ("id","meal_name","is_optional", "price")




class SelectedDayRoomPreviewSerializer(serializers.ModelSerializer):
    room_type_name = serializers.CharField(source = "room_type.name", read_only=True)

    class Meta:
        model = SelectedDayRoom
        fields = ("id","room_type_name", "quantity")



class DayByDayPreviewSerializer(serializers.ModelSerializer):
    activities = ActivitiesPreviewSerializer(
        source="day_activities", many=True, read_only=True
    )

    optional_meals = OptionalMealPreviewSerializer(
        source="day_optionals_meal",
        many=True, read_only=True
    )
    selected_rooms = SelectedDayRoomPreviewSerializer(
        many=True, read_only=True
    )


    destination_info = serializers.SerializerMethodField()
    destination_description = serializers.SerializerMethodField()
    destination_images = serializers.SerializerMethodField()


    accommodation_info = serializers.SerializerMethodField()
    accommodation_description = serializers.SerializerMethodField()
    accommodation_images = serializers.SerializerMethodField()


    date_display = serializers.SerializerMethodField()
    context_type = serializers.SerializerMethodField()


    class Meta:
        model = MainDayByDayItinerary
        fields = (
            #1. basic data 
            "id", "day_number","nights_number",
            "date_display", "context_type",

            #2.destinations
            "destination_info","destination_description","destination_images",

           #3. accommodation
            "accommodation_info","accommodation_description","accommodation_images",

            #4.
            "included_meals", "optional_meals", "activities","selected_rooms",
        )

    

    def get_context_type(self, obj):
        total_days = obj.version.snapshot_tour_length if obj.version.snapshot_tour_length else  obj.version.client_request.tour_length
        if obj.day_number == 1:
            return "START"
        elif obj.day_number == total_days:
            return "END"
        
        return "CENTER"

    

    def get_date_display(self, obj):
        start_date = obj.version.snapshot_tour_start_date if obj.version.snapshot_tour_start_date else obj.version.client_request.tour_start_date
        if not start_date:
            return ""

        from datetime import timedelta
        day_date = start_date + timedelta(days=obj.day_number - 1)

        if obj.nights_number <= 1:
            return day_date.strftime("%d %b %Y")
        else:
            end_date = day_date + timedelta(days=obj.nights_number - 1)
            if day_date.month == end_date.month:
                return f"{day_date.day} - {end_date.day} {day_date.strftime("%b %Y")}"
            else:
                return f"{day_date.strftime("%d %b")} - {end_date.strftime("%d %b %Y")}"



    def get_destination_info(self, obj):
        if not obj.destination:
            return None
        
        request = self.context.get("request")
        featured_url = None

        if obj.destination.featured_img:
            if request:
                featured_url = request.build_absolute_uri(obj.destination.featured_img.url)
            else:
                featured_url = obj.destination.featured_img.url

        return {
            "name": obj.destination.name,
            "location":obj.destination.location,
            "featured_image": featured_url
        }



    def get_destination_description(self, obj):
        if not obj.destination:
            return None

        context_type = self.get_context_type(obj)
        used_desc_ids = self.context.get("used_dest_desc_ids", set())

        #1. 
        desc_obj = obj.destination.destination_desc.filter(
            context_type = context_type
        ).exclude(
            id__in = used_desc_ids
        ).first()

        #2.
        if not desc_obj:
            desc_obj = obj.destination.destination_desc.exclude(
                id__in = used_desc_ids
            ).first()

        if not desc_obj:
            desc_obj = obj.destination.destination_desc.first() 


        if desc_obj:
            used_desc_ids.add(desc_obj.id)
            return desc_obj.content

        return None


    def get_destination_images(self, obj):
        if not obj.destination:
            return None

        request = self.context.get("request")
        used_img_ids = self.context.get("used_dest_imgs_ids", set())

        available_imgs = list(
            obj.destination.destination_images.exclude(id__in = used_img_ids)[:3]
        )

        if len(available_imgs) < 3:
            all_imgs = list(
                obj.destination.destination_images.all()
            )

            for img in all_imgs:
                if len(available_imgs) >= 3:
                    break

                if img.id not in used_img_ids:
                    available_imgs.append(img)

        if not available_imgs:
            return None

        
        
        for img in available_imgs:
            used_img_ids.add(img.id)



        # A. img url 
        image_urls = []
        for img in available_imgs:
            if request:
                image_urls.append(request.build_absolute_uri(img.images.url))
            else:
                image_urls.append(img.images.url)


        return image_urls



    def get_accommodation_info(self, obj):
        if not obj.accommodation:
            return None

        request = self.context.get("request")
        featured_url = None

        if obj.accommodation.featured_image:
            if request:
               featured_url = request.build_absolute_uri(obj.accommodation.featured_image.url)
            else:
                featured_url = obj.accommodation.featured_image.url



        return {
            "name":obj.accommodation.name,
            "tag_label": obj.accommodation.tag_label,
            "featured_image":featured_url,
            "location":f"Inside {obj.accommodation.destination.name}" if (obj.accommodation.park_status == "InsidePark" and obj.accommodation.destination) else None

        }





    def get_accommodation_description(self, obj):
        if not obj.accommodation:
            return None

        used_desc_ids = self.context.get("used_acc_desc_ids", set())

        # 1.
        desc_obj = obj.accommodation.accommodation_desc.exclude(
            id__in = used_desc_ids
        ).first()

        # 2.
        if not desc_obj:
            desc_obj = obj.accommodation.accommodation_desc.first()


        if desc_obj:
            used_desc_ids.add(desc_obj.id)
            return desc_obj.description

        return None



    def get_accommodation_images(self, obj):
        if not obj.accommodation:
            return None


        request = self.context.get("request")
        used_imgs_ids = self.context.get("used_acc_imgs_ids", set())

        available_images = list(
            obj.accommodation.accommodation_images.exclude(id__in = used_imgs_ids)[:5]
        )

        if len(available_images) < 5:
            all_images = list(obj.accommodation.accommodation_images.all())

            for img in all_images:
                if len(available_images) >= 5:
                    break
                if img.id not in used_imgs_ids:
                    available_images.append(img)



        if not available_images:
            return None

        for img in available_images:
            used_imgs_ids.add(img.id)


        images_url = []
        for img in available_images:
            if request:
                images_url.append(
                    request.build_absolute_uri(img.images.url)
                )
            else:
                images_url.append(img.images.url)

        return images_url










class ClientInformationPreviewSerializer(serializers.ModelSerializer):
    tour_code = serializers.ReadOnlyField(source="client_request.tour_code")
    

    tour_title = serializers.SerializerMethodField()
    tour_length = serializers.SerializerMethodField()
    tour_start_date = serializers.SerializerMethodField()
    
    country_visited = serializers.ReadOnlyField(source="snapshot_tour_country_visited")
    tour_type = serializers.ReadOnlyField(source="snapshot_tour_type")
    
    salutation = serializers.ReadOnlyField(source="client_request.client_requested.salutation")
    first_name = serializers.ReadOnlyField(source="client_request.client_requested.first_name")
    last_name = serializers.ReadOnlyField(source="client_request.client_requested.last_name")
    
    start_destination = serializers.ReadOnlyField(source="snapshot_start_destination.name")
    end_destination = serializers.ReadOnlyField(source="snapshot_end_destination.name")
    
    #_________________COMPANY INFO________________
    creator_full_name = serializers.ReadOnlyField(source="created_by.full_name", allow_null=True)
    company_phone = serializers.ReadOnlyField(source="client_request.client_requested.company.phone_number", allow_null=True)
    company_email = serializers.ReadOnlyField(source="client_request.client_requested.company.email", allow_null=True)
    company_name = serializers.ReadOnlyField(source="client_request.client_requested.company.name", allow_null=True)
    company_website = serializers.ReadOnlyField(source="client_request.client_requested.company.website", allow_null=True)
    company_country = serializers.ReadOnlyField(source="client_request.client_requested.company.country", allow_null=True)
    company_logo = serializers.SerializerMethodField()

    #____________________________________________________

    
    total_travellers = serializers.SerializerMethodField(allow_null=True, required=False)
    safari_grand_total = serializers.SerializerMethodField(allow_null=True, required=False)
    price_per_personal = serializers.SerializerMethodField(allow_null=True, required=False)

    class Meta:
        model = ItineraryVersion
        fields = (
            "tour_code", "tour_title", "tour_length", "tour_start_date",

            "safari_grand_total", "price_per_personal",

            "country_visited", "tour_type", "start_destination", "end_destination",
            "salutation", "first_name", "last_name",

            #_________COMPANY____DATA:
            "creator_full_name",
            "company_phone",
            "company_email",
            "company_name",
            "company_website",
            "company_country",
            "company_logo",




            "total_travellers"
        )

    # NEW METHODS - Fallback kwa snapshot
    def get_tour_title(self, obj):
        return obj.snapshot_tour_title or obj.client_request.tour_title

    def get_tour_length(self, obj):
        return obj.snapshot_tour_length or obj.client_request.tour_length

    def get_tour_start_date(self, obj):
        return obj.snapshot_tour_start_date or obj.client_request.tour_start_date

    def get_total_travellers(self, obj):
        travellers_data = obj.snapshot_travellers_json or []
        
        category_map = {}
        for item in travellers_data:
            cat = item.get("age_category")
            num = item.get("number", 0)
            if cat:
                category_map[cat] = category_map.get(cat, 0) + num

        summary_parts = []
        categories = [
            ("ADULT", "Adult", "Adults"),
            ("CHILD", "Child", "Children"),
            ("INFANT", "Infant", "Infants"),
        ]

        for code, singular, plural in categories:
            count = category_map.get(code, 0)
            if count > 0:
                label = singular if count == 1 else plural
                summary_parts.append(f"{count} {label}")

        return ", ".join(summary_parts) if summary_parts else "0 Travellers"

    def get_safari_grand_total(self, obj):
        try:
            return str(obj.version_pricing_snapshot.grand_total)
        except Exception:
            return None

    def get_price_per_personal(self, obj):
        try:
            return str(obj.version_pricing_snapshot.price_per_person)
        except Exception:
            return None

    def get_company_logo(self, obj):
        if obj.client_request.client_requested.company.logo:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.client_request.client_requested.company.logo.url)
            else:
                return obj.client_request.client_requested.company.logo.url
            
        return None
















class MainItineraryPreviewSerializer(serializers.Serializer):
    client_info = serializers.SerializerMethodField()
    days = serializers.SerializerMethodField()
    map_image_url = serializers.SerializerMethodField()

    version_info = serializers.SerializerMethodField()
 


    def get_version_info(self, obj):
        return {
            "version_id": str(obj.id),
            "version_number": obj.version_number,
            "status": obj.status,
            "is_current": obj.is_current,
            "change_summary": obj.change_summary,
            "created_at": obj.created_at,
        }



    def get_client_info(self, obj):
        serializer = ClientInformationPreviewSerializer(obj, context = self.context)
        return serializer.data


    def get_days(self, obj):

        all_days = obj.version_daybyday.all().order_by("day_number") 

        if "used_dest_desc_ids" not in self.context:
            self.context["used_dest_desc_ids"] = set()
        if "used_dest_imgs_ids" not in self.context:
            self.context["used_dest_imgs_ids"] = set()


        if "used_acc_desc_ids" not in self.context:
            self.context["used_acc_desc_ids"] = set()
        if "used_acc_imgs_ids" not in self.context:
            self.context["used_acc_imgs_ids"] = set()


        result = []
        for day in all_days:
            serializer = DayByDayPreviewSerializer(day, context = self.context)
            result.append(serializer.data)

        return result

    



 
    def get_map_image_url(self, obj):
        try:
            snapshot = obj.version_pricing_snapshot
            if snapshot.map_image:
               request = self.context.get("request")
               if request:
                   return { 
                       "map_image":request.build_absolute_uri(snapshot.map_image.url),
                       "grand_total": snapshot.grand_total,
                       "price_per_person": snapshot.price_per_person
                       
                   } 

               return {
                    "map_image":snapshot.map_image.url,
                    "grand_total": snapshot.grand_total,
                    "price_per_person": snapshot.price_per_person
               } 

            else:
                return {
                    "grand_total": snapshot.grand_total,
                    "price_per_person": snapshot.price_per_person
               } 

        except ItineraryPricingSnapshot.DoesNotExist:
            return None
    


















#======================================================================
# 1. Serializer kwa ajili ya Pricing Breakdown Items (Siku kwa siku)
class PricingBreakdownItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryPricingBreakdownItem
        fields = (
            "id", "day_number", "date_display", "category", "item_title", 
            "item_description", "unit_price", "quantity", "unit_label", "line_total"
        )



class PricingSnapshotSerializer(serializers.ModelSerializer):
    

    generated_by = serializers.CharField(
        source="generated_by.full_name", 
        read_only=True, 
        default=None
    )
     

    breakdown_items = PricingBreakdownItemSerializer(many=True, read_only=True)

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
            "price_per_person",
            "generated_by",
            "breakdown_items",  
            "created_at",
            "updated_at"
        )
















# ==========================================
# 1. VERSION DETAIL SERIALIZER  (list)
# ==========================================
class VersionDetailSerializer(serializers.ModelSerializer):
    tour_code = serializers.CharField(source="client_request.tour_code")
    grand_total = serializers.SerializerMethodField()
    price_per_person = serializers.SerializerMethodField()

    sent_count = serializers.SerializerMethodField()
    client_name = serializers.SerializerMethodField()

    created_by = serializers.ReadOnlyField(source="created_by.full_name")
    company_name = serializers.SerializerMethodField()
     
    class Meta:
        model = ItineraryVersion 
        fields = (
            "id",
            "version_number",
            "status",
            "is_current",
            "change_summary",
            "created_by", 
            "company_name",
            "created_at",


            "tour_code",
            "snapshot_tour_title",
            "snapshot_tour_type",
            "snapshot_tour_country_visited",
            "snapshot_tour_length",
            "snapshot_tour_start_date",
          

            "grand_total",
            "price_per_person",
            "sent_count",
            "client_name",
        )
    
    def get_company_name(self, obj):
        # Prioridad 1: Company ya client (hii ndio tour operator anayemiliki lead)
        try:
            company = obj.client_request.client_requested.company
            if company and company.name:
                return company.name
        except AttributeError:
            pass
        

        if obj.created_by:
            first_company = obj.created_by.companies.first()
            if first_company:
                return first_company.name
        
        return None
    
    def get_grand_total(self, obj):
        try:
            return str(obj.version_pricing_snapshot.grand_total)
        except ItineraryPricingSnapshot.DoesNotExist:
            return None
    
    def get_price_per_person(self, obj):
        try:
            return str(obj.version_pricing_snapshot.price_per_person)
        except ItineraryPricingSnapshot.DoesNotExist:
            return None
    
    def get_sent_count(self, obj):
        return obj.communication_logs.count()

    
    def get_client_name(self, obj):
        client = obj.client_request.client_requested
        return f"{client.salutation}. {client.first_name} {client.last_name}"




# ==========================================
# 2. CLIENT CONTAINER SERIALIZER 
# ==========================================
class ClientContainerSerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()
    versions = serializers.SerializerMethodField()
    country = serializers.CharField(source="client_requested.country", allow_null=True, read_only=True)
    
    class Meta:
        model = ClientRequestInformation
        fields = (
            "id",
            "country",
            "cover_image",
            "versions",  
        )
    

    
    def get_cover_image(self, obj):
        selected_cover_image = None
        tour_title_lower = (obj.tour_title or "").lower()
        
        hero_images = list(HeroSectionImages.objects.only("image", "image_tag"))
        request = self.context.get("request")
        
        for hero_obj in hero_images:
            if hero_obj.image_tag and hero_obj.image_tag.lower() in tour_title_lower:
                if request:
                    selected_cover_image = request.build_absolute_uri(hero_obj.image.url)
                else:
                    selected_cover_image = hero_obj.image.url
                break
        
        if not selected_cover_image and hero_images:
            random_hero = random.choice(hero_images)
            if request:
                selected_cover_image = request.build_absolute_uri(random_hero.image.url)
            else:
                selected_cover_image = random_hero.image.url
        
        return {
            "hero_image": selected_cover_image,
        }
    
    def get_versions(self, obj):
        versions = obj.itinerary_versions.all().order_by('-version_number')
        return VersionDetailSerializer(
            versions,
            many=True,
            context=self.context
        ).data



