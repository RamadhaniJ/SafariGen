from django.core.management.base import BaseCommand
from Activities.models import ActivityType, ActivityLocation  
from Activities.management.commands.activities_data import ACTIVITIES_TYPES_DATA, LOCATIONS_DATA

class Command(BaseCommand):
    help = 'Seeds 25 Activity Types and essential Activity Locations into the database.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting database seeding process..."))


        created_types = 0
        for item in ACTIVITIES_TYPES_DATA:
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

        created_locations = 0
        for loc in LOCATIONS_DATA:
            obj, created = ActivityLocation.objects.get_or_create(location_name=loc)
            if created:
                created_locations += 1

        self.stdout.write(self.style.SUCCESS(f" Successfully seeded {created_locations} new ActivityLocations."))
        self.stdout.write(self.style.SUCCESS(" Seeding process completed successfully!"))