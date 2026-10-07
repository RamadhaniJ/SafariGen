from Itinerary.serializer_edit import VersionForEditSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from Itinerary.serializer_edit import VersionForEditSerializer, EditItinerarySerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from Itinerary.models import ItineraryVersion
from Users.authentication import CustomJwtCookiesAuth
from Users.view_auth import IsStaff, IsStaffOrManager
 

class GetVersionForEditView(APIView):

    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaffOrManager]

    def get(self, request, version_id):
        version = get_object_or_404(
            ItineraryVersion.objects.select_related(
                'client_request__client_requested__company',
                'client_request__start_destination',
                'client_request__end_destination', 
                'version_pricing_snapshot'
            ).prefetch_related(
                'client_request__travellers',
                'client_request__room_selected',
                'version_daybyday__destination',
                'version_daybyday__accommodation',
                'version_daybyday__selected_rooms__room_type',
                'version_daybyday__day_activities__activity_type',
                'version_daybyday__day_activities__main_location',
                'version_daybyday__day_activities__start_location',
                'version_daybyday__day_activities__via_location',
                'version_daybyday__day_activities__end_location',
                'version_daybyday__day_optionals_meal__meal'
            ),
            id=version_id
        )

        is_owner = version.client_request.client_requested.company.owner == request.user
        is_member = request.user.companies.filter(id = version.client_request.client_requested.company.id).exists()
        if not (is_owner or is_member):
            raise PermissionDenied(
                {"detail": "You don't have access to create this Itinerary."}
            )


        
        serializer = VersionForEditSerializer(
            version, 
            context={"request": request}
        )


        return Response(serializer.data, status=status.HTTP_200_OK)










class SaveEditedItineraryView(APIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaffOrManager]

    def post(self, request, version_id, client_id): 
        serializer = EditItinerarySerializer(
            data=request.data,
             context={
                "request": request,
                "version_id": version_id, 
                "client_id": client_id,     
            }
        )
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        
        return Response(result, status=status.HTTP_201_CREATED)