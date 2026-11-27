from django.apps import AppConfig


class ItineraryConfig(AppConfig):
    name = 'Itinerary'

    def ready(self):
        import Itinerary.signals  # noqa: F401  (re-price quotes when they're reopened)
