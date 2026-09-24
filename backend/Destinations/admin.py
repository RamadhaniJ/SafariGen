from django.contrib import admin
from Destinations.models import Destination, DestinationSeason, DestinationFee, DestinationDescription, DestinationImage


# Register your models here.

@admin.register(Destination)
class AdminDestination(admin.ModelAdmin):
    list_display = ["name","location","destination_type","created_at"]
    list_filter = ["destination_type"]
    search_fields = ["name","location"]



@admin.register(DestinationSeason)
class AdminDestinationSeason(admin.ModelAdmin):
    list_display = ["season_name","start_month","end_month","created_at"]
    list_filter = ["start_month"]
    search_fields = ["season_name"]



@admin.register(DestinationFee)
class AdminDestinationFee(admin.ModelAdmin):
    list_display = ["fee_category","adult_fee","child_fee","created_at"]
    list_filter = ["fee_category"]


 

@admin.register(DestinationDescription)
class AdminDestinationDesc(admin.ModelAdmin):
    list_display = ["destination","context_type","created_at"]
    list_filter = ["context_type"]
    search_fields = ["destination"]


@admin.register(DestinationImage)
class AdminDestinationImg(admin.ModelAdmin):
    list_display = ["destination","tag","caption","created_at"]
