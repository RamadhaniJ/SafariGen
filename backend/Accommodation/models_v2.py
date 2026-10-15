# from django.db import models
# from uuid6 import uuid7
# from Destinations.models import Destination


# # ============================================================
# # ACCOMMODATION — Model Kuu
# # ============================================================
# class Accommodation(models.Model):
#     destination = models.ForeignKey(
#         Destination,
#         on_delete=models.CASCADE,
#         related_name="accommodation_dest",
#         blank=True,
#         null=True
#     )

#     name = models.CharField(max_length=240)
#     is_sponsored = models.BooleanField(default=False)
#     sponsored_priority = models.PositiveSmallIntegerField(default=0)
#     sponsored_until = models.DateTimeField(blank=True, null=True)

#     tag_label = models.CharField(
#         max_length=30,
#         choices=[
#             ("Hotel", "Hotel"),
#             ("Lodge", "Lodge"),
#             ("Resort", "Resort"),
#             ("BoutiqueHotel", "Boutique Hotel"),
#             ("TentedCamp", "Tented Camp"),
#             ("LuxuryGlamping", "Luxury Glamping"),
#             ("GuestHouse", "Guest House"),
#             # NEW:
#             ("Villa", "Villa"),
#             ("Apartment", "Apartment"),
#             ("Bungalow", "Bungalow"),
#             ("Cottage", "Cottage"),
#             ("MobileCamp", "Mobile Camp"),
#             ("Homestay", "Homestay"),
#         ]
#     )

#     park_status = models.CharField(
#         max_length=15,
#         choices=[("InsidePark", "Inside Park"), ("OutsidePark", "Outside Park")]
#     )

#     # Existing concession fees (kept as-is for compatibility)
#     concession_fee_adult_non_resident = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
#     concession_fee_child_non_resident = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
#     concession_fee_adult_resident = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
#     concession_fee_child_resident = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)

#     featured_image = models.ImageField(upload_to="accommodation/", blank=True, null=True)

#     # ============ NEW FIELDS (v2) ============
#     property_type = models.CharField(
#         max_length=30, blank=True, null=True,
#         choices=[
#             ("LODGE", "Lodge"), ("CAMP", "Tented Camp"), ("HOTEL", "Hotel"),
#             ("RESORT", "Resort"), ("VILLA", "Villa"), ("APARTMENT", "Apartment"),
#             ("BUNGALOW", "Bungalow"), ("COTTAGE", "Cottage"),
#         ],
#         help_text="Uainishaji wa kina wa property (optional)"
#     )
#     star_rating = models.PositiveSmallIntegerField(blank=True, null=True, help_text="1-5 stars")
#     total_rooms = models.PositiveSmallIntegerField(blank=True, null=True)
#     latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
#     longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
#     check_in_time = models.CharField(max_length=20, blank=True, null=True, help_text="e.g. 14:00")
#     check_out_time = models.CharField(max_length=20, blank=True, null=True, help_text="e.g. 10:00")
#     is_active = models.BooleanField(default=True)
#     is_seasonal = models.BooleanField(default=False, help_text="Camp inafunguliwa kwa misimu tu")

#     # Season ya mwaka (validity)
#     valid_year = models.PositiveSmallIntegerField(blank=True, null=True, help_text="Mwaka wa rates (e.g. 2026)")
#     valid_from = models.DateField(blank=True, null=True)
#     valid_to = models.DateField(blank=True, null=True)

#     # Rate basis ya default kwa property hii
#     default_rate_basis = models.CharField(
#         max_length=20, blank=True, null=True,
#         choices=[("PER_PERSON", "Per Person"), ("PER_ROOM", "Per Room"), ("PER_VILLA", "Per Villa")],
#         default="PER_ROOM",
#         help_text="Jinsi rates zinahesabiwa (inaweza kubadilishwa kwenye RoomRate)"
#     )

#     # Metadata
#     contact_email = models.EmailField(blank=True, null=True)
#     contact_phone = models.CharField(max_length=50, blank=True, null=True)
#     website = models.URLField(blank=True, null=True)
#     last_rate_update = models.DateTimeField(blank=True, null=True)
#     source_pdf = models.CharField(max_length=240, blank=True, null=True, help_text="Jina la PDF iliyotumika")

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ["-is_sponsored", "sponsored_priority", "name"]

