from django.core.management.base import BaseCommand
from Meal.models import MealPlan  
from Meal.management.commands.meals_data import MEALS_PLAN_DATA


class Command(BaseCommand):
    help = 'Seeds 30 optional meal plans into the database.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting MealPlan seeding process..."))


        created_count = 0
        for meal_name in MEALS_PLAN_DATA:
            obj, created = MealPlan.objects.get_or_create(name=meal_name)
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(f" Successfully seeded {created_count} new MealPlans.")
        )
        self.stdout.write(self.style.SUCCESS(" Seeding completed successfully!"))