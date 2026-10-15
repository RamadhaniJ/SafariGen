from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.
 

class Destination(models.Model):
    name = models.CharField(max_length=240)
    location = models.CharField(max_length=200, blank=True, null=True)

    location_latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    location_longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)

    featured_img = models.ImageField(upload_to="featuredImg/")

    destination_type = models.CharField(
        max_length=20,
        choices=[ 
            ("City","City"),
            ("Park","Park"),
            ("Beach","Beach"), 
            ("Mountain","Mountain"),
        ],
        help_text="eg. City (Arusha), Park (Serengeti), Beach (Zanzibar), Mountain (Mt Kilimanjaro)"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self): 
        return self.name




class DestinationSeason(models.Model):
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name="destination_season"
    ) 
    season_name = models.CharField(
        max_length=20, help_text="eg. High Season, Low Season, Peak Season. .."
    )
    start_day = models.PositiveSmallIntegerField(help_text="Day where season start", blank=True, null=True)
    start_month = models.PositiveSmallIntegerField(help_text="Month where season start", blank=True, null=True)

    end_day = models.PositiveSmallIntegerField(help_text="Day where season end", blank=True, null=True)
    end_month = models.PositiveSmallIntegerField(help_text="Month where season end", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def clean(self):
        if not (1 <= self.start_month <= 12) or not (1 <= self.end_month <= 12):
            raise ValidationError("Month values must be between 1 and 12.")

        if not (1 <= self.start_day <= 31) or not (1 <= self.end_day <= 31):
            raise ValidationError("Day values must be between 1 and 31.")
        


    def __str__(self):
        return f"{self.season_name} ({self.start_day}/{self.start_month} - {self.end_day}/{self.end_month})"










class DestinationFee(models.Model):
    destination = models.ForeignKey(
        Destination,
        related_name="destination_fee",
        on_delete=models.CASCADE
    )
    seasons = models.ForeignKey(
        DestinationSeason,
        on_delete=models.CASCADE,
        related_name="fee_seasons"
    )

    residency_label = models.CharField(
            max_length=15,
            choices=[
                ("NON_RESIDENT","Non Resident"),
                ("RESIDENT","Resident"),
                ("EAC_MEMBER","EAC Member"),
            ]
        )

    fee_category = models.CharField(
        max_length=20,
        choices=[
            ("ParkFee","Park Fee"),
            ("RescueFee","Rescue Fee"),
        ]
    )




    # ------------FEE------------------
    adult_fee = models.DecimalField(
            decimal_places=2,
            max_digits=10,
            blank=True,
            null=True,
        )
    
    child_fee = models.DecimalField(
                decimal_places=2,
                max_digits=10,
                blank=True,
                null=True,
        )


    

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def clean(self):
        from django.core.exceptions import ValidationError
        if self.seasons and self.seasons.destination.destination_type in ["Park","Mountain"]:
            if self.adult_fee <= 0 or self.adult_fee is None:
                raise ValidationError("For Parks and Mountains, adult fee price must be greater than 0.")


    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_residency_label_display()}-{self.adult_fee}"
  
    








class DestinationDescription(models.Model): 
    destination = models.ForeignKey(
                                Destination,
                                on_delete=models.CASCADE,
                                related_name="destination_desc"
                            )
    context_type = models.CharField(max_length=50, choices=[
            ("START", "Start / Welcome"),
            ("CENTER", "Center / In-Transit"),
            ("END", "End / Farewell"),
    ])
     
    content = models.TextField(help_text="description about the destination")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.destination.name





class DestinationImage(models.Model):
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name="destination_images"
    )

    images = models.ImageField(upload_to="destination/")
    tag = models.CharField(max_length=20, choices=[
        ("Arrival","arrival"), 
        ("Wildlife","wildlife"),
        ("Hotel","hotel"),
        ("Sunset","sunset"),
    ], blank=True, null=True)
    caption = models.CharField(max_length=200, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Destination {self.destination.name}"
    



