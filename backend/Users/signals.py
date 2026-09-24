from django.db.models.signals import post_save
from django.dispatch import receiver
from Users.models import ManagerProfile, CustomUserModel, StaffProfile

@receiver(post_save, sender=CustomUserModel)
def create_manager_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == CustomUserModel.UserRoles.MANAGER:
            ManagerProfile.objects.create(
                user = instance,
            )
        elif instance.role == CustomUserModel.UserRoles.STAFF:
            StaffProfile.objects.create(
                user = instance,
            )
            