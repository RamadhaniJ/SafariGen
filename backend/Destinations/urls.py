from django.urls import path
from Destinations.views import ListDestinationTosearchView

urlpatterns = [
    path("live/search/destination/", ListDestinationTosearchView.as_view(), name="destination_search")
]

  