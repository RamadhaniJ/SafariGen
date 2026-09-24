from django.urls import path
from Activities.views import ListActivitiesLocationView, ListActivitiesTypesView

urlpatterns = [
    path("live/search/activity/location/", ListActivitiesLocationView.as_view(), name="search_activity_location"),
    path("live/search/activity/types/", ListActivitiesTypesView.as_view(), name="search_activity_types"),
]
