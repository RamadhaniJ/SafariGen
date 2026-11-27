"""
Keep open quotes priced with current rates.

A quote that was Accepted/Rejected/Archived is frozen and isn't re-priced when
rates change. If it is later reopened (moved back to Draft, Sent or Changes
requested), or an older version is made current again, its saved price may be
out of date, so it is re-priced at that moment.
"""

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from Itinerary.models import ItineraryVersion


@receiver(pre_save, sender=ItineraryVersion)
def remember_previous_state(sender, instance, **kwargs):
    instance._previous_state = (
        ItineraryVersion.objects.filter(pk=instance.pk).values_list("status", "is_current").first()
        if instance.pk else None
    )


@receiver(post_save, sender=ItineraryVersion)
def reprice_reopened_quote(sender, instance, created, **kwargs):
    from Itinerary.models import ItineraryPricingSnapshot
    from Itinerary.pricing import FROZEN_STATUSES, reprice_versions

    instance._repriced = []
    previous = getattr(instance, "_previous_state", None)
    if created or previous is None:
        return                                   # new versions are priced by the serializer
    was_status, was_current = previous
    is_open = instance.is_current and instance.status not in FROZEN_STATUSES
    was_open = was_current and was_status not in FROZEN_STATUSES
    if not is_open or was_open:
        return                                   # only when it becomes open
    if not ItineraryPricingSnapshot.objects.filter(version=instance).exists():
        return                                   # never priced (still being built)
    instance._repriced = reprice_versions([instance])
