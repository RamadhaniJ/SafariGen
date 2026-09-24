from django.core.management.base import BaseCommand
from Meal.models import MealPlan  


class Command(BaseCommand):
    help = 'Seeds 30 optional meal plans into the database.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting MealPlan seeding process..."))

        meal_plans = [
            # Standard Meals
            "Full Board (FB - Breakfast, Lunch, Dinner)",
            "Half Board (HB - Breakfast & Dinner)",
            "Bed & Breakfast (BB)",
            "All Inclusive (AI - Meals & Selected Drinks)",
            "Room Only (RO - No Meals)",

            # Safari & Outdoor Bush Meals
            "Packed Picnic Lunch Box",
            "Bush Breakfast in the Wild",
            "Bush Dinner under the Stars",
            "Sundowner Drinks & Bites",
            "Hot Lunch at Safari Lodge",
            "Barbecue / Braai Dinner",

            # Dietary & Special Options
            "Vegetarian Meal Plan",
            "Vegan Meal Plan",
            "Halal Certified Meals",
            "Gluten-Free Meal Plan",
            "Dairy-Free / Lactose-Free Plan",
            "Kosher Prepared Meals",
            "Jain Vegetarian Plan",
            "Keto / Low-Carb Meal Plan",

            # Kid & Family Plans
            "Children's Safari Menu",
            "Infant / Toddler Fresh Purees",

            # Gourmet, Cultural & Specialty
            "Authentic Swahili Seafood Dinner",
            "Traditional Tanzanian Nyama Choma",
            "Chef's 5-Course Fine Dining Tasting",
            "Candlelight Beach Dinner",
            "Private Villa Chef Service",

            # Breakfast & Refreshment Variations
            "Early Bird Game Drive Breakfast Box",
            "Continental Buffet Breakfast",
            "Full English / American Breakfast",
            "Afternoon High Tea & Pastries"
        ]

        created_count = 0
        for meal_name in meal_plans:
            obj, created = MealPlan.objects.get_or_create(name=meal_name)
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(f" Successfully seeded {created_count} new MealPlans.")
        )
        self.stdout.write(self.style.SUCCESS(" Seeding completed successfully!"))