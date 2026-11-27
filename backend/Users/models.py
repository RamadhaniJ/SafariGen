from django.db import models
from django.contrib.auth.models import BaseUserManager, PermissionsMixin, AbstractBaseUser
from uuid6 import uuid7
from django.utils import timezone

# Create your models here.
# james@james.com
 
class CustomBaseUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email = email, **extra_fields)
        user.set_password(password)
        user.save(using = self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_superuser", True)  
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("role", CustomUserModel.UserRoles.ADMIN )

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have a is superuser True")

        if extra_fields.get("is_staff") is not True:
                    raise ValueError("Superuser must have a is Staff True")


        return self.create_user(email=email, password=password, **extra_fields)


 

  
  

# ==========================================
class Company(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid7)
    owner = models.ForeignKey(
         "CustomUserModel",
         on_delete=models.SET_NULL,
         blank=True,
         null=True,
         related_name="owned_companies"
    )
    name = models.CharField(max_length=250)
    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    logo = models.ImageField(upload_to='CompanyLogo/', blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    country = models.CharField(max_length=60, blank=True, null=True)
    about = models.TextField( blank=True, null=True)

    # Contact details shown to guests (quote page footer and PDF). Optional.
    address = models.CharField(max_length=255, blank=True, default="",
                               help_text="Office address, e.g. 'Sekei Rd, Arusha'")
    whatsapp_number = models.CharField(max_length=20, blank=True, default="")

    # Social media links shown to guests. Leave empty to hide.
    facebook_url = models.URLField(blank=True, default="")
    instagram_url = models.URLField(blank=True, default="")
    tiktok_url = models.URLField(blank=True, default="")
    youtube_url = models.URLField(blank=True, default="")
    twitter_url = models.URLField(blank=True, default="", help_text="X (Twitter) profile link")
    threads_url = models.URLField(blank=True, default="")
     
    # Verification Docs
    certificate_of_incorporation = models.FileField(upload_to="CompanyDocs/Incorporation/", blank=True, null=True)
    tax_id_certificate = models.FileField(upload_to="CompanyDocs/TaxId/", blank=True, null=True)
    tax_id_number = models.CharField(max_length=60, blank=True, null=True)

    status = models.CharField(max_length=10, choices=[
                                                  ("PENDING","Pending"),
                                                  ("VERIFIED","Verified"),
                                                  ("REJECTED","Rejected"),
                                             ], default='PENDING')
 
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    SOCIAL_FIELDS = [
        ("Facebook", "facebook_url"),
        ("Instagram", "instagram_url"),
        ("TikTok", "tiktok_url"),
        ("YouTube", "youtube_url"),
        ("Twitter", "twitter_url"),
        ("Threads", "threads_url"),
    ]

    def social_links(self):
        """[{name, url, handle}] for the links this company has filled in."""
        links = []
        for name, field in self.SOCIAL_FIELDS:
            url = (getattr(self, field, "") or "").strip()
            if not url:
                continue
            handle = url.rstrip("/").split("/")[-1].split("?")[0]
            links.append({"name": name, "url": url, "handle": handle if handle.startswith("@") else f"@{handle}"})
        return links

    def __str__(self):
        return self.name


 













 # MANAGER CAN ONLY REGISTER?.


class CustomUserModel(AbstractBaseUser, PermissionsMixin):
     class UserRoles(models.TextChoices):
          ADMIN = "ADMIN", "Admin"
          MANAGER = "MANAGER", "Manager"
          STAFF = "STAFF", "Staff"

     id = models.UUIDField(primary_key=True, editable=False, default=uuid7)

     companies = models.ManyToManyField(
          Company,
          related_name="manager_companies",
          blank=True,
     )
 

     full_name = models.CharField(max_length=200, blank=True, null= True)
     email = models.EmailField(unique=True) # Official email. 

 

     role = models.CharField(
            max_length=20, 
            choices=UserRoles.choices,
            default=UserRoles.MANAGER
            ) 
     
     status = models.CharField(max_length=10, choices=[
          ("Banned", "Banned"),
          ("Active", "Active"),
     ],
       default='Active'
    )
     
     reasons = models.TextField(blank=True, null=True)
     joined_at = models.DateTimeField(auto_now_add=True)



     created_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null= True,
        blank = True,
        related_name="team_members"
     )


     current_session_id = models.UUIDField( blank=True, null=True)
     is_active = models.BooleanField(default=False)
     is_staff = models.BooleanField(default=False)

     objects = CustomBaseUserManager()

     USERNAME_FIELD = "email"
     REQUIRED_FIELDS = ["full_name"]


     def __str__(self):
          return self.email



class UserEmailOTP(models.Model):
     id = models.UUIDField(default=uuid7, primary_key=True, editable=False)
     user = models.ForeignKey(CustomUserModel, related_name="email_otps", on_delete=models.CASCADE, blank=True, null=True)
      
     otp_code = models.CharField(max_length=20)
     attempts = models.PositiveSmallIntegerField(default=0) 
     MAX_ATTEMPTS = 5

     is_used = models.BooleanField(default=False)
     expired_at = models.DateTimeField()
     created_at  = models.DateTimeField(auto_now_add=True)

     def __str__(self):
        email = self.user.email if self.user else "Unknown User"
        return f"OTP for {email} (Expires: {self.expired_at})"


     @property
     def is_expired(self):
          return timezone.now() > self.expired_at



 

class ManagerProfile(models.Model):
     id = models.UUIDField(default=uuid7, primary_key=True, editable=False)

     user = models.OneToOneField(CustomUserModel, on_delete=models.CASCADE, related_name="manager_profile")


     phone_number = models.CharField(max_length=20, null = True, blank=True)
     about_me = models.TextField(blank=True, null=True)
     avatar = models.ImageField(upload_to="Profiles/", blank=True, null=True)


     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)

     
     def __str__(self):
          return f"{self.user.email} (Manager)"
 


class StaffProfile(models.Model):
     id = models.UUIDField(default=uuid7, primary_key=True, editable=False)

     user = models.OneToOneField(CustomUserModel, on_delete=models.CASCADE, related_name="staff_profile")



     phone_number = models.CharField(max_length=20, null = True, blank=True)
     avatar = models.ImageField(upload_to="StaffProfiles/", blank=True, null=True)
     about_me = models.TextField(blank=True, null=True)
 
     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)

     
     def __str__(self):
          return f"{self.user.email}"

 

