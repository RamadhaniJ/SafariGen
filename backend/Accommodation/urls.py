from django.urls import path
from Accommodation.views import LiveSearchAccommodationView


urlpatterns = [
    path("searching/accommodations/", LiveSearchAccommodationView.as_view(), name="search_accommodations")
] 