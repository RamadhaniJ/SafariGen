import calendar

from django.contrib import admin
from django.urls import path, reverse
from django.template.response import TemplateResponse
from django.http import JsonResponse
from django.utils.html import format_html
from unfold.admin import ModelAdmin, StackedInline, TabularInline
from unfold.decorators import display

from Accommodation.models import (
    Accommodation,
    AccommodationSeason,
    AccommodationRoomType,
    RoomRate,
    AccommodationDescription,
    AccommodationImages,
)


def season_dates(obj):
    """'1 Jun – 31 Oct' instead of raw day/month numbers."""
    try:
        return (f"{obj.start_day} {calendar.month_abbr[obj.start_month]} – "
                f"{obj.end_day} {calendar.month_abbr[obj.end_month]}")
    except (TypeError, IndexError):
        return "All year"


# ---------------------------------------------------------------- inlines --

class SeasonInline(TabularInline):
    model = AccommodationSeason
    extra = 0
    fields = ["name", "start_day", "start_month", "end_day", "end_month"]
    verbose_name = "Season"
    verbose_name_plural = "Seasons (dates)"
    tab = True


class RoomTypeInline(TabularInline):
    model = AccommodationRoomType
    extra = 0
    fields = ["name", "capacity", "rates_link"]
    readonly_fields = ["rates_link"]
    verbose_name_plural = "Room types"
    tab = True

    @display(description="Prices")
    def rates_link(self, obj):
        if not obj.pk:
            return "Save first"
        n = obj.rates.count()
        url = reverse("admin:accommodation-price-grid", args=[obj.accommodation_id])
        return format_html('<a href="{}" style="font-weight:600">{} price{} → edit in grid</a>', url, n, "" if n == 1 else "s")


class DescriptionInline(StackedInline):
    model = AccommodationDescription
    extra = 0
    verbose_name_plural = "Descriptions (shown to guests)"
    tab = True


class AccommodationImagesInline(TabularInline):
    model = AccommodationImages
    extra = 0
    verbose_name_plural = "Photos"
    tab = True


# ------------------------------------------------------------------ admins --

