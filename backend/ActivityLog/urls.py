from django.urls import path
from ActivityLog.views import ActivityLogsView

urlpatterns = [
    path("list/activities/logs/", ActivityLogsView.as_view(), name="list_activity_logs")
]