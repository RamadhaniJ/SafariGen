from django.contrib import admin
from Users.models import CustomUserModel, ManagerProfile

# Register your models here.

@admin.register(CustomUserModel)
class AdminCustomUser(admin.ModelAdmin):
    list_display = ["company_name","email","role","status","is_verified","joined_at"]
    list_filter = ["is_verified","role", "joined_at"]




@admin.register(ManagerProfile)
class AdminManagerProfile(admin.ModelAdmin):
    list_display = ["user","full_name","updated_at"]


