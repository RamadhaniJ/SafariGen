from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline
from unfold.decorators import display

from Clients.models import ClientInformation, ClientRequestInformation, Traveller, RoomSelection


class TourRequestInline(TabularInline):
    model = ClientRequestInformation
    extra = 0
    fields = ["tour_code", "tour_title", "tour_start_date", "tour_length", "safari_grand_total"]
    readonly_fields = fields
    show_change_link = True
    can_delete = False
    verbose_name_plural = "Tour requests"
    tab = True

    def has_add_permission(self, request, obj=None):
        return False


class TravellerInline(TabularInline):
    model = Traveller
    extra = 0
    fields = ["age_category", "number", "is_resident"]
    verbose_name_plural = "Travellers"
    tab = True


class RoomSelectionInline(TabularInline):
    model = RoomSelection
    extra = 0
    fields = ["label", "number"]
    verbose_name_plural = "Rooms requested"
    tab = True


@admin.register(ClientInformation)
class AdminClientInformation(ModelAdmin):
    list_display = ["full_name", "email", "country", "company", "created_by", "created_at"]
    list_filter = ["company", "country", "source"]
    search_fields = ["first_name", "last_name", "email", "phone"]
    list_select_related = ["company", "created_by"]
    inlines = [TourRequestInline]
    fieldsets = [
        (None, {"fields": [("salutation", "first_name", "last_name"), "email", "phone", "country", "source"]}),
        ("Belongs to", {"fields": ["company", "created_by"]}),
    ]

    @display(description="Client", ordering="first_name")
    def full_name(self, obj):
        return f"{obj.salutation}. {obj.first_name} {obj.last_name}"


@admin.register(ClientRequestInformation)
class AdminClientRequest(ModelAdmin):
    list_display = ["tour_code", "tour_title", "client_link", "tour_start_date", "tour_length", "total"]
    list_filter = ["client_requested__company", "tour_type"]
    search_fields = ["tour_code", "tour_title", "client_requested__first_name",
                     "client_requested__last_name", "client_requested__email"]
    list_select_related = ["client_requested"]
    date_hierarchy = "tour_start_date"
    inlines = [TravellerInline, RoomSelectionInline]
    readonly_fields = ["tour_code", "safari_grand_total", "price_per_personal", "itineraries_link"]
    fieldsets = [
        (None, {"fields": ["tour_code", "client_requested", "tour_title", "tour_type", "country_visited"]}),
        ("Dates & route", {"fields": [("tour_start_date", "tour_length"), ("start_destination", "end_destination")]}),
        ("Price (calculated by the pricing engine)", {"fields": [("safari_grand_total", "price_per_personal"), "itineraries_link"]}),
        ("Notes from the client", {"fields": ["request_info"]}),
    ]

    @display(description="Client", ordering="client_requested__first_name")
    def client_link(self, obj):
        c = obj.client_requested
        url = reverse("admin:Clients_clientinformation_change", args=[c.pk])
        return format_html('<a href="{}">{} {}</a>', url, c.first_name, c.last_name)

    @display(description="Total")
    def total(self, obj):
        return f"${obj.safari_grand_total:,.0f}" if obj.safari_grand_total else "—"

    @display(description="Itineraries")
    def itineraries_link(self, obj):
        n = obj.itinerary_versions.count()
        url = reverse("admin:Itinerary_itineraryversion_changelist") + f"?client_request__id__exact={obj.pk}"
        return format_html('<a href="{}" style="font-weight:600">{} version{} →</a>', url, n, "" if n == 1 else "s")


@admin.register(Traveller)
class AdminTraveller(ModelAdmin):
    list_display = ["request", "age_category", "is_resident", "number"]
    list_filter = ["age_category", "is_resident"]


@admin.register(RoomSelection)
class AdminRoomSelection(ModelAdmin):
    list_display = ["request", "label", "number"]
    list_filter = ["label"]
