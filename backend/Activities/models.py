from django.db import models
from Destinations.models import Destination
from Itinerary.models import MainDayByDayItinerary
from uuid6 import uuid7

# Create your models here. 
   

# LISTED TO USER TO SELECT (FROM VIA TO.)
class ActivityLocation(models.Model):
    class Meta:
        verbose_name = "activity place"
        verbose_name_plural = "activity places"

    # used  in seraching  activity location
    location_name = models.CharField(
                                 max_length=200,
                                 help_text="Can be 'hotel', 'destination', air ports','City'. eg: Kilimanjaro Airport (JRO), Mt. Meru Hotel, Seronera Airstrip "
                                 )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.location_name


 


# LISTED TO USER TO SELECT
class ActivityType(models.Model):
    class Meta:
        verbose_name = "activity type"
        verbose_name_plural = "activity types"

    title = models.CharField(max_length=240, help_text="eg. Game Driver(Not Transport), Arusha to Manyara(Transport)")
    involve_transport = models.BooleanField(
        default=False,
         help_text= "To trigger (From via end): eg. Transfer From Arusha, via Karatu To Manyara"
        )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title









class Activity(models.Model):
    id = models.UUIDField(
        editable=False,
        primary_key=True,
        default=uuid7
    )

 
    day_itinerary = models.ForeignKey(
        MainDayByDayItinerary,
        on_delete=models.CASCADE,
        related_name="day_activities",
        null=True,
        blank=True
    )
    activity_type = models.ForeignKey(
                                        ActivityType, 
                                        on_delete=models.CASCADE,
                                        related_name="activity_type"
                                        )

    main_location = models.ForeignKey(
                                        ActivityLocation, 
                                        on_delete=models.SET_NULL,
                                        blank=True,
                                        null=True,
                                        related_name="activity_main_location",
                                        help_text="Only this is filled if the activity is out of trasport"
                                    )



    start_location = models.ForeignKey(
                                        ActivityLocation, 
                                        on_delete=models.SET_NULL,
                                        blank=True,
                                        null=True,
                                        related_name="activity_start_location",
                                        help_text="This is filled if the activity is trasport"
                                    )


    via_location = models.ForeignKey(
                                        ActivityLocation, 
                                        on_delete=models.SET_NULL,
                                        blank=True,
                                        null=True,
                                        related_name="activity_via_location",
                                        help_text="This is filled if the activity is trasport ( used to detect trasnit fee if the ngorongoro is select as via)"
                                    )

 
    end_location = models.ForeignKey(
                                        ActivityLocation, 
                                        on_delete=models.SET_NULL,
                                        blank=True,
                                        null=True,
                                        related_name="activity_end_location",
                                        help_text="This is filled if the activity is  trasport"
                                    )


    moment = models.CharField(
        max_length=20,
                        choices=[
                            ("1_MORNING", "Morning"),
                            ("2_AFTERNOON", "Afternoon"),
                            ("3_EVENING", "Evening"),
                            ("4_NIGHT", "Night"),
                            ("5_FULL_DAY", "Full Day"),
                        ]
    )

    transit_fee_included = models.BooleanField(default=False)
    transit_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Transit fee if this activity include Transit to a park"

    )

    transit_fee_per = models.CharField(
        max_length=10,
        choices=[
            ("Pax", "Per Personal"),
            ("Group", "Per Group"),
            ("Vehicle", "Per Vehicle"),
        ],
        blank=True,
        null=True,
        help_text="Transit fee per."
    )


    # IF IS OPTIONAL AND NO PRICE (ERROR)
    is_optional = models.BooleanField(
                                      default=False, 
                                      help_text="Is optional is True (enter a price for it) if it  need a guest to pay for it (Can go or not go if has money)"
                                      )
    optional_activity_price = models.DecimalField(
                                 default=0.00, 
                                 decimal_places=2,
                                 max_digits=10,
                                 help_text="price for optional activities",
                                 blank=True,
                                 null=True,
                                 )

    price_per = models.CharField(
        max_length=20,
        choices=[
            ("PerPersonal","Per Personal"),
            ("PerGroup","Per Group"),
            ("PerVehicle","Per Vehicle"),
        ],
        blank=True, null=True
    )
    

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "activity on a day"
        verbose_name_plural = "activities on days"
        ordering = ["moment"]

    def __str__(self):
        return self.activity_type.title