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
            

# ---------------------------------------------------------------------------
# Re-price a company's open quotes when its vehicle price changes.
# ---------------------------------------------------------------------------
from django.db.models.signals import pre_save
from Users.models import Company


@receiver(pre_save, sender=Company)
def remember_old_vehicle_rate(sender, instance, **kwargs):
    if instance.pk:
        instance._old_vehicle_rate = (
            Company.objects.filter(pk=instance.pk).values_list("vehicle_rate_per_day", flat=True).first()
        )
    else:
        instance._old_vehicle_rate = None


@receiver(post_save, sender=Company)
def reprice_quotes_when_vehicle_rate_changes(sender, instance, created, **kwargs):
    instance._repriced = []
    if created or getattr(instance, "_old_vehicle_rate", None) == instance.vehicle_rate_per_day:
        return
    from Itinerary.pricing import reprice_company_quotes   # avoid import cycle
    instance._repriced = reprice_company_quotes(instance)
