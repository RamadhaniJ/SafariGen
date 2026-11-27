from django.contrib import admin
from unfold.admin import ModelAdmin
from unfold.decorators import display

from Communication.models import CommunicationChannel, CommunicationLog, EmailTemplate


@admin.register(EmailTemplate)
class AdminEmailTemplate(ModelAdmin):
    list_display = ["name", "subject", "is_active", "updated_at"]
    list_filter = ["is_active"]
    search_fields = ["name", "subject"]


@admin.register(CommunicationLog)
class AdminCommunicationLog(ModelAdmin):
    list_display = ["recipient", "version", "channel", "status_label", "sent_by", "sent_at", "read_at"]
    list_filter = ["status", "channel"]
    search_fields = ["recipient", "version__client_request__tour_code"]
    list_select_related = ["version__client_request", "channel", "sent_by"]
    date_hierarchy = "sent_at"

    @display(description="Status", label=True)
    def status_label(self, obj):
        return obj.get_status_display() if hasattr(obj, "get_status_display") else obj.status

    def has_add_permission(self, request):
        return False   # created automatically when an email is sent


@admin.register(CommunicationChannel)
class AdminCommunicationChannel(ModelAdmin):
    list_display = ["name", "is_active", "created_at"]
