from django.db import models
from uuid6 import uuid7
from Destinations.models import Destination
from Accommodation.models import Accommodation, AccommodationRoomType
# from Activities.models import Activity
from Clients.models import ClientRequestInformation
from Users.models import CustomUserModel

# Create your models here.
  
  
class MainDayByDayItinerary(models.Model):
    id = models.UUIDField(default=uuid7, primary_key=True, editable=False)
    version = models.ForeignKey(
        "ItineraryVersion", 
        on_delete=models.CASCADE,
        related_name="version_daybyday",
     )

    day_number = models.PositiveSmallIntegerField(
        help_text="current Day in safari (Day 1, Day 2, Day 3.)"
    )
    nights_number = models.PositiveSmallIntegerField(
        default=1,
        help_text="Numbre of nights staying on this destination/accommodation"
        )

    destination = models.ForeignKey( 
        Destination,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="destination_daybyday"
    )

    accommodation = models.ForeignKey(
                                        Accommodation,
                                        on_delete=models.SET_NULL,
                                        blank=True,
                                        null=True,
                                        related_name="accommodation_daybyday"
                                    )
 

    included_meals = models.CharField(
                                        max_length=240, 
                                        help_text="Array Fields, Breakfast, lunch, dinner",
                                        null=True,
                                        blank=True
                                     )
    

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        ordering = ["day_number"]


    def __str__(self):
        client = self.version.client_request.client_requested
        return f"Tour for {client.salutation}. {client.first_name} {client.last_name} ({self.version.client_request.tour_length} Days)"






# chagua siku then add room selected that day ....
class SelectedDayRoom(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid7)

    day_itinerary = models.ForeignKey(
        MainDayByDayItinerary,
        on_delete=models.CASCADE,
        related_name="selected_rooms"
    )
 
    room_type = models.ForeignKey(
        AccommodationRoomType,
        on_delete=models.CASCADE
    )

    quantity = models.PositiveSmallIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.quantity} x {self.room_type.name} (Day {self.day_itinerary.day_number})"













# PRICING.....................


class ItineraryPricingSnapshot(models.Model):

    id = models.UUIDField(
        default=uuid7, primary_key=True, editable=False

    )

    version = models.OneToOneField(
        "ItineraryVersion",
        on_delete=models.CASCADE,
        related_name="version_pricing_snapshot",
    ) 



    total_accommodation = models.DecimalField(
        max_digits=12,
        decimal_places=2, default=0.00
    )
    total_park_fees = models.DecimalField(
        max_digits=12,
        decimal_places=2, default=0.00
    )

    total_concession_fees = models.DecimalField(
        max_digits=12,
        decimal_places=2, default=0.00
    )

    total_transport_vehicle = models.DecimalField(
        max_digits=12,
        decimal_places=2, default=0.00
    )

    total_activities = models.DecimalField(
        max_digits=12,
        decimal_places=2, default=0.00
    )

    total_optional_meals = models.DecimalField(
        max_digits=12,
        decimal_places=2, default=0.00
    )


 


    subtotal_net = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00
        )
    commission_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00
    )
    commission_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2, default=0.00
    )




    grand_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00
    )
    price_per_person = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00
    ) 
 

 
    generated_by = models.ForeignKey(
        CustomUserModel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True

    )

    map_image = models.ImageField(
        upload_to="safari_maps",
        blank=True,
        null=True,
        help_text="Cached map image from Mapbox"
    )

    map_generated_at = models.DateTimeField(
        blank=True, 
        null=True,
        help_text="When map was generated"
    )



    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Snapshot: {self.version.client_request.tour_code} v{self.version.version_number} - ${self.grand_total}"






