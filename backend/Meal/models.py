from django.db import models
from uuid6 import uuid7
from Itinerary.models import MainDayByDayItinerary

# Create your models here.


# To list ... 
class MealPlan(models.Model):
    name = models.CharField(max_length=240)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Meal {self.name}"

 
 
# created ...
class OptionalMeal(models.Model):
        id = models.UUIDField(editable=False, default=uuid7, primary_key=True)
        day_optional_meal = models.ForeignKey(
             MainDayByDayItinerary,
             on_delete=models.CASCADE,
             related_name="day_optionals_meal",
             blank=True,
             null=True
        )
        
        meal = models.ForeignKey(
                                    MealPlan, 
                                    on_delete=models.CASCADE, 
                                    related_name="optional_meal"
                            )
        is_optional = models.BooleanField(
                                            default=False,
                                            help_text="is optional(True) if needed to pay for it"
                                        )
        price = models.DecimalField(
                                        default=0.00, 
                                        decimal_places=2, 
                                        max_digits=10,
                                        blank=True,
                                        null=True
                                 )
        created_at = models.DateTimeField(auto_now_add=True)
        updated_at = models.DateTimeField(auto_now=True) 

        def __str__(self):
             return self.meal.name
