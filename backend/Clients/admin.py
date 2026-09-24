from django.contrib import admin
from Clients.models import ClientInformation, ClientRequestInformation, Traveller, RoomSelection


# Register your models here.

@admin.register(ClientInformation)
class AdminClientInformation(admin.ModelAdmin):
    list_display = ["created_by","first_name","last_name","email","created_at"]
    list_filter = ["created_by"]
    search_fields = ["first_name","last_name","email"]



@admin.register(ClientRequestInformation)
class AdminClientRequest(admin.ModelAdmin):
    list_display = ["tour_code","client_requested","tour_title","tour_length","tour_start_date","created_at"]
    list_filter = ["created_at"]
    search_fields = ["tour_code","tour_title"]

 


@admin.register(Traveller)
class AdminTraveller(admin.ModelAdmin):
    list_display = ["request","age_category","is_resident","number","created_at"] 
    list_filter = ["age_category","is_resident"]


@admin.register(RoomSelection)
class AdminRoomSelection(admin.ModelAdmin):
    list_display = ["request","label","number","created_at"] 
    list_filter = ["label"]
