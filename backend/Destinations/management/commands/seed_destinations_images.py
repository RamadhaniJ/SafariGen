import os
from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.files import File
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

        images_mapping = {
            "Serengeti National Park": [
                {"file_name": "serengeti1.avif", "tag": "Wildlife", "caption": "Lions resting on ancient granite Kopjes"},
                {"file_name": "serengeti2.jpeg", "tag": "Sunset", "caption": "Golden hour over Seronera plains"},
                {"file_name": "serengeti3.jpeg", "tag": "Wildlife", "caption": "Great Migration crossing the savannah 1"},
                {"file_name": "serengeti4.jpg", "tag": "Wildlife", "caption": "Great Migration crossing the savannah 2 "},
                {"file_name": "serengeti5.jpg", "tag": "Wildlife", "caption": "Great Migration crossing the savannah 2 "},
                {"file_name": "serengeti6.jpg", "tag": "Wildlife", "caption": "Great Migration crossing the savannah 2 "},
                {"file_name": "serengeti7.jpg", "tag": "Wildlife", "caption": "Great Migration crossing the savannah 2 "},
            ],
            "Ngorongoro Crater": [
                {"file_name": "ngorongoroc1.jpeg", "tag": "Wildlife", "caption": "Black Rhino grazing near Lake Magadi"},
                {"file_name": "ngorongoroc2.jpg", "tag": "Sunset", "caption": "Crater rim view at twilight 1"},
                {"file_name": "ngorongoroc3.webp", "tag": "Sunset", "caption": "Crater rim view at twilight 2"},
                {"file_name": "ngorongoroc4.webp", "tag": "Sunset", "caption": "Crater rim view at twilight 3"},
                {"file_name": "ngorongoroc5.jpeg", "tag": "Sunset", "caption": "Crater rim view at twilight 4"},
                {"file_name": "ngorongoroc6.jpeg", "tag": "Sunset", "caption": "Crater rim view at twilight 5 "},
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