from django.test import TestCase

# Create your tests here.




# samples .....

from django.shortcuts import render
from Destinations.Serializer import DestinationListSerializer
from Users.views import IsStaff, IsManager
from Users.authentication import CustomJwtCookiesAuth
from Destinations.models import Destination
from rest_framework.views import APIView
from rest_framework import generics, status, filters
from rest_framework.permissions import AllowAny, IsAuthenticated 
from rest_framework.response import Response
from django.db.models import Q, Case, When, Value, IntegerField  # <-- ONGEZA HII IMPORT

 
class ListDestinationTosearchView(APIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaff]

    def get(self, request):
        client_request_id = request.query_params.get("client_id")
        search_query = request.query_params.get("search", "").strip()

        if search_query:
            # 1. Filter za kawaida (kama ulivyokuwa unafanya)
            base_query = Q(name__icontains=search_query) | Q(location__icontains=search_query)
            
            # 2. Ongeza "Relevance Scoring" ili kupanga matokeo
            destinations = Destination.objects.filter(base_query).annotate(
                relevance=Case(
                    # Kipaumbele cha 1: Jina linafanana kabisa (case-insensitive)
                    When(name__iexact=search_query, then=Value(1)),
                    
                    # Kipaumbele cha 2: Jina linaanza na neno uliloweka
                    When(name__istartswith=search_query, then=Value(2)),
                    
                    # Kipaumbele cha 3: Location inafanana kabisa
                    When(location__iexact=search_query, then=Value(3)),
                    
                    # Kipaumbele cha 4: Location inaanza na neno uliloweka
                    When(location__istartswith=search_query, then=Value(4)),
                    
                    # Kipaumbele cha 5: Neno limejumuishwa tu mahali fulani (default)
                    default=Value(5),
                    output_field=IntegerField()
                )
            ).order_by('relevance', 'name')  # <-- Panga kwa relevance kwanza, kisha kwa alfabeti

            serializer = DestinationListSerializer(
                destinations,
                many=True,
                context={"client_request_id": client_request_id, "request": request}
            )
            return Response(serializer.data)
        else:
            # Optional: Ukitaka kurudisha destinations zote zikipangwa kwa alfabeti ukisearch tupu
            all_destinations = Destination.objects.all().order_by('name')
            serializer = DestinationListSerializer(
                all_destinations, 
                many=True, 
                context={"client_request_id": client_request_id, "request": request}
            )
            return Response(serializer.data)