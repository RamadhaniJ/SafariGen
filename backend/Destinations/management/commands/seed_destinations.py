from django.core.management.base import BaseCommand
from Destinations.models import ( 
    Destination, 
    DestinationSeason, 
    DestinationFee, 
    DestinationDescription
)
from decimal import Decimal, ROUND_HALF_UP
from Destinations.management.commands.destinations_data import DESTINATION_DATA
 


def clean_decimal(value):
    if value is None:
        return None
    return Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)



class Command(BaseCommand):
    help = 'Seeds Tanzanian destinations with seasons, fees, and 5 Start, 5 Center, 5 End descriptions each.'


    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Starting to seed Destinations data..."))
        

        destinations_data = DESTINATION_DATA

        for data in destinations_data:
            # 1. Create or Get Destination
            dest, created = Destination.objects.get_or_create(
                name=data["name"],
                defaults={
                    "location": data.get("location", ""),
                    "location_latitude": data.get("lat"),
                    "location_longitude": data.get("lng"),
                    "destination_type": data.get("type"),
                    "featured_img": data.get("featured_img", "featuredImg/default.jpg"),
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"✅ Created Destination: {dest.name}"))
            else:
                self.stdout.write(f"⚠️  Destination {dest.name} already exists. Adding related data...")

            # 2. Create Seasons and Fees from data
            seasons_data = data.get("seasons", [])
            for season_data in seasons_data:
                season, season_created = DestinationSeason.objects.get_or_create(
                    destination=dest,
                    season_name=season_data["season_name"],
                    defaults={
                        "start_day": season_data.get("start_day"),
                        "start_month": season_data.get("start_month"),
                        "end_day": season_data.get("end_day"),
                        "end_month": season_data.get("end_month"),
                    }
                )

                if season_created:
                    self.stdout.write(f"   📅 Created Season: {season.season_name}")

                # Create Fees for this Season
                fees_data = season_data.get("fees", [])
                for fee_data in fees_data:
                    fee, fee_created = DestinationFee.objects.get_or_create(
                        destination=dest,
                        seasons=season,
                        residency_label=fee_data["residency_label"],
                        fee_category=fee_data["fee_category"],
                        defaults={
                            "adult_fee": clean_decimal(fee_data.get("adult_fee")),
                            "child_fee": clean_decimal(fee_data.get("child_fee")),
                        }
                    )
                    if fee_created:
                        self.stdout.write(
                            f"      💰 Created Fee: {fee.get_residency_label_display()} - "
                            f"{fee.fee_category} (Adult: {fee.adult_fee})"
                        )

            # 3. Create 5 START Descriptions
            for desc in data.get("start_desc", []):
                DestinationDescription.objects.get_or_create(
                    destination=dest,
                    context_type="START",
                    content=desc
                )

            # 4. Create 5 CENTER Descriptions
            for desc in data.get("center_desc", []):
                DestinationDescription.objects.get_or_create(
                    destination=dest,
                    context_type="CENTER",
                    content=desc
                )

            # 5. Create 5 END Descriptions
            for desc in data.get("end_desc", []):
                DestinationDescription.objects.get_or_create(
                    destination=dest,
                    context_type="END",
                    content=desc
                )

            self.stdout.write(self.style.SUCCESS(f"🎉 Finished processing: {dest.name}\n"))

        self.stdout.write(self.style.SUCCESS("\n🎊 SUCCESS: All destinations seeded with seasons, fees, and descriptions!"))