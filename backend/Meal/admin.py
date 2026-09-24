from django.contrib import admin
from Meal.models import MealPlan, OptionalMeal

# Register your models here.

@admin.register(MealPlan)
class AdminMealPlan(admin.ModelAdmin):
    list_display = ["name","created_at"]



@admin.register(OptionalMeal)
class AdminOptionalMeal(admin.ModelAdmin):
    list_display = ["day_optional_meal","meal","is_optional","price","created_at"]
    list_filter = ["is_optional"] 