from django.contrib import admin
from ActivityLog.models import ActivitiesLogs

# Register your models here.

@admin.register(ActivitiesLogs)
class AdminLogs(admin.ModelAdmin):
    list_display = ["actor","action","module","created_at"]
    search_fields = ["actor"]
    list_filter = ["action","module"]
