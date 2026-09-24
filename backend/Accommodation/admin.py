# from django.contrib import admin
# from Accommodation.models import Accommodation, AccommodationSeason, AccommodationRoomType, RoomRate,  AccommodationDescription, AccommodationImages

# # Register your models here. 

# @admin.register(Accommodation)
# class AdminAccommodation(admin.ModelAdmin):
#     list_display = ["destination","name","is_sponsored","sponsored_priority","sponsored_until","tag_label","created_at"]
#     list_filter = ["is_sponsored","sponsored_priority","tag_label"]
#     search_fields = ["name"]





# @admin.register(AccommodationSeason)
# class AdminAccommodationSeason(admin.ModelAdmin):
#     list_display = ["name","start_month","end_month","created_at"]
#     list_filter = ["created_at"]
#     search_fields = ["name"]



# @admin.register(AccommodationRoomType)
# class AdminAccommodationRoomType(admin.ModelAdmin):
#     list_display = ["accommodation","name","capacity","created_at"]
#     list_filter = ["capacity"]
#     search_fields = ["name"]




# @admin.register(RoomRate)
# class AdminAccommodationRoomRate(admin.ModelAdmin):
#     list_display = ["room_type","season","meal_plan","price_per_night","created_at"]
#     list_filter = ["season"]
#     search_fields = ["season","room_type"]



# @admin.register(AccommodationDescription)
# class AdminAccommodationDescription(admin.ModelAdmin):
#     list_display = ["accommodation","created_at"]
#     search_fields = ["accommodation"]



# @admin.register(AccommodationImages)
# class AdminAccommodationDescription(admin.ModelAdmin):
#     list_display = ["accommodation","tag","created_at"]
#     search_fields = ["accommodation"]





from django.contrib import admin
from django.urls import path
from django.template.response import TemplateResponse
from django.http import JsonResponse
from django.utils.html import format_html

from Accommodation.models import (
    Accommodation, 
    AccommodationSeason, 
    AccommodationRoomType, 
    RoomRate,  
    AccommodationDescription, 
    AccommodationImages
)


class AccommodationImagesInline(admin.TabularInline):
    model = AccommodationImages
    extra = 1


@admin.register(Accommodation)
class AdminAccommodation(admin.ModelAdmin):
    list_display = [
        "destination", 
        "name", 
        "is_sponsored", 
        "sponsored_priority", 
        "tag_label", 
        "bulk_upload_link", # Kitufe cha Bulk Upload kwenye List
        "created_at"
    ]
    list_filter = ["is_sponsored", "sponsored_priority", "tag_label"]
    search_fields = ["name"]
    inlines = [AccommodationImagesInline]

    # 1. Ongeza custom URL kwenye Admin kwa ajili ya Bulk Upload
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                '<path:object_id>/bulk-upload-images/',
                self.admin_site.admin_view(self.bulk_upload_images_view),
                name='accommodation-bulk-upload-images',
            ),
        ]
        return custom_urls + urls

    # 2. View inayopokea na ku-save picha

    def bulk_upload_images_view(self, request, object_id):
        accommodation = self.get_object(request, object_id)

        if request.method == 'POST' and request.FILES.get('images'):
            image_file = request.FILES.get('images')
            selected_tag = request.POST.get('tag', 'ROOM')

            # Inahifadhi picha moja kwa moja kwenye AccommodationImages model
            AccommodationImages.objects.create(
                accommodation=accommodation,
                images=image_file,
                tag=selected_tag
            )
            return JsonResponse({'status': 'success', 'message': 'Picha imehifadhiwa!'})

        context = {
            **self.admin_site.each_context(request),
            'opts': self.model._meta,
            'accommodation': accommodation,
            'tag_choices': AccommodationImages._meta.get_field('tag').choices,
            'title': f'Bulk Image Upload: {accommodation.name}',
        }
        return TemplateResponse(request, "admin/bulk_upload_accommodation.html", context)


    

    # 3. Tengeneza Kitufe cha "📸 Upload Images" kwenye Orodha ya Accommodations
    def bulk_upload_link(self, obj):
        url = f"/admin/Accommodation/accommodation/{obj.id}/bulk-upload-images/"
        return format_html(
            '<a class="button" style="background-color: #417690; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none; font-weight: bold;" href="{}">📸 Upload Images</a>',
            url
        )
    
    bulk_upload_link.short_description = 'Bulk Upload'


@admin.register(AccommodationSeason)
class AdminAccommodationSeason(admin.ModelAdmin):
    list_display = ["accommodation", "name", "start_month", "end_month", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["name", "accommodation__name"]


@admin.register(AccommodationRoomType)
class AdminAccommodationRoomType(admin.ModelAdmin):
    list_display = ["accommodation", "name", "capacity", "created_at"]
    list_filter = ["capacity"]
    search_fields = ["name", "accommodation__name"]


@admin.register(RoomRate)
class AdminAccommodationRoomRate(admin.ModelAdmin):
    list_display = ["room_type", "season", "meal_plan", "price_per_night", "created_at"]
    list_filter = ["season"]
    search_fields = ["room_type__name"]


@admin.register(AccommodationDescription)
class AdminAccommodationDescription(admin.ModelAdmin):
    list_display = ["accommodation", "created_at"]
    search_fields = ["accommodation__name"]


@admin.register(AccommodationImages)
class AdminAccommodationImages(admin.ModelAdmin): # Nimerekebisha jina la Class hapa
    list_display = ["accommodation", "tag", "created_at"]
    search_fields = ["accommodation__name"]
