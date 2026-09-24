from django.db import models
from Users.models import StaffProfile
from Destinations.models import Destination
from uuid6 import uuid7
from django.utils import timezone
import uuid
  
# Create your models here.

class ClientInformation(models.Model):
    id = models.UUIDField(editable=False, primary_key=True, default=uuid7)

    created_by = models.ForeignKey(
                                    StaffProfile,
                                    on_delete=models.SET_NULL,
                                    related_name="staff_create_client",
                                    null=True,
                                    blank=True
                                ) 
     
  
    email = models.EmailField(unique=True)
    salutation = models.CharField(max_length=10, choices=[
                                                            ("Mr","Mr"),
                                                            ("Ms","Ms"),
                                                            ("Mrs","Mrs"),
                                                            ("Prof","Prof"),
                                                            ("Dr","Dr"),
                                                        ])
    
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)

    country = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    source = models.CharField(max_length=20, blank=True, null=True, help_text="eg. Website, Facebook..")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.salutation}. {self.first_name} {self.last_name}"

    # 1. --------------------CLIENT INFORMATION -------------------------





 

 


    # 2. --------------------CLIENT REQUEST INFORMATION  -------------------------
class ClientRequestInformation(models.Model):
    id = models.UUIDField(
        editable=False, primary_key=True,
        default=uuid7
    ) 

    tour_code = models.CharField(
                                   max_length=60, 
                                   blank=True, 
                                   null=True,
                                   unique=True
                                   )
     
    client_requested = models.ForeignKey(
        ClientInformation,
        on_delete=models.CASCADE,
        related_name="client_request_info"
    )
    tour_title = models.CharField(max_length=250)
    tour_type = models.CharField(max_length=100)

    tour_length = models.PositiveSmallIntegerField(default=1, help_text="Duration in days (e.g. 10)")
    country_visited = models.CharField(max_length=250, help_text="Comma-separated eg. Tanzania, kenya,")

    tour_start_date = models.DateField()
    start_destination = models.ForeignKey(
                                        Destination, 
                                        on_delete=models.SET_NULL,
                                        related_name="user_start_dest",
                                        blank=True,
                                        null=True
                                        )

    
    end_destination = models.ForeignKey(
                                        Destination, 
                                        on_delete=models.SET_NULL,
                                        related_name="user_end_dest",
                                        blank=True,
                                        null=True
                                        )
 
    request_info = models.TextField( blank=True, null=True )

    price_per_personal = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0.00, 
        blank=True, null=True
        )

    safari_grand_total = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0.00, 
        blank=True, null=True
        )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.tour_code:
            current_year = timezone.now().year
            random_hash = uuid.uuid4().hex[:8].upper()
            self.tour_code = f"TOUR-{current_year}-{random_hash}"

            while ClientRequestInformation.objects.filter(tour_code = self.tour_code).exists():
                    random_hash = uuid.uuid4().hex[:8].upper()
                    self.tour_code = f"TOUR-{current_year}-{random_hash}"


        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.client_requested.salutation} {self.client_requested.first_name} {self.client_requested.last_name}"

    @property
    def room_breakdown(self):
        return list(
            self.room_selected.values('label','number')
        )


    @property
    def traveller_breakdown(self):
        return list(
            self.travellers.values('label','number')
        )


 


 

 
class Traveller(models.Model):
    id = models.UUIDField(editable=False, primary_key=True, default=uuid7)
    request = models.ForeignKey(
                                ClientRequestInformation,
                                on_delete=models.CASCADE,
                                related_name='travellers'
                            )

    age_category = models.CharField(
        max_length=20,
        choices=[
            ("ADULT","Adult (16+)"), 
            ("CHILD","Child (5-15)"),
            ("INFANT","Infant (0-4)"),
        ])
    is_resident = models.BooleanField(default=False)
    number = models.PositiveSmallIntegerField(help_text="Number of traveller eg. 2, 4")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Traveller {self.age_category}-{self.number}"










class RoomSelection(models.Model):
    id = models.UUIDField(editable=False, primary_key=True, default=uuid7)
    request = models.ForeignKey(
                                    ClientRequestInformation, 
                                    on_delete=models.CASCADE, 
                                    related_name="room_selected"
                                    )

    label = models.CharField(max_length=50, choices=[
                                                        ("SINGLE", "Single Room"),
                                                        ("DOUBLE", "Double Room"),
                                                        ("TWIN", "Twin Room"),
                                                        ("TRIPLE", "Triple Room"),
                                                        ("FAMILY", "Family Suite"),
                                                    ])
    number = models.PositiveSmallIntegerField(help_text="Number of room selected eg. 1, 2, 4")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_label_display()} X {self.number}"









