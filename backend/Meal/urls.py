from django.urls import path
from Meal.views import MealPlanListView

urlpatterns= [
    path("live/search/optional/meal/", MealPlanListView.as_view(), name="search_meals")
]