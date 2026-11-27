from django.contrib import admin
from Users.models import CustomUserModel, ManagerProfile, Company

# Register your models here.

@admin.register(CustomUserModel)
class AdminCustomUser(admin.ModelAdmin):
    list_display = ["email","full_name","role","status","is_active","joined_at"]
    list_filter = ["role", "joined_at"]




@admin.register(ManagerProfile)
class AdminManagerProfile(admin.ModelAdmin):
    list_display = ["user","phone_number","updated_at"]




@admin.register(Company)
class AdminManagerCompany(admin.ModelAdmin):
    list_display = ["name","website","country","status","created_at"]
    fieldsets = [
        (None, {"fields": ["owner", "name", "status", "logo", "about"]}),
        ("Contact (shown to guests)", {"fields": ["email", "phone_number", "whatsapp_number", "address", "country", "website"]}),
        ("Social media (shown to guests)", {"fields": ["facebook_url", "instagram_url", "tiktok_url", "youtube_url", "twitter_url", "threads_url"]}),
        ("Verification documents", {"fields": ["certificate_of_incorporation", "tax_id_certificate", "tax_id_number"]}),
    ]

   


