from django.contrib import admin
from Activities.models import Activity, ActivityLocation, ActivityType

# Register your models here.
 
@admin.register(Activity)
class AdminActivities(admin.ModelAdmin):
    list_display = ["day_itinerary","activity_type","moment","is_optional","created_at"]
    list_filter = ["moment","is_optional"]
    search_fields = ["activity_type"]




 
@admin.register(ActivityType)
class AdminActivityType(admin.ModelAdmin):
    list_display = ["title","involve_transport","created_at"]
    list_filter = ["involve_transport"]
    search_fields = ["title"]


@admin.register(ActivityLocation)
class AdminActivityLocation(admin.ModelAdmin):
    list_display = ["location_name","created_at"]
    list_filter = ["created_at"]
    search_fields = ["location_name"]