@admin.register(Accommodation)
class AdminAccommodation(ModelAdmin):
    list_display = ["name", "destination", "type_label", "location_label", "rates_count", "sponsored", "bulk_upload_link"]
    readonly_fields = ["price_grid_button"]
    list_filter = ["tag_label", "park_status", "is_sponsored", "destination"]
    search_fields = ["name", "destination__name"]
    list_select_related = ["destination"]
    inlines = [RoomTypeInline, SeasonInline, DescriptionInline, AccommodationImagesInline]
    fieldsets = [
        (None, {"fields": ["name", "destination", "tag_label", "featured_image", "price_grid_button"]}),
        ("Location & park fees", {
            "fields": ["park_status",
                       ("concession_fee_adult_non_resident", "concession_fee_child_non_resident"),
                       ("concession_fee_adult_resident", "concession_fee_child_resident")],
            "description": "Concession fees are charged per person per night when the lodge is inside a park.",
        }),
        ("Sponsored listing", {"fields": ["is_sponsored", "sponsored_priority", "sponsored_until"], "classes": ["collapse"]}),
    ]

    @display(description="Type")
    def type_label(self, obj):
        return obj.get_tag_label_display()

    @display(description="Location", label={"Inside Park": "warning", "Outside Park": "info"})
    def location_label(self, obj):
        return obj.get_park_status_display()

    @display(description="Room prices")
    def price_grid_button(self, obj):
        if not obj or not obj.pk:
            return "Save the lodge first, then add room types, seasons and prices."
        url = reverse("admin:accommodation-price-grid", args=[obj.pk])
        return format_html(
            '<a href="{}" style="display:inline-block;background:var(--color-primary-600);color:#fff;'
            'padding:8px 16px;border-radius:8px;font-weight:700;text-decoration:none">'
            'Open room prices grid (per season) →</a>', url)

    @display(description="Room prices")
    def rates_count(self, obj):
        url = reverse("admin:accommodation-price-grid", args=[obj.pk])
        n = RoomRate.objects.filter(room_type__accommodation=obj).count()
        if n == 0:
            return format_html('<a href="{}" style="color:#dc2626;font-weight:600">None — add prices →</a>', url)
        return format_html('<a href="{}" style="font-weight:600">{} →</a>', url, n)

    @display(description="Sponsored", boolean=True)
    def sponsored(self, obj):
        return obj.is_sponsored

    # Bulk photo upload page (kept from before)
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                '<path:object_id>/prices/',
                self.admin_site.admin_view(self.price_grid_view),
                name='accommodation-price-grid',
            ),
            path(
                '<path:object_id>/bulk-upload-images/',
                self.admin_site.admin_view(self.bulk_upload_images_view),
                name='accommodation-bulk-upload-images',
            ),
        ]
        return custom_urls + urls

    def price_grid_view(self, request, object_id):
        """Room types × meal plans by season: type a price per room per night in each cell."""
        from django.contrib import messages
        from django.core.exceptions import PermissionDenied
        from django.shortcuts import redirect
        from Accommodation.price_grid import build_grid, save_grid

        accommodation = self.get_object(request, object_id)
        if accommodation is None:
            return redirect("admin:Accommodation_accommodation_changelist")
        if not self.has_view_or_change_permission(request, accommodation):
            raise PermissionDenied
        errors = []
        if request.method == "POST":
            if not self.has_change_permission(request, accommodation):
                raise PermissionDenied
            errors, counts = save_grid(accommodation, request.POST)
            if not errors:
                changed = sum(counts.values())
                messages.success(request, "Prices saved: " + ", ".join(f"{v} {k}" for k, v in counts.items() if v)
                                 if changed else "No changes.")
                return redirect(request.get_full_path())
        grid = build_grid(accommodation, show_all_plans=request.GET.get("all_plans") == "1",
                          posted=request.POST if errors else None)
        context = {
            **self.admin_site.each_context(request),
            "opts": self.model._meta,
            "accommodation": accommodation,
            "grid": grid,
            "errors": errors,
            "title": f"Room prices: {accommodation.name}",
        }
        return TemplateResponse(request, "admin/accommodation_price_grid.html", context)

    def bulk_upload_images_view(self, request, object_id):
        accommodation = self.get_object(request, object_id)
        if request.method == 'POST' and request.FILES.get('images'):
            AccommodationImages.objects.create(
                accommodation=accommodation,
                images=request.FILES.get('images'),
                tag=request.POST.get('tag', 'ROOM'),
            )
            return JsonResponse({'status': 'success', 'message': 'Photo saved'})
        context = {
            **self.admin_site.each_context(request),
            'opts': self.model._meta,
            'accommodation': accommodation,
            'tag_choices': AccommodationImages._meta.get_field('tag').choices,
            'title': f'Upload photos: {accommodation.name}',
        }
        return TemplateResponse(request, "admin/bulk_upload_accommodation.html", context)

    @display(description="Photos")
    def bulk_upload_link(self, obj):
        url = reverse("admin:accommodation-bulk-upload-images", args=[obj.pk])
        return format_html('<a href="{}" style="font-weight:600">Upload photos →</a>', url)


@admin.register(RoomRate)
class AdminAccommodationRoomRate(ModelAdmin):
    list_display = ["lodge", "room_type", "season_label", "meal_plan", "price_per_night"]
    list_editable = ["price_per_night"]
    list_filter = ["room_type__accommodation", "meal_plan"]
    search_fields = ["room_type__name", "room_type__accommodation__name"]
    list_select_related = ["room_type__accommodation", "season"]
    autocomplete_fields = ["room_type", "season"]

    @display(description="Lodge", ordering="room_type__accommodation__name")
    def lodge(self, obj):
        return obj.room_type.accommodation.name

    @display(description="Season")
    def season_label(self, obj):
        return f"{obj.season.name} ({season_dates(obj.season)})" if obj.season else "All year"


@admin.register(AccommodationSeason)
class AdminAccommodationSeason(ModelAdmin):
    list_display = ["accommodation", "name", "dates"]
    search_fields = ["name", "accommodation__name"]
    list_filter = ["accommodation"]

    @display(description="Dates")
    def dates(self, obj):
        return season_dates(obj)


@admin.register(AccommodationRoomType)
class AdminAccommodationRoomType(ModelAdmin):
    list_display = ["accommodation", "name", "capacity"]
    list_filter = ["accommodation"]
    search_fields = ["name", "accommodation__name"]


@admin.register(AccommodationDescription)
class AdminAccommodationDescription(ModelAdmin):
    list_display = ["accommodation", "created_at"]
    search_fields = ["accommodation__name"]


@admin.register(AccommodationImages)
class AdminAccommodationImages(ModelAdmin):
    list_display = ["accommodation", "tag", "created_at"]
    list_filter = ["tag"]
    search_fields = ["accommodation__name"]
