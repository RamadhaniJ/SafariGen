from django.contrib import admin
from unfold.admin import ModelAdmin

from Meal.models import MealPlan, OptionalMeal


@admin.register(MealPlan)
class AdminMealPlan(ModelAdmin):
    list_display = ["name", "created_at"]
    search_fields = ["name"]


@admin.register(OptionalMeal)
class AdminOptionalMeal(ModelAdmin):
    """Meals placed on itinerary days (added from the SafariGen app)."""
    list_display = ["meal", "day_optional_meal", "is_optional", "price"]
    list_filter = ["is_optional"]
    search_fields = ["meal__name"]
