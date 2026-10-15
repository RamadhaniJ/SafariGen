from decimal import Decimal, ROUND_HALF_UP
from django.core.management.base import BaseCommand

from Destinations.models import Destination
from Accommodation.models import (
    Accommodation,
    AccommodationSeason,
    AccommodationRoomType,
    RoomRate,
    AccommodationDescription,
)
from Accommodation.management.commands.accommodation_data import ACCOMMODATION_DATA


def clean_decimal(value):
    if value is None or value == "":  
        return None
    return Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


class Command(BaseCommand):
    help = "Seeds accommodation data with multiple seasons, room types, meal plans, and descriptions."

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("🏨 Starting to seed Accommodations data..."))

        accommodations_data = ACCOMMODATION_DATA
        total_seeded = 0
        total_skipped = 0
        total_errors = 0

        for dest_name, accs in accommodations_data.items():
            try:

                clean_name = dest_name.strip()
                destination = Destination.objects.filter(name__iexact=clean_name).first()

                if not destination:
                    self.stdout.write(
                        self.style.ERROR(
                            f"❌ Destination '{dest_name}' haijapatikana DB! "
                            f"Hakikisha umeshaseed destinations kwanza."
                        )
                    )
                    continue

                self.stdout.write(f"\n📍 Processing destination: {destination.name}")

                for acc_data in accs:
                    acc_name = acc_data["name"].strip()

                    accommodation, created = Accommodation.objects.get_or_create(
                        destination=destination,
                        name=acc_name,
                        defaults={
                            "tag_label": acc_data.get("tag_label", "Hotel"),
                            "park_status": acc_data.get("park_status", "OutsidePark"),
                            "concession_fee_adult_non_resident": clean_decimal(
                                acc_data.get("concession_fee_adult_non_resident")
                            ),
                            "concession_fee_child_non_resident": clean_decimal(
                                acc_data.get("concession_fee_child_non_resident")
                            ),
                            "concession_fee_adult_resident": clean_decimal(
                                acc_data.get("concession_fee_adult_resident")
                            ),
                            "concession_fee_child_resident": clean_decimal(
                                acc_data.get("concession_fee_child_resident")
                            ),
                            "is_sponsored": acc_data.get("is_sponsored", False),
                            "sponsored_priority": acc_data.get("sponsored_priority", 0),
                            "featured_image": acc_data.get(
                                "featured_image", "accommodation/default.jpg"
                            ),
                        }
                    )

                    if created:
                        total_seeded += 1
                        self.stdout.write(
                            self.style.SUCCESS(f"  ✅ Created: {accommodation.name}")
                        )

                        # 3. Descriptions
                        for desc_text in acc_data.get("descriptions", []):
                            if desc_text and desc_text.strip():
                                AccommodationDescription.objects.get_or_create(
                                    accommodation=accommodation,
                                    description=desc_text.strip(),
                                )

                        # 4. Seasons na Room Rates
                        for season_data in acc_data.get("seasons", []):
                            season, _ = AccommodationSeason.objects.get_or_create(
                                accommodation=accommodation,
                                name=season_data["name"].strip(),
                                defaults={
                                    "start_day": season_data["start_day"],
                                    "start_month": season_data["start_month"],
                                    "end_day": season_data["end_day"],
                                    "end_month": season_data["end_month"],
                                }
                            )

                            # 5. Room Types na Rates
                            for room_info in season_data.get("rooms", []):
                                room_type, _ = AccommodationRoomType.objects.get_or_create(
                                    accommodation=accommodation,
                                    name=room_info["name"].strip(),
                                    defaults={"capacity": room_info.get("capacity")}
                                )

                                # Meal plans
                                for meal_plan, price in room_info.get("rates", {}).items():
                                    clean_meal_plan = meal_plan.strip().upper()
                                    if price is not None:
                                        RoomRate.objects.get_or_create(
                                            room_type=room_type,
                                            season=season,
                                            meal_plan=clean_meal_plan,
                                            defaults={"price_per_night": clean_decimal(price)}
                                        )

                    else:
                        total_skipped += 1
                        self.stdout.write(
                            self.style.WARNING(f"  ℹ️ Already exists: {accommodation.name}")
                        )

            except Exception as e:
                total_errors += 1
                self.stdout.write(
                    self.style.ERROR(f"❌ Error kwenye '{dest_name}': {e}")
                )

        # Summary ya mwisho
        self.stdout.write(
            self.style.SUCCESS(
                f"\n🎉 DONE! Seeded: {total_seeded} | "
                f"Skipped: {total_skipped} | Errors: {total_errors}"
            )
        )