#     def save(self, *args, **kwargs):
#         if self.park_status == "InsidePark":
#             if (
#                 self.concession_fee_adult_non_resident is None or
#                 self.concession_fee_adult_resident is None or
#                 self.concession_fee_child_non_resident is None or
#                 self.concession_fee_child_resident is None
#             ):
#                 raise ValueError("Concession fee is required when accommodation is Inside a Park")
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return self.name


# # ============================================================
# # SEASONS
# # ============================================================
# class AccommodationSeason(models.Model):
#     accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE, related_name="seasons")
#     name = models.CharField(max_length=100)
#     start_day = models.PositiveSmallIntegerField()
#     start_month = models.PositiveSmallIntegerField()
#     end_day = models.PositiveSmallIntegerField()
#     end_month = models.PositiveSmallIntegerField()

#     # ============ NEW FIELDS (v2) ============
#     season_type = models.CharField(
#         max_length=20, blank=True, null=True,
#         choices=[
#             ("PEAK", "Peak"), ("HIGH", "High"), ("SHOULDER", "Shoulder"),
#             ("MID", "Mid"), ("LOW", "Low"), ("GREEN", "Green"),
#             ("FESTIVE", "Festive"), ("SPECIAL", "Special Offer"),
#         ],
#         help_text="Aina ya season kwa urahisi wa filtering"
#     )
#     valid_year = models.PositiveSmallIntegerField(blank=True, null=True)
#     is_closed = models.BooleanField(default=False, help_text="Camp imefungwa kwenye season hii")
#     min_nights = models.PositiveSmallIntegerField(blank=True, null=True, help_text="Minimum stay")
#     notes = models.TextField(blank=True, null=True)

#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['start_day', 'start_month']

#     def __str__(self):
#         return f"{self.accommodation.name} - {self.name}"


# # ============================================================
# # ROOM TYPES
# # ============================================================
# class AccommodationRoomType(models.Model):
#     accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE, related_name="room_type")
#     name = models.CharField(max_length=100)
#     capacity = models.PositiveSmallIntegerField(blank=True, null=True)

#     # ============ NEW FIELDS (v2) ============
#     view = models.CharField(
#         max_length=30, blank=True, null=True,
#         choices=[
#             ("GARDEN", "Garden View"), ("SEA", "Sea View"), ("POOL", "Pool View"),
#             ("CITY", "City View"), ("WATERHOLE", "Waterhole View"), ("MOUNTAIN", "Mountain View"),
#             ("OCEAN", "Ocean View"), ("BEACH", "Beach Front"), ("CRATER", "Crater View"),
#             ("RIVER", "River View"), ("FOREST", "Forest View"), ("NONE", "No Specific View"),
#         ]
#     )
#     room_class = models.CharField(
#         max_length=20, blank=True, null=True,
#         choices=[
#             ("STANDARD", "Standard"), ("SUPERIOR", "Superior"), ("DELUXE", "Deluxe"),
#             ("PREMIUM", "Premium"), ("EXECUTIVE", "Executive"), ("SUITE", "Suite"),
#             ("JUNIOR_SUITE", "Junior Suite"), ("PRESIDENTIAL", "Presidential"),
#             ("VILLA", "Villa"), ("BUNGALOW", "Bungalow"), ("TENT", "Tent"),
#             ("COTTAGE", "Cottage"), ("APARTMENT", "Apartment"), ("FAMILY", "Family"),
#         ]
#     )
#     is_interconnected = models.BooleanField(default=False)
#     has_private_pool = models.BooleanField(default=False)
#     has_plunge_pool = models.BooleanField(default=False)
#     has_balcony = models.BooleanField(default=False)
#     has_air_conditioning = models.BooleanField(default=True)
#     max_adults = models.PositiveSmallIntegerField(blank=True, null=True)
#     max_children = models.PositiveSmallIntegerField(blank=True, null=True)
#     bed_configuration = models.CharField(max_length=200, blank=True, null=True, help_text="e.g. 1 King or 2 Singles + Extra Bed")
#     size_sqm = models.PositiveSmallIntegerField(blank=True, null=True)
#     number_of_rooms = models.PositiveSmallIntegerField(blank=True, null=True, help_text="Total rooms za aina hii")

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.name} ({self.accommodation.name})"


# # ============================================================
# # ROOM RATES
# # ============================================================
# class RoomRate(models.Model):
#     room_type = models.ForeignKey(AccommodationRoomType, on_delete=models.CASCADE, related_name="rates")
#     season = models.ForeignKey(AccommodationSeason, on_delete=models.CASCADE, related_name="rates", blank=True, null=True)

