from django.contrib import admin
from unfold.admin import ModelAdmin

from Configuration.models import HeroSectionImages, ConfigurationData


@admin.register(HeroSectionImages)
class AdminHeroImages(ModelAdmin):
    """Cover photos for the guest quote page, picked by a word in the tour title."""
    list_display = ["image_tag", "image", "created_at"]
    list_filter = ["image_tag"]


@admin.register(ConfigurationData)
class AdminConfigurationData(ModelAdmin):
    list_display = ["vehicle_rent_pricing", "transit_fee_resident", "transit_fee_non_resident", "updated_at"]
    fieldsets = [
        (None, {
            "fields": ["vehicle_rent_pricing", "transit_fee_resident", "transit_fee_non_resident"],
            "description": "SafariGen-wide DEFAULT vehicle price, used for companies that haven't set "
                           "their own (Companies → Pricing). If neither is set, quotes can't be "
                           "saved until a vehicle price exists. Changing this does NOT re-price saved quotes automatically: use "
                           "Itineraries → select → \"Recalculate prices with current rates\". The two transit fee "
                           "fields are not used by pricing; transit fees are set on each activity.",
        }),
    ]

    def has_add_permission(self, request):
        # One row is all that's used; don't allow a confusing second one.
        return not ConfigurationData.objects.exists()
