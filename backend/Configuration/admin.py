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
            "description": "Used by the pricing engine for every quote. Only the first row is used; "
                           "if no vehicle price is set, quotes use $250 per vehicle per day.",
        }),
    ]

    def has_add_permission(self, request):
        # One row is all that's used; don't allow a confusing second one.
        return not ConfigurationData.objects.exists()
