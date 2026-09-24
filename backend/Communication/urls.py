from django.urls import path
from .views import SendItineraryQuoteEmailView , ListCommunicationChannelView, ListEmailTemplatesView

urlpatterns = [
    path('send-email/quote/<uuid:client_id>/<uuid:version_id>/', SendItineraryQuoteEmailView.as_view(), name='send_itinerary_email'),

    path('list-channels/', ListCommunicationChannelView.as_view(), name='send_itinerary_email'),

    path("list/templates/", ListEmailTemplatesView.as_view(), name="list_email_templates")

] 