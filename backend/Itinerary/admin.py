from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline
from unfold.decorators import display

from Itinerary.models import (
    MainDayByDayItinerary,
    SelectedDayRoom,
    ItineraryPricingSnapshot,
    ItineraryPricingBreakdownItem,
    ItineraryVersion,
)

STATUS_COLOURS = {
    "Draft": "info",
    "Sent to Guest": "primary",
    "Guest Requested Changes": "warning",
    "Accepted by Guest": "success",
    "Rejected by Guest": "danger",
    "Archived": "info",
}


class DayInline(TabularInline):
    """Read-only overview of the days; itineraries are built in the SafariGen app."""
    model = MainDayByDayItinerary
    extra = 0
    fields = ["day_number", "nights_number", "destination", "accommodation", "included_meals"]
    readonly_fields = fields
    can_delete = False
    verbose_name_plural = "Days (edit itineraries in the SafariGen app)"
    tab = True

    def has_add_permission(self, request, obj=None):
        return False


class BreakdownInline(TabularInline):
    model = ItineraryPricingBreakdownItem
    extra = 0
    fields = ["day_number", "category", "item_title", "item_description", "unit_price", "quantity", "line_total"]
    readonly_fields = fields
    can_delete = False
    verbose_name_plural = "Price lines"
    tab = True

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(ItineraryVersion)
class AdminItineraryVersion(ModelAdmin):
    list_display = ["tour", "version_number", "status_label", "is_current", "grand_total", "created_by", "created_at"]
    list_filter = ["status", "is_current", "client_request__client_requested__company"]
    search_fields = ["client_request__tour_code", "client_request__tour_title",
                     "client_request__client_requested__last_name"]
    list_select_related = ["client_request", "created_by", "version_pricing_snapshot"]
    inlines = [DayInline]
    readonly_fields = ["guest_page_link", "price_link"]
    fieldsets = [
        (None, {"fields": ["client_request", ("version_number", "status", "is_current"), "change_summary"]}),
        ("Links", {"fields": ["guest_page_link", "price_link"]}),
        ("Snapshot of the request when this version was made", {
            "classes": ["collapse"],
            "fields": ["snapshot_tour_title", "snapshot_tour_type", "snapshot_tour_country_visited",
                       "snapshot_tour_length", "snapshot_tour_start_date",
                       "snapshot_start_destination", "snapshot_end_destination",
                       "snapshot_travellers_json", "snapshot_rooms_json", "based_on", "created_by"],
        }),
    ]

    @display(description="Tour", ordering="client_request__tour_title")
    def tour(self, obj):
        return f"{obj.client_request.tour_title} ({obj.client_request.tour_code})"

    @display(description="Status", label=STATUS_COLOURS)
    def status_label(self, obj):
        return obj.get_status_display()

    @display(description="Total")
    def grand_total(self, obj):
        snap = getattr(obj, "version_pricing_snapshot", None)
        return f"${snap.grand_total:,.0f}" if snap else "—"

    @display(description="Guest page")
    def guest_page_link(self, obj):
        from django.conf import settings
        url = f"{settings.FRONTEND_URL}/preview/safari/itinerary/{obj.client_request_id}/{obj.pk}"
        return format_html('<a href="{}" target="_blank" style="font-weight:600">Open what the guest sees ↗</a>', url)

    @display(description="Price breakdown")
    def price_link(self, obj):
        snap = getattr(obj, "version_pricing_snapshot", None)
        if not snap:
            return "Not priced yet"
        url = reverse("admin:Itinerary_itinerarypricingsnapshot_change", args=[snap.pk])
        return format_html('<a href="{}" style="font-weight:600">${} — see every line →</a>', url, f"{snap.grand_total:,.2f}")


@admin.register(ItineraryPricingSnapshot)
class AdminPricingSnapShot(ModelAdmin):
    list_display = ["version", "subtotal_net", "commission_percentage", "grand_total", "price_per_person", "created_at"]
    search_fields = ["version__client_request__tour_code", "version__client_request__tour_title"]
    list_select_related = ["version__client_request"]
    inlines = [BreakdownInline]
    readonly_fields = [f.name for f in ItineraryPricingSnapshot._meta.concrete_fields if f.name != "id"]
    fieldsets = [
        (None, {"fields": ["version", "generated_by"]}),
        ("Totals", {"fields": [("total_accommodation", "total_concession_fees", "total_park_fees"),
                               ("total_transport_vehicle", "total_activities", "total_optional_meals"),
                               ("subtotal_net", "commission_percentage", "commission_amount"),
                               ("grand_total", "price_per_person")]}),
        ("Map", {"classes": ["collapse"], "fields": ["map_image", "map_generated_at"]}),
    ]

    def has_add_permission(self, request):
        return False   # prices are calculated by the app, never typed in


@admin.register(MainDayByDayItinerary)
class AdminMainDayByDay(ModelAdmin):
    list_display = ["version", "day_number", "nights_number", "destination", "accommodation", "included_meals"]
    list_select_related = ["version__client_request", "destination", "accommodation"]


@admin.register(SelectedDayRoom)
class AdminSelectedDayRoom(ModelAdmin):
    list_display = ["day_itinerary", "room_type", "quantity"]


@admin.register(ItineraryPricingBreakdownItem)
class AdminPricingBreakdown(ModelAdmin):
    list_display = ["snapshot", "day_number", "category", "item_title", "line_total"]
    list_filter = ["category"]