#     meal_plan = models.CharField(
#         max_length=50,
#         choices=[
#             ("FB", "Full Board (Breakfast, Lunch, Dinner)"),
#             ("HB", "Half Board (Breakfast, Dinner)"),
#             ("BB", "Bed & Breakfast"),
#             ("AI", "All Inclusive"),
#             ("RO", "Room Only"),
#         ]
#     )

#     price_per_night = models.DecimalField(max_digits=10, decimal_places=2)

#     # ============ NEW FIELDS (v2) ============
#     rate_basis = models.CharField(
#         max_length=20,
#         choices=[("PER_PERSON", "Per Person"), ("PER_ROOM", "Per Room"), ("PER_VILLA", "Per Villa")],
#         default="PER_ROOM",
#         help_text="MUHIMU: Jinsi rate inahesabiwa"
#     )
#     rate_type = models.CharField(
#         max_length=20,
#         choices=[
#             ("STO", "STO (Tour Operator)"), ("RACK", "Rack Rate"),
#             ("NET", "Net Rate"), ("BAR", "Best Available Rate"),
#             ("SPECIAL", "Special Offer"), ("RESIDENT", "Resident Rate"),
#         ],
#         default="STO"
#     )
#     currency = models.CharField(max_length=10, default="USD")
#     is_commissionable = models.BooleanField(default=False)
#     notes = models.CharField(max_length=200, blank=True, null=True)

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.room_type.name} - {self.meal_plan}"


# # ============================================================
# # DESCRIPTIONS
# # ============================================================
# class AccommodationDescription(models.Model):
#     accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE, related_name="accommodation_desc")
#     description = models.TextField()

#     # NEW:
#     description_type = models.CharField(
#         max_length=30, blank=True, null=True,
#         choices=[
#             ("GENERAL", "General"), ("ROOM", "Room"), ("DINING", "Dining"),
#             ("ACTIVITY", "Activity"), ("LOCATION", "Location"), ("AMENITY", "Amenity"),
#         ],
#         default="GENERAL"
#     )

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"desc for {self.accommodation.name}"


# # ============================================================
# # IMAGES
# # ============================================================
# class AccommodationImages(models.Model):
#     accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE, related_name="accommodation_images")
#     images = models.ImageField(upload_to="AccommodationImgs")
#     tag = models.CharField(
#         max_length=20,
#         choices=[
#             ('EXTERIOR', 'Exterior View'), ('ROOM', 'Bed Room'), ('DINING', 'Dining & Food'),
#             ('POOL', 'Swimming Pool'), ('LOUNGE', 'Lounge & Bar'), ('VIEW', 'Balcony'),
#             # NEW:
#             ('BATHROOM', 'Bathroom'), ('BEACH', 'Beach'), ('ACTIVITY', 'Activity'),
#             ('LOBBY', 'Lobby'), ('GARDEN', 'Garden'),
#         ]
#     )
#     caption = models.CharField(max_length=200, blank=True, null=True)
#     is_featured = models.BooleanField(default=False)
#     sort_order = models.PositiveSmallIntegerField(default=0)

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"Images for {self.accommodation.name}"


# # ============================================================
# # 🆕 SUPPLEMENTS (Easter, Christmas, New Year, Gala Dinner)
# # ============================================================
# class AccommodationSupplement(models.Model):
#     accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE, related_name="supplements")
#     name = models.CharField(max_length=100, help_text="e.g. Christmas Gala Dinner")
#     start_day = models.PositiveSmallIntegerField()
#     start_month = models.PositiveSmallIntegerField()
#     end_day = models.PositiveSmallIntegerField()
#     end_month = models.PositiveSmallIntegerField()
#     amount_per_adult = models.DecimalField(max_digits=8, decimal_places=2)
#     amount_per_child = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
#     is_mandatory = models.BooleanField(default=False)
#     applicable_meal_plan = models.CharField(max_length=50, blank=True, null=True, help_text="AI, HB, FB, BB au tupu kwa wote")
#     valid_year = models.PositiveSmallIntegerField(blank=True, null=True)
#     notes = models.TextField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.accommodation.name} - {self.name}"


# # ============================================================
# # 🆕 ACTIVITIES (Game Drives, Bush Dinner, Sundowners, n.k.)
# # ============================================================
# class AccommodationActivity(models.Model):
#     accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE, related_name="activities")
#     name = models.CharField(max_length=200)
#     description = models.TextField(blank=True, null=True)
#     price_per_adult = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
#     price_per_child = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
#     price_per_vehicle = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
#     price_per_group = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
#     price_note = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. Upon Request")
#     duration = models.CharField(max_length=50, blank=True, null=True)
#     min_pax = models.PositiveSmallIntegerField(blank=True, null=True)
#     max_pax = models.PositiveSmallIntegerField(blank=True, null=True)
#     is_available = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.accommodation.name} - {self.name}"


