from django.contrib import admin
from unfold.admin import ModelAdmin
from unfold.decorators import display

from ActivityLog.models import ActivitiesLogs


@admin.register(ActivitiesLogs)
class AdminLogs(ModelAdmin):
    """What staff did and when. Read-only record."""
    list_display = ["created_at", "actor", "action_label", "module", "client", "description"]
    list_filter = ["action", "module"]
    # Was ["actor"], which made the search box crash.
    search_fields = ["actor__email", "actor__full_name", "description", "client__last_name"]
    list_select_related = ["actor", "client"]
    date_hierarchy = "created_at"

    @display(description="Action", label=True)
    def action_label(self, obj):
        return obj.get_action_display() if hasattr(obj, "get_action_display") else obj.action

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
