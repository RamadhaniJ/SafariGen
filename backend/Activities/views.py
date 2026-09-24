from Activities.models import ActivityLocation, ActivityType
from rest_framework import generics,status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from Users.authentication import CustomJwtCookiesAuth
from Users.views import IsStaff
from django.db.models import Q, Case, When, Value, IntegerField


from Activities.Serializer import ActivitiesLocationSerializer, ActivitiesTypeSerializer
from rest_framework.response import Response


class ListActivitiesLocationView( APIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsStaff, IsAuthenticated]


    def get(self, request):
        search_query = request.query_params.get("search", "").strip()

        if search_query:
            activityLocation = ActivityLocation.objects.filter(
                location_name__icontains = search_query
            ).annotate(
                relevance = Case(
                    When(location_name__iexact = search_query, then=Value(1)),
                    When(location_name__istartswith = search_query, then=Value(2)),

                    default=Value(3),
                    output_field=IntegerField()
                )
            ).order_by("relevance","location_name")

            serializer = ActivitiesLocationSerializer(
                activityLocation,
                many=True
            )

            return Response(serializer.data)
        else:
            return Response([])
   
 



class ListActivitiesTypesView( APIView ): 
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsStaff, IsAuthenticated]


    def get(self, request):
        search_query = request.query_params.get("search", "").strip()

        if search_query:
            base_query = Q(title__icontains = search_query)

            activity = ActivityType.objects.filter(base_query).annotate(
                relevance = Case(
                    When(title__iexact = search_query, then=Value(1)),

                    When(title__istartswith = search_query, then=Value(2)),

                    default=Value(3),
                    output_field=IntegerField()
                )
            ).order_by('relevance', "title")

            serializer = ActivitiesTypeSerializer(
                activity,
                many=True
                )
            return Response(serializer.data) 
        else:
            return Response([])
    