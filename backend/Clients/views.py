from django.shortcuts import render
from Users.view_auth import IsStaff, IsManager, IsStaffOrManager
from Users.authentication import CustomJwtCookiesAuth
from Clients.Serializer import ( ClientInformationSerializer,
                                ClientInformationListSerializer,
                                 CreateClientRequestInformationSerializer,
                                 ClientInformationToPreviewSerializer,
                                  SmallClientInfoToBuildItinerarySerializer,

                                  ShortCompanyInfoToCreateClientSerializer
                                 )

from Users.models import Company
   
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from Clients.models import ClientInformation, ClientRequestInformation
# Create your views here.
 


#======================== STEP 1. 
class ShortCompanyInfoToCreateClientView(generics.ListAPIView):
       authentication_classes = [CustomJwtCookiesAuth]
       permission_classes = [IsAuthenticated, IsStaffOrManager]
       serializer_class = ShortCompanyInfoToCreateClientSerializer

       def get_queryset(self):
              member_companies_ids = self.request.user.companies.values_list("id", flat=True)
              return  Company.objects.filter(
                     id__in = member_companies_ids,
                     status = "VERIFIED"
              ).select_related(
                     "owner"
              )
  


# 1. CLIENT PERSONAL INFORMATION VIEW
class CreateClientInformationOnlyView(generics.CreateAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaffOrManager]
    serializer_class = ClientInformationSerializer


 



class RetrieveUpdateDeleteClientInformationView(generics.RetrieveUpdateDestroyAPIView):
        authentication_classes = [CustomJwtCookiesAuth]
        permission_classes = [IsAuthenticated, IsStaffOrManager]
        serializer_class = ClientInformationSerializer
        lookup_field = "id"

        def get_queryset(self): 
                current_user = self.request.user
                company_ids =current_user.companies.values_list('id', flat=True)


                queryset  = ClientInformation.objects.filter(
                       company_id__in = company_ids
                ).select_related(
                       'company', 'created_by'
                ).order_by('-created_at')

                return queryset




 
                
class ListClientInformationOnlyView(generics.ListAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaffOrManager]
    serializer_class = ClientInformationListSerializer

    def get_queryset(self):
           current_user = getattr(self.request, "user", None)
           company_ids = current_user.companies.values_list('id', flat = True)

           queryset = ClientInformation.objects.filter(
                  company_id__in = company_ids
           ).select_related(
                  'company', 'created_by'
           ).order_by("-created_at")

           return queryset
    
















#====================== STEP 2. create CLIENT REQUEST INFORMATION VIEW
class CreateClientRequestInformationView(generics.CreateAPIView):
          authentication_classes = [CustomJwtCookiesAuth]
          permission_classes = [IsAuthenticated, IsStaffOrManager]
          serializer_class = CreateClientRequestInformationSerializer










#=_________________=_______STEP 3: PREVIEW CLIENT DATA BEFORE ITINERARY___________.
class PreviewAllClienInformationView(generics.RetrieveUpdateAPIView):
          authentication_classes = [CustomJwtCookiesAuth]
          permission_classes = [IsAuthenticated, IsStaffOrManager]
          serializer_class = ClientInformationToPreviewSerializer
          lookup_field = "id"

          def get_queryset(self):
                 
                 current_user= getattr(self.request, "user", None)
                 if current_user is not None:
                        company_ids =current_user.companies.values_list('id', flat=True)
                 
                        return ClientRequestInformation.objects.filter(
                           client_requested__company_id__in = company_ids
                        ).select_related(
                            "client_requested",
                            "start_destination",
                            "end_destination"  
                        )
                 else:
                        return ClientRequestInformation.objects.none()






 




class SmallClientInfoToCreatItineraryView(generics.RetrieveUpdateAPIView):
          authentication_classes = [CustomJwtCookiesAuth]
          permission_classes = [IsAuthenticated, IsStaffOrManager]
          serializer_class = SmallClientInfoToBuildItinerarySerializer
          lookup_field = "id"

          def get_queryset(self):
                                 
                 current_user= getattr(self.request, "user", None)
                 if current_user is not None:
                        company_ids =current_user.companies.values_list('id', flat=True)
                 
                        return ClientRequestInformation.objects.filter(
                           client_requested__company_id__in = company_ids
                        ).select_related(
                            "client_requested",
                            "start_destination",
                            "end_destination"  
                        )
                 else:
                        return ClientRequestInformation.objects.none()

