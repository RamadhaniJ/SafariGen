import os
from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.files import File

# Badilisha 'destination' kulingana na jina rasmi la Django app yako
from Destinations.models import Destination, DestinationImage


class Command(BaseCommand):
    help = 'Seeds images into DestinationImage model from a local folder.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("📸 Starting to seed Destination Images..."))

        # Folder la picha zote kwenye root ya project yako (your_project/sample_images/)
        base_image_dir = os.path.join(settings.BASE_DIR, 'sample_images')

        if not os.path.exists(base_image_dir):
            self.stdout.write(self.style.ERROR(f"❌ Folder halijapatikana: {base_image_dir}"))
            self.stdout.write(
                self.style.NOTICE(
                    "Tafadhali tengeneza folder linaloitwa 'sample_images' kwenye root ya project yako na uweke picha zako huko."
                )
            )
            return

        # Ramani ya Picha kwa kila Destination iliyo kwenye Database yako
        # Weka majina ya picha zako jinsi zilivyo kwenye sample_images/ 
        images_mapping = {
            "Serengeti National Park": [
                {"file_name": "serengeti1.avif", "tag": "Wildlife", "caption": "Lions resting on ancient granite Kopjes"},
                {"file_name": "serengeti2.jpeg", "tag": "Sunset", "caption": "Golden hour over Seronera plains"},
                {"file_name": "serengeti3.jpeg", "tag": "Wildlife", "caption": "Great Migration crossing the savannah 1"},
                {"file_name": "serengeti4.jpg", "tag": "Wildlife", "caption": "Great Migration crossing the savannah 2 "},
            ],
            "Ngorongoro Crater": [
                {"file_name": "ngorongoroc1.jpeg", "tag": "Wildlife", "caption": "Black Rhino grazing near Lake Magadi"},
                {"file_name": "ngorongoroc2.jpg", "tag": "Sunset", "caption": "Crater rim view at twilight 1"},
                {"file_name": "ngorongoroc3.webp", "tag": "Sunset", "caption": "Crater rim view at twilight 2"},
                {"file_name": "ngorongoroc4.webp", "tag": "Sunset", "caption": "Crater rim view at twilight 3"},
                {"file_name": "ngorongoroc5.jpeg", "tag": "Sunset", "caption": "Crater rim view at twilight 4"},
                {"file_name": "ngorongoroc6.jpeg", "tag": "Sunset", "caption": "Crater rim view at twilight 5 "},
            ],
            "Tarangire National Park": [
                {"file_name": "Taarangire3.jpg", "tag": "Wildlife", "caption": "Large elephant herd beneath ancient baobab trees"},
                {"file_name": "tarangire1.jpg", "tag": "Sunset", "caption": "Sunset over Tarangire River 1"},
                {"file_name": "Tarangire2.webp", "tag": "Sunset", "caption": "Sunset over Tarangire River 2"},
                {"file_name": "Tarangire4.webp", "tag": "Sunset", "caption": "Sunset over Tarangire River 3"},
            ],
            "Zanzibar - Nungwi & Stone Town": [
                {"file_name": "zanzibar.jpg", "tag": "Sunset", "caption": "Turquoise Indian Ocean waters at Nungwi Beach"},
                {"file_name": "zanzibar1.jpeg", "tag": "Arrival", "caption": "Historic carved doors of Stone Town 4"},
                {"file_name": "zanzibar3.jpeg", "tag": "Arrival", "caption": "Historic carved doors of Stone Town 3"},
            ],
            "Zanzibar - Stone Town & Beaches": [
                {"file_name": "zanzibar_stone1.webp", "tag": "Sunset", "caption": "Traditional dhow sailing during sunset"},
                {"file_name": "zanzibar_stone2.webp", "tag": "Arrival", "caption": "Pristine white sand beach 1"},
                {"file_name": "zanzibar_stone3.webp", "tag": "Arrival", "caption": "Pristine white sand beach 2"},
                {"file_name": "zanzibar_stone5.webp", "tag": "Arrival", "caption": "Pristine white sand beach 3"},
                {"file_name": "zanzibar_stone6.jpg", "tag": "Arrival", "caption": "Pristine white sand beach 4"},
            ],
            "Mount Kilimanjaro": [
                {"file_name": "mkilimanjaro.jpeg", "tag": "Arrival", "caption": "Snow-capped Uhuru Peak reaching 5,895m"},
                {"file_name": "mkilimanjaro1.jpeg", "tag": "Sunset", "caption": "Sun setting behind Mount Kilimanjaro 1"},
                {"file_name": "mkilimanjaro2.jpeg", "tag": "Sunset", "caption": "Sun setting behind Mount Kilimanjaro 2"},
            ],
            "Lake Manyara National Park": [
                {"file_name": "lake_manyara1.jpg", "tag": "Wildlife", "caption": "Flocks of pink flamingos along alkaline lake"},
                {"file_name": "lake_manyara2.jpeg", "tag": "Arrival", "caption": "Groundwater forest canopy walkway 1"},
                {"file_name": "lake_manyara3.webp", "tag": "Arrival", "caption": "Groundwater forest canopy walkway 2"},
                {"file_name": "lake_manyara4.jpg", "tag": "Arrival", "caption": "Groundwater forest canopy walkway 3"},
                {"file_name": "lake_manyara4.webp", "tag": "Arrival", "caption": "Groundwater forest canopy walkway 4"},
                {"file_name": "lake_manyara5.jpg", "tag": "Arrival", "caption": "Groundwater forest canopy walkway 5"},
            ],
            "Arusha City (Safari Capital)": [
                {"file_name": "arusha.jpg", "tag": "Arrival", "caption": "Aerial view of Arusha city with Mount Meru"},
                {"file_name": "arusha2.jpeg", "tag": "Hotel", "caption": "Lush tropical gardens in Arusha lodge 1"},
                {"file_name": "arusha3.jpeg", "tag": "Hotel", "caption": "Lush tropical gardens in Arusha lodge 2 "},
              
            ],
            "Ruaha National Park": [
                {"file_name": "ruaha1.webp", "tag": "Wildlife", "caption": "Elephants digging for water along Great Ruaha River"},
                {"file_name": "ruaha2.jpeg", "tag": "Sunset", "caption": "Baobab studded wilderness landscape 1"},
                {"file_name": "ruaha2.webp", "tag": "Sunset", "caption": "Baobab studded wilderness landscape 2"},
                {"file_name": "ruaha3.jpeg", "tag": "Sunset", "caption": "Baobab studded wilderness landscape 3"},
                {"file_name": "ruaha4.jpeg", "tag": "Sunset", "caption": "Baobab studded wilderness landscape 4"},
                {"file_name": "ruaha5.jpeg", "tag": "Sunset", "caption": "Baobab studded wilderness landscape 5"},
            ],
            "Mikumi National Park": [
                {"file_name": "mikumi1.jpeg", "tag": "Wildlife", "caption": "Giraffes and zebras grazing on Mkata Floodplain"},
                {"file_name": "mikumi2.jpeg", "tag": "Wildlife", "caption": "Giraffes and zebras grazing on Mkata Floodplain 1"},
                {"file_name": "Mikumi.jpg", "tag": "Wildlife", "caption": "Giraffes and zebras grazing on Mkata Floodplain 2"},
                {"file_name": "Mikumi3.jpeg", "tag": "Wildlife", "caption": "Giraffes and zebras grazing on Mkata Floodplain 3"},
                {"file_name": "Mikumi4.webp", "tag": "Wildlife", "caption": "Giraffes and zebras grazing on Mkata Floodplain 4"},
            ],
        }

        seeded_count = 0

        for dest_name, images_list in images_mapping.items():
            try:
                # 1. Tafuta Destination iliyopo tayari kwenye Database
                destination = Destination.objects.get(name=dest_name)

                # 2. Ingiza Picha zake
                for img_info in images_list:
                    file_path = os.path.join(base_image_dir, img_info["file_name"])

                    if os.path.exists(file_path):
                        with open(file_path, 'rb') as f:
                            django_file = File(f)

                            # Tumia get_or_create ili kuzuia kudurufu picha yenye caption na tag hiyo hiyo
                            img_obj, created = DestinationImage.objects.get_or_create(
                                destination=destination,
                                # tag=img_info["tag"],
                                caption=img_info["caption"]
                            )

                            if created:
                                img_obj.images.save(img_info["file_name"], django_file, save=True)
                                seeded_count += 1
                                self.stdout.write(
                                    self.style.SUCCESS(f"  📸 Added: {img_info['file_name']} -> {destination.name}")
                                )
                            else:
                                self.stdout.write(
                                    self.style.WARNING(f"  ℹ️ Image already exists for {destination.name}: {img_info['caption']}")
                                )
                    else:
                        self.stdout.write(
                            self.style.ERROR(f"  ❌ Image file NOT found on PC: {file_path}")
                        )

            except Destination.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f"⚠️ Destination '{dest_name}' haijapatikana kwenye database! Hakikisha jina linalingana.")
                )

        self.stdout.write(self.style.SUCCESS(f"\n🎉 Successfully seeded {seeded_count} images in seconds!"))