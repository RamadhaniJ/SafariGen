from django.urls import path 
from Itinerary.views import ( BulkCreateDayByDayItineraryView,
                              PreviewClientSafariItineraryView,
                                PricingBreakdownToStaffView ,
                                 ListItineraryWithVersionView,
                                  DeleteSpecificItineraryVersionView,
                                     )

from Itinerary.view_itinerary_edit import (
                                           GetVersionForEditView,
                                           SaveEditedItineraryView 
                                           )
from Itinerary.pdf_view import generate_safari_pdf
from Itinerary.price_preview import ItineraryPricePreviewView
from Itinerary.pricing_pdf import generate_pricing_pdf

urlpatterns = [
    path("bulk/create/daybyday/", BulkCreateDayByDayItineraryView.as_view(), name="create_day_by_day"),
    # Live price while building/editing (same engine as saving; writes nothing)
    path("price-preview/", ItineraryPricePreviewView.as_view(), name="itinerary_price_preview"),

    path("preview/client/safari/data/<uuid:client_id>/<uuid:version_id>/", PreviewClientSafariItineraryView.as_view(), name="preview_client_safari_day_by_day"),

    path("view/pdf/<uuid:client_id>/<uuid:version_id>/", generate_safari_pdf, name="generate_safari_pdf"),




    path("pricing-breakdown/<uuid:client_id>/<uuid:version_id>/", PricingBreakdownToStaffView.as_view(), name="staff-pricng-breakdown"),
    path("view/pricing/pdf/<uuid:client_id>/<uuid:version_id>/", generate_pricing_pdf, name="generate_pricing_pdf"),




     

    #================LIST========ITINERARY===============
    path("list/itinerary/quotes/", ListItineraryWithVersionView.as_view(), name="list_itinerary_to_staff"),


    #==========================DELETE SPECIFIC=ITINERARY VERSION=========
    path('delete/version/itinerary/<uuid:version_id>/', DeleteSpecificItineraryVersionView.as_view(), name="delete_itinerary_version"),




    #==========================EDITING=====================
      path(
        "edit/itinerary/<uuid:version_id>/", 
        GetVersionForEditView.as_view(), 
        name="get_version_for_edit"
    ),

      path(
        "edit/save/itinerary/<uuid:version_id>/<uuid:client_id>/", 
        SaveEditedItineraryView.as_view(), 
        name="get_version_for_edit"
    ),





]  



