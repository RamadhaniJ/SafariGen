from django.contrib import admin
from Itinerary.models import ( MainDayByDayItinerary,
                               SelectedDayRoom, 
                               ItineraryPricingSnapshot,
                               ItineraryPricingBreakdownItem,
                               ItineraryVersion
                               )

# Register your models here.

@admin.register(MainDayByDayItinerary)
class AdminMainDayByDay(admin.ModelAdmin):
    list_display = ["day_number","nights_number","accommodation","destination","included_meals","created_at"]
    list_filter = ["day_number","created_at"]



@admin.register(SelectedDayRoom)
class AdminSelectedDayRoom(admin.ModelAdmin):
    list_display = ["day_itinerary","room_type","quantity","created_at"]
    list_filter = ["created_at"]



@admin.register(ItineraryPricingSnapshot)
class AdminPricingSnapShot(admin.ModelAdmin):
    list_display = ["version","commission_percentage","grand_total","price_per_person","generated_by","created_at"]
    list_filter = ["created_at"]





@admin.register(ItineraryPricingBreakdownItem)
class AdminPricingBreakdown(admin.ModelAdmin):
    list_display = ["snapshot","day_number","date_display","category","line_total","created_at"]
    list_filter = ["created_at"]






@admin.register(ItineraryVersion)
class AdminItineraryVersion(admin.ModelAdmin):
    list_display = ["client_request","version_number","status","is_current","created_by","created_at"]
    list_filter = ["status","is_current"]



