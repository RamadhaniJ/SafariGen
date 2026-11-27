from django.db import models
from uuid6 import uuid7
from Destinations.models import Destination

# Create your models here.

 

 
# ACCOMMODATION TO LIST TO USER TO SELECT
class Accommodation(models.Model):
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name="accommodation_dest",
        blank=True, 
        null=True 
   ) 

    name = models.CharField(max_length=240)
    is_sponsored = models.BooleanField(
        default=False,
        help_text="Is this Hotel sponsored (If the owner pay the sponsored fee)"
    )
    sponsored_priority = models.PositiveSmallIntegerField(
        default=0,
        help_text="1 = High (Top 3), 2 = Medium (Top 5), 3 = Low (Top 10)"
    )
    
    sponsored_until = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Date where the sponsored deal ends"

    )
    tag_label = models.CharField(max_length=30,
                       choices=[
                           ("Hotel","Hotel"),
                           ("Lodge","Lodge"),
                           ("Resort","Resort"),
                           ("BoutiqueHotel","Boutique Hotel"),
                           ("TentedCamp","Tented Camp"),
                           ("LuxuryGlamping","Luxury Glamping"),
                           ("GuestHouse","Guest House"),
                        ])

    park_status = models.CharField(
        max_length=15,
        choices=[
            ("InsidePark","Inside Park"),
            ("OutsidePark","Outside Park"),
        ],
        help_text="is this accommodation inside the park? (to add the concession fee)"
        )
    

    concession_fee_adult_non_resident = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        help_text="Adult (Non Resident) Concession fee per night (inside park Accommodations)",
        blank=True,
        null=True
    )
    concession_fee_child_non_resident  = models.DecimalField(
            max_digits=8,
            decimal_places=2,
            help_text="Child (Non Resident) Concession fee for child per night (inside the park Accommodations)",
            blank=True,
            null=True

        )


    concession_fee_adult_resident  = models.DecimalField(
                max_digits=8,
                decimal_places=2,
                help_text="Adult (Resident)/EAC Concession fee per night (inside the park Accommodations)",
                blank=True,
                null=True
    
            )

    concession_fee_child_resident  = models.DecimalField(
                max_digits=8,
                decimal_places=2,
                help_text="Child (Resident)/EAC Concession fee per night (inside the park Accommodations)",
                blank=True,
                null=True
    
            )

    featured_image = models.ImageField(upload_to="accommodation/")


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

 
    class Meta:
        verbose_name = "lodge / hotel"
        verbose_name_plural = "lodges & hotels"
        ordering = ["-is_sponsored","sponsored_priority","name"]


    def save(self, *args, **kwargs):
        if self.park_status == "InsidePark":
            if  (
                self.concession_fee_adult_non_resident is None or 
                self.concession_fee_adult_resident is None or 

                self.concession_fee_child_non_resident is None or 
                self.concession_fee_child_resident is None
                ):
               
               raise ValueError("Concession fee is required when accommodation is Inside a Park")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name







class AccommodationSeason(models.Model):
    accommodation = models.ForeignKey(
        Accommodation,
        on_delete=models.CASCADE,
        related_name="seasons"
    ) 

    name = models.CharField(
        max_length=100,
        help_text="eg. High Season, Green/Low Season, Peak"
    )


    start_day = models.PositiveSmallIntegerField(help_text="Day which a season start")
    start_month = models.PositiveSmallIntegerField(help_text="Month which a season start")

    end_day = models.PositiveSmallIntegerField(help_text="Day which a season End")
    end_month = models.PositiveSmallIntegerField(help_text="Month which a season End")


    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name = "lodge season"
        verbose_name_plural = "lodge seasons"
        ordering = ['start_day','start_month']


    def __str__(self):
        return f"{self.accommodation.name}-{self.name} ({self.start_day} / {self.start_month}) - ({self.end_day} / {self.end_month})"





class AccommodationRoomType(models.Model):
    class Meta:
        verbose_name = "room type"
        verbose_name_plural = "room types"

    accommodation = models.ForeignKey(
        Accommodation,
        on_delete=models.CASCADE,
        related_name="room_type"
    ) 
    

    name = models.CharField(
        max_length=100,
        help_text="eg. Single, Double, Twin, Triple, Family Suite"
    )
    capacity = models.PositiveSmallIntegerField(
        help_text="Max number of guests",
         blank=True,
         null=True
        )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name









class RoomRate(models.Model):
    class Meta:
        verbose_name = "room price"
        verbose_name_plural = "room prices"


    room_type = models.ForeignKey(
        AccommodationRoomType,
        on_delete=models.CASCADE,
        related_name="rates"
    )
    
    season = models.ForeignKey(
        AccommodationSeason,
        on_delete=models.CASCADE,
        related_name="rates",
        blank=True,
        null=True,
        help_text="Left empty if the price is for whole year"
    )

    meal_plan = models.CharField(
        max_length=50,
        choices=[
            ("FB", "Full Board (Breakfast, Lunch, Dinner)"),
            ("HB", "Half Board (Breakfast, Dinner)"),
            ("BB", "Bed & Breakfast"),
            ("AI", "All Inclusive"),
        ]
    )

    price_per_night = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Price of room per night ($ USD)"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.room_type.accommodation.name




class AccommodationDescription(models.Model):
    class Meta:
        verbose_name = "lodge description"
        verbose_name_plural = "lodge descriptions"

    accommodation = models.ForeignKey(
                                        Accommodation, 
                                        on_delete=models.CASCADE, 
                                        related_name="accommodation_desc"
                                        )
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"desc for {self.accommodation.name}"



class AccommodationImages(models.Model):
    class Meta:
        verbose_name = "lodge photo"
        verbose_name_plural = "lodge photos"

    accommodation = models.ForeignKey(
                                        Accommodation,
                                        on_delete=models.CASCADE,
                                        related_name="accommodation_images"
                                        )
    images = models.ImageField(upload_to="AccommodationImgs")
    tag = models.CharField(max_length=20, choices=[ 
        ('EXTERIOR', 'Exterior View'),
        ('ROOM', 'Bed Room'),
        ('DINING', 'Dining & Food'),
        ('POOL', 'Swimming Pool'),
        ('LOUNGE', 'Lounge & Bar'),
        ('VIEW', 'Balcony'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Images for {self.accommodation.name}"