class ItineraryPricingBreakdownItem(models.Model):

    id = models.UUIDField(primary_key=True, editable=False, default=uuid7)

    snapshot = models.ForeignKey(
        ItineraryPricingSnapshot,
        on_delete=models.CASCADE,
        related_name="breakdown_items"
    )

    day_number = models.PositiveSmallIntegerField(
        help_text="Day number (0 = applies to all days, e.g. Commission)"
    )
 
    date_display = models.CharField(
        max_length=50, 
        blank=True, null=True,
        help_text="e.g. '15 Oct 2026' or '15-17 Oct 2026'"
    )

    CATEGORY_CHOICES = [
        ("ACCOMMODATION", "Accommodation"),
        ("PARK_FEE", "Park / Rescue Fee"),
        ("CONCESSION", "Concession Fee (Inside Park)"),
        ("ACTIVITY", "Activity (Optional/Transit)"),
        ("OPTIONAL_MEAL", "Optional Meal"),
        ("VEHICLE", "Vehicle Rental"),
        ("COMMISSION", "Agency Commission"),
    ]

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)

    item_title = models.CharField(
        max_length=250,
        help_text="e.g. 'Arusha Coffee Lodge - Double Room'"
    )

    item_description = models.TextField(
        blank=True, null=True,
        help_text="Extra details: 'Inside Park', 'High Season', 'Full Board', etc."
    )



    unit_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00,
        help_text="Price per unit (e.g. $82 per pax for park fee)"
    )
    quantity = models.DecimalField(
        max_digits=6, decimal_places=2, default=1.00,
        help_text="Quantity (e.g. 4 pax, or 5 days, or 2 rooms)"
    )
    unit_label = models.CharField(
        max_length=30, 
        default="pax",
        help_text="Label for quantity: 'pax', 'nights', 'days', 'rooms', 'vehicles'"
    )
    line_total = models.DecimalField(
        max_digits=12, decimal_places=2, default=0.00,
        help_text="unit_price × quantity = line_total"
    )

    sort_order = models.PositiveSmallIntegerField(
        default=0,
        help_text="Order within the same day (1=Accommodation, 2=Park Fee, etc.)"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["day_number", "sort_order"]


    def __str__(self):
        return f"Day {self.day_number}: {self.item_title} = ${self.line_total}"


   
 


class ItineraryVersion(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid7,
        editable=False 
    )

    client_request = models.ForeignKey(
        ClientRequestInformation,
        on_delete=models.CASCADE,
        related_name="itinerary_versions"
    )

    version_number = models.PositiveIntegerField(
        help_text="1,2,3..."
    )

    STATUS_CHOICES = [
        ("DRAFT",               "Draft"),
        ("SENT",                "Sent to Guest"),
        ("CHANGES_REQUESTED",   "Guest Requested Changes"),
        ("ACCEPTED",            "Accepted by Guest"),
        ("REJECTED",            "Rejected by Guest"),
        ("ARCHIVED", "Archived")
    ]
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="DRAFT")
    is_current = models.BooleanField(
        default=True,
        help_text="Current version which is edited"
    ) 

    based_on = models.ForeignKey(
        "self", null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="derived_versions",
        help_text="version used as a primary for this "
         )


    # Added new fields 

    snapshot_tour_title = models.CharField(
          max_length=255,
            help_text="current version Tour Title ",
            blank=True,
            null=True
        )

    snapshot_tour_type = models.CharField(
          max_length=255,
            help_text="current version Tour type ",
            blank=True,
            null=True
        )

    snapshot_tour_country_visited = models.CharField(
            max_length=255,
            help_text="current version Tour length ",
            blank=True,
            null=True
        )


    snapshot_tour_length = models.PositiveSmallIntegerField(
            help_text="current version Tour length ",
            blank=True,
            null=True
        )

    snapshot_tour_start_date = models.DateField(
            help_text="Current version of Start date ",
            blank=True,
            null=True
        )

    snapshot_travellers_json = models.JSONField(
        default=list,
        blank=True,
        null=True,
        help_text="Current version of Snapshot of  travellers: [{'age_category': 'ADULT', 'number': 2, 'is_resident': False}]"
    )

    snapshot_rooms_json = models.JSONField(
        default=list,
        help_text="Current Version of Snapshot of rooms: [{'label': 'DOUBLE', 'number': 1}]",
        blank=True,
        null=True
    )


    snapshot_start_destination = models.ForeignKey(
        Destination,
        related_name="snaped_start_destination",
        on_delete=models.SET_NULL,
        help_text="Current Version of Snapshot of start destination",
        blank=True,
        null=True
    )

    snapshot_end_destination = models.ForeignKey(
        Destination,
        related_name="snaped_end_destination",
        on_delete=models.SET_NULL,
        help_text="Current Version of Snapshot of End Destination",
        blank=True,
        null=True
    )

    # Added new fields 
 
    change_summary = models.TextField(
        blank=True, 
        null=True,
        help_text="changes made on this version"
    )
   

    created_by = models.ForeignKey(
        CustomUserModel, null=True, blank=True, on_delete=models.SET_NULL
    )


    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("client_request","version_number")
        ordering = ['-version_number']
        constraints = [
            models.UniqueConstraint(
                fields=["client_request"],
                condition=models.Q(is_current=True),
                name="unique_current_version_per_client"
            )
        ]

        indexes = [
            models.Index(fields=["client_request", "-version_number"]),
            models.Index(fields=["client_request", "status"]),
        ]


    def __str__(self):
        return f"{self.client_request.tour_code} v {self.version_number} [{self.status}]"