from django.contrib import admin
from unfold.admin import ModelAdmin
from unfold.decorators import display

from Activities.models import Activity, ActivityLocation, ActivityType


@admin.register(ActivityType)
class AdminActivityType(ModelAdmin):
    list_display = ["title", "transport_label"]
    list_filter = ["involve_transport"]
    search_fields = ["title"]

    @display(description="Kind", label={"Transfer (from → to)": "info", "Activity": "success"})
    def transport_label(self, obj):
        return "Transfer (from → to)" if obj.involve_transport else "Activity"


@admin.register(ActivityLocation)
class AdminActivityLocation(ModelAdmin):
    list_display = ["location_name", "created_at"]
    search_fields = ["location_name"]


@admin.register(Activity)
class AdminActivities(ModelAdmin):
    """Activities placed on itinerary days (added from the SafariGen app)."""
    list_display = ["activity_type", "day_itinerary", "moment", "is_optional", "optional_activity_price"]
    list_filter = ["moment", "is_optional"]
    # Was ["activity_type"], which made the search box crash.
    search_fields = ["activity_type__title"]
    list_select_related = ["activity_type", "day_itinerary"]
