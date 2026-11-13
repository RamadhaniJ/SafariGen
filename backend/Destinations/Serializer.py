from rest_framework import serializers
from Destinations.models import Destination, DestinationFee, DestinationSeason
from Clients.models import ClientRequestInformation
from Clients.utils.residency import determine_residency, is_eac_country
from django.db.models import Q

  
class DestinationListSerializer(serializers.ModelSerializer):
    calculated_park_fee = serializers.SerializerMethodField()
    calculated_rescue_fee = serializers.SerializerMethodField()
    total_destination_cost = serializers.SerializerMethodField()

    featured_img = serializers.SerializerMethodField(required=False)

    class Meta:
        model = Destination
        fields = (
            "id","name","location",
            "featured_img","destination_type",
            "total_destination_cost",
            "calculated_rescue_fee",
            "calculated_park_fee"
        )

    def get_featured_img(self, obj): 
          if obj.featured_img:
                request = self.context.get("request")
                if request is not None:
                      return request.build_absolute_uri(obj.featured_img.url)
                return obj.featured_img.url
          else:
                return None
    



   
    def _get_client_request(self):
          client_id = self.context.get("client_request_id")
          if not client_id:
                return None
          else:
                try:
                    return ClientRequestInformation.objects.prefetch_related(
                        "travellers"
                        ).get(id = client_id)
                except ClientRequestInformation.DoesNotExist:
                      return None

    def _determine_season(self, tour_date, destination):
          if not tour_date:
                return None

          t_month = tour_date.month
          t_day = tour_date.day
          tour_md = (t_month, t_day)



          expected_season = DestinationSeason.objects.filter(
                destination=destination
                )

          for season in expected_season:
                if None in (season.start_month, season.start_day, season.end_month, season.end_day):
                      continue

                
                start_md = (season.start_month, season.start_day)
                end_md = (season.end_month, season.end_day)

                if start_md <= end_md:
                      if start_md <= tour_md <= end_md:
                            return season
                else:
                      if tour_md >= start_md or tour_md <= end_md:
                            return season

          return None


          


    def _calculate_fee_by_category(self, destination, category):

          client_request = self._get_client_request()
          if not client_request or destination.destination_type in ["City","Beach"]:
                return 0.00

          tour_date = client_request.tour_start_date
          current_season = self._determine_season(tour_date=tour_date, destination=destination)

          travellers = client_request.travellers.all()
          total_category_fee = 0.00

      

          for traveller in travellers:
                if traveller.age_category == "INFANT":
                      continue 

                residency = determine_residency(traveller=traveller, client_request=client_request)

                season_filter = Q(seasons__season_name__iexact="ALL_YEAR")
                if current_season:
                      season_filter |= Q(seasons=current_season)
                      
                fee_obj = DestinationFee.objects.filter(
                      destination = destination,
                      fee_category = category,
                      residency_label = residency
                ).filter(
                      season_filter
                ).first()

                if fee_obj:
                      if traveller.age_category == "ADULT":
                            rate = fee_obj.adult_fee or 0.00
                      elif traveller.age_category == "CHILD":
                            rate = fee_obj.child_fee or 0.00
                      else:
                            rate = 0.00


                      total_category_fee += float(rate) * getattr(traveller, "number",1)

          return round(total_category_fee, 2)


    def get_calculated_park_fee(self, obj):
          return self._calculate_fee_by_category(obj, "ParkFee")


    def get_calculated_rescue_fee(self, obj):
          return self._calculate_fee_by_category(obj, "RescueFee")


    def get_total_destination_cost(self, obj):
          park_fee = self.get_calculated_park_fee(obj=obj)
          rescue_fee = self.get_calculated_rescue_fee(obj=obj)
          return round(park_fee + rescue_fee, 2)
                            
                
             