from django.shortcuts import render, get_object_or_404
from django.db.models import Prefetch, Q
from Itinerary.Serializer import (  BulkItineraryCreateSerializer,
                                  MainItineraryPreviewSerializer,
                                  PricingSnapshotSerializer,
                                  ClientContainerSerializer
                                )
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound


from Users.authentication import CustomJwtCookiesAuth
from Users.views import IsStaff
from Clients.models import ClientRequestInformation
from Itinerary.models import MainDayByDayItinerary , ItineraryPricingSnapshot, ItineraryVersion
from Configuration.models import HeroSectionImages
from Communication.models import CommunicationLog
import random

# Create your views here.

class BulkCreateDayByDayItineraryView(generics.CreateAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsStaff, IsAuthenticated]
    serializer_class = BulkItineraryCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request":request})
        serializer.is_valid(raise_exception = True)
        result = serializer.save()
        return Response(
            {
                "message": result["message"],
                "version_id": result["version_id"],
                "version_number": result["version_number"],
                "client_id": result["client_id"],
                "grand_total": result["grand_total"],
                "price_per_person": result["price_per_person"],
                },
            status=status.HTTP_201_CREATED
        )





class DeleteSpecificItineraryVersionView(APIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaff]

    def delete(self, request, version_id):
        version = get_object_or_404(ItineraryVersion, id = version_id) 

        if version.is_current:
            return Response(
                {"detail":"Cannot delete current version. Please create a new version first"},
                status=status.HTTP_400_BAD_REQUEST
            )

        else:

            version_id = version.id
            version.delete()

            return Response(
                {
                    "message":"Version Deleted successfully",
                    "version_id":str(version_id)
                 },
                 status=status.HTTP_200_OK
            )



# List itinerary data with version to Staff?

class ListItineraryWithVersionView(generics.ListAPIView):
        authentication_classes = [CustomJwtCookiesAuth]
        permission_classes = [IsAuthenticated, IsStaff]
        serializer_class = ClientContainerSerializer
    
        def get_queryset(self):
            user = self.request.user
            
            queryset = ClientRequestInformation.objects.filter(
                client_requested__created_by=user.staff_profile
            ).select_related(
                'client_requested',
                'start_destination',
                'end_destination'
            ).prefetch_related(
                Prefetch(
                    'itinerary_versions',
                    queryset=ItineraryVersion.objects.select_related(
                        'version_pricing_snapshot',
                        'client_request__client_requested'
                    ).prefetch_related(
                        'communication_logs'
                    ).order_by('-version_number')
                )
            ).order_by('-created_at')
            
            # Search filter
            search_query = self.request.query_params.get('search', None)
            if search_query:
                queryset = queryset.filter(
                    Q(client_requested__first_name__icontains=search_query) |
                    Q(client_requested__last_name__icontains=search_query) |
                    Q(tour_code__icontains=search_query) |
                    Q(tour_title__icontains=search_query)
                )
            
            return queryset


# List itinerary data with version to Staff?










class PreviewClientSafariItineraryView(APIView):

    permission_classes = [AllowAny]  

    def get(self, request, client_id, version_id):
        try:
            # 1. Tafuta VERSION YA SASA (is_current=True) ya client huyu
            version = ItineraryVersion.objects.select_related(
                "client_request__client_requested",
                "client_request__client_requested__created_by__user",
                "client_request__start_destination",
                "client_request__end_destination",
                "version_pricing_snapshot"  # <-- Jina jipya sahihi
            ).prefetch_related(
                "client_request__travellers",
                "client_request__room_selected",
                
                # Badilisha client_daybyday kuwa version_daybyday
                "version_daybyday__destination__destination_images",
                "version_daybyday__destination__destination_desc",

                "version_daybyday__accommodation__accommodation_images",
                "version_daybyday__accommodation__accommodation_desc",

                "version_daybyday__day_activities",
                "version_daybyday__day_optionals_meal",
                "version_daybyday__selected_rooms__room_type"
            ).get(
                client_request_id=client_id,
                id=version_id
            )

        except ItineraryVersion.DoesNotExist:
            return Response(
                {"detail": "Itinerary Version Not Found for this client"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # 2. Context kwa ajili ya Serializer (kuepuka kuirudia images/descriptions)
        context = {
            "request": request,
            "used_dest_imgs_ids": set(),
            "used_acc_imgs_ids": set(),
            "used_acc_desc_ids": set(),
            "used_dest_desc_ids": set(),
        }

        # 3. Pass VERSION object (si client) kwa serializer
        serializer = MainItineraryPreviewSerializer(
            version,  
            context=context
        )

        # 4. Hero Image Logic (Inatumia data kutoka kwenye version)
        selected_hero_image = None
        tour_title_lower = (version.client_request.tour_title or "").lower()

        hero_images = HeroSectionImages.objects.only("image", "image_tag")

        for hero_obj in hero_images:
            if hero_obj.image_tag and hero_obj.image_tag.lower() in tour_title_lower:
                selected_hero_image = request.build_absolute_uri(hero_obj.image.url)
                break

        if not selected_hero_image and hero_images.exists():
            random_hero = random.choice(list(hero_images))
            selected_hero_image = request.build_absolute_uri(random_hero.image.url)

        # 5. Return Response
        return Response(
            {
                "hero_image": selected_hero_image,
                "itinerary": serializer.data,
                "version_info": {
                    "version_number": version.version_number,
                    "status": version.status,
                    "is_current": version.is_current,
                }
            },
            status=status.HTTP_200_OK
        )




class PricingBreakdownToStaffView(generics.RetrieveAPIView):
    # authentication_classes = [CustomJwtCookiesAuth]
    # permission_classes = [IsAuthenticated ,IsStaff ]
    serializer_class = PricingSnapshotSerializer

    def get_object(self):
        client_id = self.kwargs.get("client_id")
        version_id = self.kwargs.get("version_id")

        try:
           snapshot = ItineraryPricingSnapshot.objects.select_related(
               "version__client_request", "generated_by__user"
               ).prefetch_related(
                   "breakdown_items"
               ).get(
                   version__client_request_id=client_id,
                   version_id = version_id
                   )
        except ItineraryPricingSnapshot.DoesNotExist:
             raise NotFound(detail="Pricing snapshot not found for this client request.")
        except ValueError:
            raise NotFound(detail="Invalid client Request ID format.")
        return snapshot