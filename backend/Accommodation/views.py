from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter
from rest_framework.views import APIView

from Users.view_auth import IsStaffOrManager 
from Users.authentication import CustomJwtCookiesAuth
from Accommodation.Serializer import AccommodationSerializer
from Accommodation.models import Accommodation
from django.db.models import Q, Case,Value, When, IntegerField
 


# Create your views here.

class LiveSearchAccommodationView( APIView ):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsStaffOrManager, IsAuthenticated]


    def get(self, request):
        client_id = request.query_params.get("client_id")
        search_query =  request.query_params.get("search","").strip()

        queryset = Accommodation.objects.select_related("destination").prefetch_related("seasons","room_type__rates").all()


        if search_query:
            base_query = Q(name__icontains = search_query) |    Q(destination__name__icontains = search_query)
            queryset = queryset.filter(
                base_query
            ).annotate(
                relevance = Case(
                    When(name__iexact = search_query, then=Value(1)),

                    When(name__istartswith = search_query, then=Value(2)),

                    When(destination__name__iexact = search_query, then=Value(3)),

                    When(destination__name__istartswith = search_query, then=Value(4)),

                    default=Value(5),
                    output_field=IntegerField()
                )
            )
 

        queryset = queryset.order_by(
            "relevance",
            "name"
        )

        serializer = AccommodationSerializer(
            queryset,
            many = True,
            context = {"client_request_id":client_id, "request":request}
        )

        return Response(serializer.data)

