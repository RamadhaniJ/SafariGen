from django.db import models
from django.contrib.auth.models import BaseUserManager, PermissionsMixin, AbstractBaseUser
from uuid6 import uuid7

# Create your models here.
# jamesjames@gmail.com

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
        extra_fields.setdefault("is_verified", True)
        extra_fields.setdefault("role", CustomUserModel.UserRoles.ADMIN )

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have a is superuser True")

        if extra_fields.get("is_staff") is not True:
                    raise ValueError("Superuser must have a is Staff True")


        return self.create_user(email=email, password=password, **extra_fields)


 
class CustomUserModel(AbstractBaseUser, PermissionsMixin):
     class UserRoles(models.TextChoices):
          ADMIN = "ADMIN", "Admin"
          MANAGER = "MANAGER", "Manager"
          STAFF = "STAFF", "Staff"

     id = models.UUIDField(primary_key=True, editable=False, default=uuid7)

     company_name = models.CharField(max_length=250)
     email = models.EmailField(unique=True)
     phone_number = models.CharField(max_length=20, null = True, blank=True)


     role = models.CharField(
            max_length=20, 
            choices=UserRoles.choices,
            default=UserRoles.STAFF
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
        on_delete=models.CASCADE,
        null= True,
        blank = True,
        related_name="team_members"
     )

     is_verified = models.BooleanField(default=False)
     is_active = models.BooleanField(default=False)
     is_staff = models.BooleanField(default=False)

     objects = CustomBaseUserManager()

     USERNAME_FIELD = "email"
     REQUIRED_FIELDS = ["company_name"]


     def __str__(self):
          return self.email



class ManagerProfile(models.Model):
     id = models.UUIDField(default=uuid7, primary_key=True, editable=False)

     user = models.OneToOneField(CustomUserModel, on_delete=models.CASCADE, related_name="manager_profile")
     full_name = models.CharField(max_length=200, blank=True, null= True)
     avatar = models.ImageField(upload_to="Profiles/", blank=True, null=True)
     about_me = models.TextField(blank=True, null=True)

     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)

     
     def __str__(self):
          return f"{self.user.email} (Manager)"
 


class StaffProfile(models.Model):
     id = models.UUIDField(default=uuid7, primary_key=True, editable=False)

     user = models.OneToOneField(CustomUserModel, on_delete=models.CASCADE, related_name="staff_profile")
     full_name = models.CharField(max_length=200, blank=True, null= True)
     phone_number = models.CharField(max_length=20, blank=True, null= True)

     avatar = models.ImageField(upload_to="StaffProfiles/", blank=True, null=True)
     about_me = models.TextField(blank=True, null=True)

     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)

     
     def __str__(self):
          return f"{self.user.email} ({self.user.company_name})"



