from django.contrib import admin
from Configuration.models import HeroSectionImages, ConfigurationData

# Register your models here.

@admin.register(HeroSectionImages)
class AdminHeroImages(admin.ModelAdmin):
    list_display = ["image_tag","created_at"]




@admin.register(ConfigurationData)
class AdminConfigurationData(admin.ModelAdmin):
    list_display = ["vehicle_rent_pricing","transit_fee_resident","transit_fee_non_resident","created_at"]