# # ============================================================
# # 🆕 FEES (Park, WMA, Camping, TDL, Infrastructure, Crater Car)
# # ============================================================
# class AccommodationFee(models.Model):
#     accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE, related_name="fees")
#     name = models.CharField(max_length=100)
#     fee_type = models.CharField(
#         max_length=30,
#         choices=[
#             ("PARK", "Park Entry Fee"), ("CONCESSION", "Concession Fee"),
#             ("WMA", "Wildlife Management Area Fee"), ("CAMPING", "Camping Fee"),
#             ("TDL", "Tourism Development Levy"), ("INFRASTRUCTURE", "Infrastructure Tax"),
#             ("CRATER_CAR", "Crater Car Fee"), ("RANGER", "Ranger Fee"),
#             ("VEHICLE", "Vehicle Fee"), ("OTHER", "Other"),
#         ]
#     )
#     adult_non_resident = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
#     child_non_resident = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
#     adult_resident = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
#     child_resident = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
#     is_per_vehicle = models.BooleanField(default=False)
#     is_per_night = models.BooleanField(default=True)
#     is_included_in_rate = models.BooleanField(default=False)
#     valid_year = models.PositiveSmallIntegerField(blank=True, null=True)
#     notes = models.TextField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.accommodation.name} - {self.name}"


# # ============================================================
# # 🆕 POLICIES (Child, Cancellation, Payment, Check-in/out)
# # ============================================================
# class AccommodationPolicy(models.Model):
#     accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE, related_name="policies")
#     policy_type = models.CharField(
#         max_length=30,
#         choices=[
#             ("CHILD", "Child Policy"), ("CANCELLATION", "Cancellation Policy"),
#             ("PAYMENT", "Payment Policy"), ("CHECK_IN_OUT", "Check In/Out"),
#             ("MINIMUM_STAY", "Minimum Stay"), ("GROUP", "Group Policy"),
#             ("PETS", "Pet Policy"), ("SMOKING", "Smoking Policy"),
#             ("OTHER", "Other"),
#         ]
#     )
#     description = models.TextField()
#     valid_year = models.PositiveSmallIntegerField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.accommodation.name} - {self.get_policy_type_display()}"


# # ============================================================
# # 🆕 INCLUSIONS / EXCLUSIONS
# # ============================================================
# class AccommodationInclusion(models.Model):
#     accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE, related_name="inclusions")
#     meal_plan = models.CharField(max_length=50, blank=True, null=True, help_text="BB, HB, FB, AI au tupu kwa wote")
#     type = models.CharField(max_length=10, choices=[("INCLUDE", "Included"), ("EXCLUDE", "Excluded")])
#     item = models.CharField(max_length=200)
#     notes = models.CharField(max_length=200, blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.accommodation.name} - {self.type}: {self.item}"


# # ============================================================
# # 🆕 TRANSFERS (Airport, Airstrip)
# # ============================================================
# class AccommodationTransfer(models.Model):
#     accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE, related_name="transfers")
#     from_location = models.CharField(max_length=200)
#     to_location = models.CharField(max_length=200, blank=True, null=True)
#     price_per_vehicle = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
#     price_per_person = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
#     max_pax_per_vehicle = models.PositiveSmallIntegerField(blank=True, null=True)
#     duration_minutes = models.PositiveSmallIntegerField(blank=True, null=True)
#     is_included = models.BooleanField(default=False)
#     notes = models.CharField(max_length=200, blank=True, null=True)

#     def __str__(self):
#         return f"{self.accommodation.name} - {self.from_location} to {self.to_location}"


# # ============================================================
# # 🆕 CIRCUIT DISCOUNTS (Multi-Property Discounts)
# # ============================================================
# class AccommodationCircuitDiscount(models.Model):
#     accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE, related_name="circuit_discounts")
#     min_nights = models.PositiveSmallIntegerField()
#     discount_percent = models.DecimalField(max_digits=5, decimal_places=2)
#     valid_season = models.CharField(max_length=100, blank=True, null=True)
#     notes = models.TextField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.accommodation.name} - {self.min_nights}+ nights: {self.discount_percent}%"