from django.contrib import admin
from django.urls import path, reverse
from django.template.response import TemplateResponse
from django.http import JsonResponse
from django.utils.html import format_html
from Destinations.models import Destination, DestinationSeason, DestinationFee, DestinationDescription, DestinationImage

class DestinationImageInline(admin.TabularInline):
    model = DestinationImage
    extra = 1
    fields = ["images", "tag", "caption"]

@admin.register(Destination)
class AdminDestination(admin.ModelAdmin):
    list_display = ["name", "location", "destination_type", "bulk_upload_link", "created_at"]
    list_filter = ["destination_type"]
    search_fields = ["name", "location"]
    inlines = [DestinationImageInline]

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
            selected_tag = request.POST.get('tag', 'wildlife')


            default_caption = image_file.name.rsplit('.', 1)[0].replace('_', ' ').title()
            
            DestinationImage.objects.create(
                destination=destination,
                images=image_file,
                tag=selected_tag,
                caption=default_caption
            )

            return JsonResponse({"status": "success", "message": "Image saved successfully"})

        context = {
            **self.admin_site.each_context(request),
            "opts": self.model._meta,
            "destination": destination,
            "tag_choices": DestinationImage._meta.get_field("tag").choices,
            'title': f"Bulk Image Upload: {destination.name}",
        }

        return TemplateResponse(
            request,
            "admin/bulk_upload_destination.html",
            context
        )

    def bulk_upload_link(self, obj):
        url_name = f"admin:{obj._meta.app_label}_{obj._meta.model_name}_bulk_upload"
        url = reverse(url_name, args=[obj.pk])
        return format_html(
            '<a class="button" style="background-color: #417690; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none; font-weight: bold;" href="{}">📸 Upload Images</a>',
            url
        )
    bulk_upload_link.short_description = 'Bulk Upload' 


@admin.register(DestinationSeason)
class AdminDestinationSeason(admin.ModelAdmin):
    list_display = ["destination", "season_name", "start_month", "end_month", "created_at"]
    list_filter = ["start_month"]
    search_fields = ["season_name", "destination__name"]


@admin.register(DestinationFee)
class AdminDestinationFee(admin.ModelAdmin):
    list_display = ["destination", "seasons", "fee_category", "adult_fee", "child_fee", "created_at"]
    list_filter = ["fee_category"]


@admin.register(DestinationDescription)
class AdminDestinationDesc(admin.ModelAdmin):
    list_display = ["destination", "context_type", "created_at"]
    list_filter = ["context_type"]
    search_fields = ["destination__name"]


@admin.register(DestinationImage)
class AdminDestinationImg(admin.ModelAdmin):
    list_display = ["destination", "tag", "caption", "created_at"]
    list_filter = ["tag"]
    search_fields = ["destination__name", "caption"]

