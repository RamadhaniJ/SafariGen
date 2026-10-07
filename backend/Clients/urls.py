from django.urls import path
from Clients.views import (
    CreateClientInformationOnlyView,
    RetrieveUpdateDeleteClientInformationView,
    ListClientInformationOnlyView,


    CreateClientRequestInformationView,
    PreviewAllClienInformationView,

    SmallClientInfoToCreatItineraryView,


    ShortCompanyInfoToCreateClientView,
)
 

urlpatterns = [

 
 
    # 1. CREATE CLIENT PERSONAL INFORMATION
    #===========1.1= COMPANY LIST TO SELECT TO CREATE CLIENT ======
    path('company/list/', ShortCompanyInfoToCreateClientView.as_view(), name="company_info_to_create_client"),

    path("create/clients/", CreateClientInformationOnlyView.as_view(), name="create_clients"),
    path("list/clients/", ListClientInformationOnlyView.as_view(), name="list_clients"),
    path("update/clients/<uuid:id>/", RetrieveUpdateDeleteClientInformationView.as_view(), name="update_retrieve_delete_clients"),


 
 

    # 2. CREATE CLIENT REQUEST INFORMATION
    path("create/clients/request/", CreateClientRequestInformationView.as_view(), name="create_clients_request"),

    path("preview/clients/information/<uuid:id>/", PreviewAllClienInformationView.as_view(), name="preview_all_clients_info"),

    path("small/clients/information/<uuid:id>/", SmallClientInfoToCreatItineraryView.as_view(), name="small__clients_info"),



    
] 