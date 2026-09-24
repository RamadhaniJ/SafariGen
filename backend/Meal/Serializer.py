from rest_framework import serializers
from Meal.models import MealPlan



class MealPlanToListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPlan
        fields = ("id","name")
