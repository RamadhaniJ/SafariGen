import calendar

from django.contrib import admin
from django.urls import path, reverse
from django.template.response import TemplateResponse
from django.http import JsonResponse
from django.utils.html import format_html
from unfold.admin import ModelAdmin, StackedInline, TabularInline
from unfold.decorators import display

from Destinations.models import Destination, DestinationSeason, DestinationFee, DestinationDescription, DestinationImage


def season_dates(obj):
    if None in (obj.start_day, obj.start_month, obj.end_day, obj.end_month):
        return "All year"
    try:
        return (f"{obj.start_day} {calendar.month_abbr[obj.start_month]} – "
                f"{obj.end_day} {calendar.month_abbr[obj.end_month]}")
    except IndexError:
        return "Invalid dates"


class DestinationSeasonInline(TabularInline):
    model = DestinationSeason
    extra = 0
    fields = ["season_name", "start_day", "start_month", "end_day", "end_month"]
    verbose_name_plural = "Seasons (leave dates empty and name it ALL_YEAR for all-year fees)"
    tab = True


class DestinationFeeInline(TabularInline):
    model = DestinationFee
    extra = 0
    fields = ["seasons", "fee_category", "residency_label", "adult_fee", "child_fee"]
    verbose_name_plural = "Park & rescue fees (per person per night)"
    tab = True

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        # Only offer this destination's own seasons.
        if db_field.name == "seasons":
            obj_id = request.resolver_match.kwargs.get("object_id") if request.resolver_match else None
            kwargs["queryset"] = DestinationSeason.objects.filter(destination_id=obj_id) if obj_id else DestinationSeason.objects.none()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class DestinationDescriptionInline(StackedInline):
    model = DestinationDescription
    extra = 0
    verbose_name_plural = "Descriptions (shown to guests)"
    tab = True


class DestinationImageInline(TabularInline):
    model = DestinationImage
    extra = 0
    fields = ["images", "tag", "caption"]
    verbose_name_plural = "Photos"
    tab = True


@admin.register(Destination)
class AdminDestination(ModelAdmin):
    list_display = ["name", "type_label", "location", "on_map", "fees_count", "bulk_upload_link"]
    list_filter = ["destination_type"]
    search_fields = ["name", "location"]
    inlines = [DestinationSeasonInline, DestinationFeeInline, DestinationDescriptionInline, DestinationImageInline]
    fieldsets = [
        (None, {"fields": ["name", "destination_type", "location", "featured_img"]}),
        ("Map position", {
            "fields": [("location_latitude", "location_longitude")],
            "description": "Used to draw the route map on quotes. Example for Serengeti: -2.333333, 34.833333",
        }),
    ]

    @display(description="Type", label={"Park": "success", "Mountain": "info", "Beach": "warning", "City": "primary"})
    def type_label(self, obj):
        return obj.destination_type

    @display(description="On route map", boolean=True)
    def on_map(self, obj):
        return obj.location_latitude is not None and obj.location_longitude is not None

    @display(description="Fees")
    def fees_count(self, obj):
        if obj.destination_type in ("City", "Beach"):
            return "—"
        n = obj.destination_fee.count()
        if n == 0:
            return format_html('<span style="color:#dc2626;font-weight:600">None set</span>')
        return n

    def get_urls(self):
        urls = super().get_urls()
        url_name = f"{self.model._meta.app_label}_{self.model._meta.model_name}_bulk_upload"
        custom_urls = [
            path(
                '<path:object_id>/bulk-upload-images/',
                self.admin_site.admin_view(self.bulk_upload_images_view),
                name=url_name,
            ),
        ]
        return custom_urls + urls

    def bulk_upload_images_view(self, request, object_id):
        destination = self.get_object(request, object_id)
        if request.method == "POST" and request.FILES.get("images"):
            image_file = request.FILES.get("images")
            DestinationImage.objects.create(
                destination=destination,
                images=image_file,
                tag=request.POST.get('tag', 'wildlife'),
                caption=image_file.name.rsplit('.', 1)[0].replace('_', ' ').title(),
            )
            return JsonResponse({"status": "success", "message": "Image saved successfully"})
        context = {
            **self.admin_site.each_context(request),
            "opts": self.model._meta,
            "destination": destination,
            "tag_choices": DestinationImage._meta.get_field("tag").choices,
            'title': f"Upload photos: {destination.name}",
        }
        return TemplateResponse(request, "admin/bulk_upload_destination.html", context)

    @display(description="Photos")
    def bulk_upload_link(self, obj):
        url = reverse(f"admin:{obj._meta.app_label}_{obj._meta.model_name}_bulk_upload", args=[obj.pk])
        return format_html('<a href="{}" style="font-weight:600">Upload photos →</a>', url)


@admin.register(DestinationSeason)
class AdminDestinationSeason(ModelAdmin):
    list_display = ["destination", "season_name", "dates"]
    list_filter = ["destination"]
    search_fields = ["season_name", "destination__name"]

    @display(description="Dates")
    def dates(self, obj):
        return season_dates(obj)


@admin.register(DestinationFee)
class AdminDestinationFee(ModelAdmin):
    list_display = ["destination", "seasons", "fee_category", "residency_label", "adult_fee", "child_fee"]
    list_filter = ["fee_category", "residency_label", "destination"]
    search_fields = ["destination__name"]


@admin.register(DestinationDescription)
class AdminDestinationDesc(ModelAdmin):
    list_display = ["destination", "context_type", "created_at"]
    list_filter = ["context_type"]
    search_fields = ["destination__name"]


@admin.register(DestinationImage)
class AdminDestinationImg(ModelAdmin):
    list_display = ["destination", "tag", "caption", "created_at"]
    list_filter = ["tag"]
    search_fields = ["destination__name", "caption"]
