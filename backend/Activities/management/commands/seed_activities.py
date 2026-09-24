from django.core.management.base import BaseCommand
from Activities.models import ActivityType, ActivityLocation  # Badilisha 'your_app_name' na jina la app yako


class Command(BaseCommand):
    help = 'Seeds 25 Activity Types and essential Activity Locations into the database.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting database seeding process..."))

        # =========================================================
        # 1. SEED ACTIVITY TYPES (25 Items)
        # =========================================================
        activity_types_data = [
            # --- Non-Transport Activities (Game Drives & Tours) ---
            {"title": "Full-Day Game Drive", "involve_transport": False},
            {"title": "Half-Day Game Drive", "involve_transport": False},
            {"title": "Hot Air Balloon Safari", "involve_transport": False},
            {"title": "Guided Walking Safari", "involve_transport": False},
            {"title": "Night Game Drive", "involve_transport": False},
            {"title": "Maasai Cultural Village Tour", "involve_transport": False},
            {"title": "Canoeing & Kayaking Experience", "involve_transport": False},
            {"title": "Stone Town Guided Walking Tour", "involve_transport": False},
            {"title": "Zanzibar Spice Farm Tour", "involve_transport": False},
            {"title": "Prison Island & Giant Tortoise Tour", "involve_transport": False},
            {"title": "Snorkeling & Diving Excursion", "involve_transport": False},
            {"title": "Sunset Dhow Cruise", "involve_transport": False},
            {"title": "Coffee Plantation Tour", "involve_transport": False},
            {"title": "Materuni Waterfalls Hike", "involve_transport": False},
            {"title": "Mount Kilimanjaro Day Trek", "involve_transport": False},
            {"title": "Olduvai Gorge Historic Tour", "involve_transport": False},
            {"title": "Chemka Hot Springs Day Visit", "involve_transport": False},

            # --- Transport Activities (Transfers & Long Trips) ---
            {"title": "Airport Transfer (Pick-up / Drop-off)", "involve_transport": True},
            {"title": "Inter-Park Safari Overland Transfer", "involve_transport": True},
            {"title": "Bush Airstrip Shuttle Transfer", "involve_transport": True},
            {"title": "Hotel to Park Gate Transfer", "involve_transport": True},
            {"title": "Cross-Border Overland Transfer", "involve_transport": True},
            {"title": "Scenic Flight & Fly-in Safari", "involve_transport": True},
            {"title": "Ferry / Boat Transfer (Zanzibar)", "involve_transport": True},
            {"title": "City-to-City Intercity Transfer", "involve_transport": True},
            {"title": "Transfer by road", "involve_transport": True},
            {"title": "Transfer by Air", "involve_transport": True},
        ]

        created_types = 0
        for item in activity_types_data:
            obj, created = ActivityType.objects.get_or_create(
                title=item["title"],
                defaults={"involve_transport": item["involve_transport"]}
            )
            if created:
                created_types += 1

        self.stdout.write(self.style.SUCCESS(f" Successfully seeded {created_types} new ActivityTypes."))

        # =========================================================
        # 2. SEED ACTIVITY LOCATIONS
        # =========================================================
        locations_data = [
            # Air Ports & Airstrips
            "Kilimanjaro International Airport (JRO)",
            "Abeid Amani Karume International Airport (ZNZ)",
            "Arusha Airport (ARK)",
            "Seronera Airstrip (Serengeti)",
            "Manyara Airstrip",
            "Kuro Airstrip (Tarangire)",

            # Hotels & Lodges
            "Gran Meliá Arusha",
            "Mount Meru Hotel",
            "Kibo Palace Hotel Moshi",
            "Four Seasons Safari Lodge Serengeti",
            "Lake Manyara Serena Safari Lodge",
            "Ngorongoro Serena Safari Lodge",
            "Emerson on Hurumzi (Zanzibar)",

            # Destinations & Parks
            "Serengeti National Park",
            "Ngorongoro Crater Conservation Area",
            "Tarangire National Park",
            "Lake Manyara National Park",
            "Mount Kilimanjaro National Park",
            "Zanzibar - Stone Town & Beaches",
            "Arusha City (Safari Capital)",
            "Chemka Hot Springs (Moshi)"
        ]

        created_locations = 0
        for loc in locations_data:
            obj, created = ActivityLocation.objects.get_or_create(location_name=loc)
            if created:
                created_locations += 1

        self.stdout.write(self.style.SUCCESS(f" Successfully seeded {created_locations} new ActivityLocations."))
        self.stdout.write(self.style.SUCCESS(" Seeding process completed successfully!"))