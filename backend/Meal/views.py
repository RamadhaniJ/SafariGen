from django.shortcuts import render
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from Meal.Serializer import MealPlanToListSerializer
from Users.authentication import CustomJwtCookiesAuth
from Users.view_auth import IsStaffOrManager

from Meal.models import MealPlan

# Create your views here.


class MealPlanListView(generics.ListAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaffOrManager]
    serializer_class = MealPlanToListSerializer
    
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]
    queryset = MealPlan.objects.all()
