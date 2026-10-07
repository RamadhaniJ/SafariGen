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

   


