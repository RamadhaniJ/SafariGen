from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from unfold.admin import ModelAdmin
from unfold.decorators import action, display
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm

from Users.models import CustomUserModel, ManagerProfile, Company


# ----------------------------------------------------------- user accounts --

class SafariUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUserModel
        fields = ("email", "full_name", "role")


class SafariUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = CustomUserModel
        fields = "__all__"


@admin.register(CustomUserModel)
class AdminCustomUser(BaseUserAdmin, ModelAdmin):
    """Passwords are never shown or typed as raw text; use 'Change password'."""
    form = SafariUserChangeForm
    add_form = SafariUserCreationForm
    change_password_form = AdminPasswordChangeForm

    list_display = ["email", "full_name", "role_label", "status_label", "is_active", "joined_at"]
    list_filter = ["role", "status", "is_active", "is_staff"]
    search_fields = ["email", "full_name"]
    ordering = ["-joined_at"]
    readonly_fields = ["joined_at", "last_login", "current_session_id"]
    filter_horizontal = ["companies", "groups", "user_permissions"]
    fieldsets = [
        (None, {"fields": ["email", "password"]}),
        ("Profile", {"fields": ["full_name", "role", "companies", "created_by"]}),
        ("Account status", {"fields": ["is_active", "status", "reasons"],
                            "description": "Set status to Banned (with a reason) to block someone from signing in."}),
        ("Admin access", {"classes": ["collapse"],
                          "fields": ["is_staff", "is_superuser", "groups", "user_permissions"]}),
        ("Activity", {"classes": ["collapse"], "fields": ["joined_at", "last_login", "current_session_id"]}),
    ]
    add_fieldsets = [
        (None, {"classes": ["wide"], "fields": ["email", "full_name", "role", "password1", "password2"]}),
    ]

    @display(description="Role", label={"Admin": "danger", "Manager": "primary", "Staff": "info"})
    def role_label(self, obj):
        return obj.get_role_display()

    @display(description="Status", label={"Active": "success", "Banned": "danger"})
    def status_label(self, obj):
        return obj.status


# Groups/permissions aren't used by SafariGen; keep the menu tidy.
try:
    admin.site.unregister(Group)
except admin.sites.NotRegistered:
    pass


@admin.register(ManagerProfile)
class AdminManagerProfile(ModelAdmin):
    list_display = ["user", "phone_number", "updated_at"]
    search_fields = ["user__email", "user__full_name"]


# --------------------------------------------------------------- companies --

@admin.register(Company)
class AdminManagerCompany(ModelAdmin):
    list_display = ["name", "owner", "country", "status_label", "vehicle_price", "guest_details", "created_at"]
    list_filter = ["status", "country"]
    search_fields = ["name", "email", "owner__email"]
    list_select_related = ["owner"]
    actions = ["mark_verified", "mark_rejected"]
    fieldsets = [
        (None, {"fields": ["owner", "name", "status", "logo", "about"]}),
        ("Pricing", {"fields": ["vehicle_rate_per_day"],
                     "description": "Used for this company's quotes. Leave empty to use the SafariGen default "
                                    "(Settings → Default vehicle price). Changing it re-prices the company's "
                                    "open quotes straight away; accepted, rejected and archived quotes keep their price."}),
        ("Contact (shown to guests)", {"fields": ["email", "phone_number", "whatsapp_number", "address", "country", "website"]}),
        ("Social media (shown to guests)", {"fields": ["facebook_url", "instagram_url", "tiktok_url", "youtube_url", "twitter_url", "threads_url"]}),
        ("Verification documents", {"fields": ["certificate_of_incorporation", "tax_id_certificate", "tax_id_number"]}),
    ]

    @display(description="Status", label={"Pending": "warning", "Verified": "success", "Rejected": "danger"})
    def status_label(self, obj):
        return obj.get_status_display()

    @display(description="Vehicle / day")
    def vehicle_price(self, obj):
        if obj.vehicle_rate_per_day is not None:
            return f"${obj.vehicle_rate_per_day:,.0f}"
        return "Default"

    @display(description="Guest details")
    def guest_details(self, obj):
        filled = sum(bool(getattr(obj, f)) for f in ["address", "whatsapp_number", "website"]) + len(obj.social_links())
        return f"{filled} of 9 filled"

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        repriced = getattr(obj, "_repriced", [])
        done = [r for r in repriced if not r.missing]
        skipped = [r for r in repriced if r.missing]
        if done:
            lines = [f"{r.version.client_request.tour_code}: ${r.old_total:,.2f} → ${r.new_total:,.2f}"
                     if r.old_total is not None else f"{r.version.client_request.tour_code}: ${r.new_total:,.2f}"
                     for r in done]
            self.message_user(request, f"Vehicle price changed — {len(done)} open quote(s) re-priced: "
                                       + "; ".join(lines), messages.SUCCESS)
        for r in skipped:
            self.message_user(request, f"{r.version.client_request.tour_code} kept its old price because prices "
                                       f"are missing: " + " ".join(m["message"] for m in r.missing), messages.WARNING)

    @action(description="Mark selected companies as Verified")
    def mark_verified(self, request, queryset):
        n = queryset.update(status="VERIFIED")
        self.message_user(request, f"{n} compan{'y' if n == 1 else 'ies'} marked as Verified.", messages.SUCCESS)

    @action(description="Mark selected companies as Rejected")
    def mark_rejected(self, request, queryset):
        n = queryset.update(status="REJECTED")
        self.message_user(request, f"{n} compan{'y' if n == 1 else 'ies'} marked as Rejected.", messages.WARNING)
