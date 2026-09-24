from django.shortcuts import render
from Destinations.Serializer import DestinationListSerializer
from Users.views import IsStaff, IsManager
from Users.authentication import CustomJwtCookiesAuth
from Destinations.models import Destination
from rest_framework.views import APIView


from rest_framework import generics,status, filters
from rest_framework.permissions import AllowAny, IsAuthenticated 
from rest_framework.response import Response
from django.db.models import Q, Case, When, Value, IntegerField

 
 
# Create your views here. 

class ListDestinationTosearchView(APIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaff]

    def get(self, request):
        client_request_id = request.query_params.get("client_id")
        search_query = request.query_params.get("search","").strip()

        if search_query:
            base_query = Q(name__icontains = search_query) | Q(location__icontains= search_query)

            destination = Destination.objects.filter(
               base_query
            ).annotate(
                relevance = Case(
                    When(name__iexact = search_query, then=Value(1)),

                    When(name__istartswith = search_query, then=Value(2)),

                    When(location__iexact = search_query, then=Value(3)),

                    When(location__istartswith = search_query, then=Value(4)),

                    default=Value(5),
                    output_field=IntegerField()
                )
            ).order_by("relevance","name")
            
            serializer = DestinationListSerializer(
                destination,
                many=True,
                context={"client_request_id":client_request_id, "request":request}
            )
            return Response(serializer.data)
        else:
            return Response([])


  