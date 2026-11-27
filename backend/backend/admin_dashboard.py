"""Data for the admin home page (django-unfold DASHBOARD_CALLBACK)."""

from datetime import timedelta

from django.conf import settings
from django.db.models import Count, Q
from django.urls import reverse
from django.utils import timezone


def environment_callback(request):
    """Badge in the admin header so nobody confuses the local copy with the live site."""
    if settings.DEBUG:
        return ["Local copy", "warning"]
    return ["Live site", "danger"]


def _link(app, model, query=""):
    url = reverse(f"admin:{app}_{model}_changelist")
    return f"{url}?{query}" if query else url


def dashboard_callback(request, context):
    from Accommodation.models import Accommodation
    from Clients.models import ClientInformation, ClientRequestInformation
    from Configuration.models import ConfigurationData
    from Destinations.models import Destination
    from Itinerary.models import ItineraryVersion
    from Users.models import Company

    now = timezone.now()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    quotes_this_month = ItineraryVersion.objects.filter(created_at__gte=month_start).count()
    stats = [
        {"label": "Companies", "value": Company.objects.count(), "icon": "apartment",
         "hint": f"{Company.objects.filter(status='PENDING').count()} waiting for verification",
         "url": _link("Users", "company")},
        {"label": "Clients", "value": ClientInformation.objects.count(), "icon": "group",
         "hint": f"{ClientInformation.objects.filter(created_at__gte=now - timedelta(days=30)).count()} new in 30 days",
         "url": _link("Clients", "clientinformation")},
        {"label": "Quotes this month", "value": quotes_this_month, "icon": "route",
         "hint": f"{ItineraryVersion.objects.filter(status='ACCEPTED').count()} accepted in total",
         "url": _link("Itinerary", "itineraryversion")},
        {"label": "Destinations / lodges", "value": f"{Destination.objects.count()} / {Accommodation.objects.count()}",
         "icon": "landscape", "hint": "Your catalogue", "url": _link("Destinations", "destination")},
    ]

    # Things that silently affect prices or what guests see.
    attention = []
    config = ConfigurationData.objects.first()
    has_default = bool(config and config.vehicle_rent_pricing)
    no_own_rate = Company.objects.filter(vehicle_rate_per_day__isnull=True).count()
    if not has_default and no_own_rate:
        attention.append({
            "text": f"{no_own_rate} compan{'y has' if no_own_rate == 1 else 'ies have'} no vehicle price and no default "
                    "is set — their quotes use $250/day.",
            "action": "Set default price", "url": _link("Configuration", "configurationdata"),
            "level": "danger",
        })
    no_rates = Accommodation.objects.annotate(n=Count("room_type__rates")).filter(n=0).count()
    if no_rates:
        attention.append({
            "text": f"{no_rates} lodge(s) have no room rates — they add $0 to quotes.",
            "action": "Review lodges", "url": _link("Accommodation", "accommodation"),
            "level": "danger",
        })
    no_photo = Destination.objects.filter(Q(featured_img="") | Q(featured_img__isnull=True)).count()
    if no_photo:
        attention.append({
            "text": f"{no_photo} destination(s) have no main photo — guests see a blank background.",
            "action": "Add photos", "url": _link("Destinations", "destination"),
            "level": "warning",
        })
    no_coords = Destination.objects.filter(Q(location_latitude__isnull=True) | Q(location_longitude__isnull=True)).count()
    if no_coords:
        attention.append({
            "text": f"{no_coords} destination(s) have no map coordinates — they're missing from the route map.",
            "action": "Add coordinates", "url": _link("Destinations", "destination"),
            "level": "warning",
        })
    pending = Company.objects.filter(status="PENDING").count()
    if pending:
        attention.append({
            "text": f"{pending} compan{'y is' if pending == 1 else 'ies are'} waiting for verification.",
            "action": "Review companies", "url": _link("Users", "company", "status__exact=PENDING"),
            "level": "info",
        })

    recent = (
        ClientRequestInformation.objects.select_related("client_requested", "client_requested__company")
        .order_by("-created_at")[:6]
    )
    recent_requests = [
        {
            "code": r.tour_code,
            "title": r.tour_title,
            "client": f"{r.client_requested.first_name} {r.client_requested.last_name}",
            "company": getattr(r.client_requested.company, "name", "—"),
            "total": r.safari_grand_total,
            "start": r.tour_start_date,
            "url": reverse("admin:Clients_clientrequestinformation_change", args=[r.pk]),
        }
        for r in recent
    ]

    context.update({
        "sg_stats": stats,
        "sg_attention": attention,
        "sg_recent": recent_requests,
        "sg_shortcuts": [
            {"label": "Add destination", "icon": "add_location_alt", "url": reverse("admin:Destinations_destination_add")},
            {"label": "Add lodge", "icon": "add_home", "url": reverse("admin:Accommodation_accommodation_add")},
            {"label": "Default vehicle price", "icon": "directions_car", "url": _link("Configuration", "configurationdata")},
            {"label": "Companies", "icon": "apartment", "url": _link("Users", "company")},
        ],
    })
    return context
