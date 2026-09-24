from rest_framework import serializers
from Accommodation.models import (
     Accommodation, AccommodationImages,
 AccommodationRoomType, RoomRate, AccommodationSeason  
 )

from Clients.models import ClientRequestInformation



# class AccommodationRoomTypesSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AccommodationRoomType? nataka hapa kila accommodation 
#         itakayo chaguliwa ije na room zake na price ili user akiwa anabadilisha kwenye react? 
#         inamuonesha auto pricing na pia (accommodation ikichaguliwa inakuja na zile defaul rooms)





class AccommodationSerializer(serializers.ModelSerializer):
    calculated_concesion_fee = serializers.SerializerMethodField()
    available_room_rates = serializers.SerializerMethodField()
    default_client_rooms = serializers.SerializerMethodField()

    destination_name = serializers.ReadOnlyField(source="destination.name", required=False)

    featured_image = serializers.SerializerMethodField(required=False)

    class Meta:
        model = Accommodation
        fields = (
            "id",
            "name",
            "is_sponsored",
            "tag_label",
            "park_status",
            "featured_image",

            "destination",
            "destination_name",


            "calculated_concesion_fee",
            "available_room_rates",
            "default_client_rooms"
        )

    def get_featured_image(self, obj):
        request = self.context.get("request")
        if  request and obj.featured_image:
            return request.build_absolute_uri(obj.featured_image.url)
        else:
            return obj.featured_image.url
        

    def _get_client_request(self):
        client_request_id = self.context.get("client_request_id")

        if not client_request_id:
            return None
        try:
            return ClientRequestInformation.objects.prefetch_related(
                "travellers","room_selected","client_requested"
            ).get(id=client_request_id)
        except ClientRequestInformation.DoesNotExist:
            return None


    def _determine_season(self, accommodation, tour_date):
        if not tour_date:
            return None

        t_month = tour_date.month
        t_day = tour_date.day

        tour_md = (t_month, t_day)

        seasons = AccommodationSeason.objects.filter(
            accommodation=accommodation,
        )

        for season in seasons:
            start_md = (season.start_month, season.start_day)
            end_md = (season.end_month, season.end_day)

            if start_md <= end_md:
                if start_md <= tour_md <= end_md:
                    return season
            else:
                if tour_md >= start_md or tour_md <= end_md:
                    return season

        return None


    def get_calculated_concesion_fee(self, obj):
        if obj.park_status != "InsidePark":
            return {
                "is_inside_park": False,
                "per_adult": 0.0,
                "per_child": 0.0,
                "total_adult_concession": 0.0,
                "total_child_concession": 0.0
            }

        client_req = self._get_client_request()
        if not client_req:
            return None

        total_adults = sum(
            traveller.number for traveller in client_req.travellers.all() if traveller.age_category == "ADULT"
        )

        total_children = sum(
            traveller.number for traveller in client_req.travellers.all() if traveller.age_category == "CHILD"
        ) 

        country = client_req.client_requested.country or ""
        eac_countries = [
            "Democratic Republic of the Congo", "Tanzania", "Uganda", 
            "South Sudan", "Somalia", "Kenya", "Rwanda", "Burundi"
        ]
 

        is_resident = any(c.lower() in country.lower() for c in eac_countries)

        rate_adult = (
            obj.concession_fee_adult_resident if is_resident else obj.concession_fee_adult_non_resident
        ) or 0

        rate_child = (
            obj.concession_fee_child_resident if is_resident else obj.concession_fee_child_non_resident
        ) or 0


        return {
            "is_inside_park": True,
            "rate_per_adult": float(rate_adult),
            "rate_per_child": float(rate_child),

            "total_adults":total_adults,
            "total_children":total_children,

            "total_adult_concession": float(total_adults * rate_adult),
            "total_child_concession": float(total_children * rate_child),
        }



    def get_default_client_rooms(self, obj):
        client_req = self._get_client_request()

        if not client_req:
            return []


        return [
            {
                "room_label": room.label,
                "display_label": room.get_label_display() if hasattr(room, "get_label_display") else room.label,
                "number":room.number
            }
            for room in client_req.room_selected.all()
        ]
    



    def get_available_room_rates(self, obj):
        client_req = self._get_client_request()
        tour_date = client_req.tour_start_date if client_req else None

        active_season = self._determine_season(obj, tour_date=tour_date)

        room_types = AccommodationRoomType.objects.filter(
            accommodation = obj
            ).prefetch_related("rates")

        result = []
        for room in room_types:
            rates_qs = room.rates.all()

            if active_season:
                matched_rate = rates_qs.filter(season = active_season).first() or rates_qs.filter(season__isnull=True).first()
            else:
                matched_rate = rates_qs.filter(season__isnull = True).first() or rates_qs.first()


            if matched_rate:
                result.append(
                    {
                        "room_type_id": str(room.id),
                        "room_name": room.name,
                        "capacity": room.capacity,
                        "meal_plan": matched_rate.meal_plan,
                        "price_per_night": float(matched_rate.price_per_night),
                        "active_season": active_season.name if active_season else "All Year Round"
                    }
                )

        return result
        
    




        



