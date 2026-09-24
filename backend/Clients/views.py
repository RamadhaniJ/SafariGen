from django.shortcuts import render
from Users.views import IsStaff
from Users.authentication import CustomJwtCookiesAuth
from Clients.Serializer import ( ClientInformationSerializer, ClientRequestInformationSerializer,
                                 ClientInformationToPreviewSerializer,
                                 SmallClientInfoToBuildItinerarySerializer
                                 )

from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from Clients.models import ClientInformation, ClientRequestInformation
# Create your views here.
 


# 1. CLIENT PERSONAL INFORMATION VIEW
class CreateClientInformationOnlyView(generics.CreateAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaff]
    serializer_class = ClientInformationSerializer


 



class RetrieveUpdateDeleteClientInformationView(generics.RetrieveUpdateDestroyAPIView):
        authentication_classes = [CustomJwtCookiesAuth]
        permission_classes = [IsAuthenticated, IsStaff]
        serializer_class = ClientInformationSerializer
        lookup_field = "id"

        def get_queryset(self):
                current_staff = getattr(self.request.user, "staff_profile" , None)
                if current_staff is not None:
                        return ClientInformation.objects.filter(
                                created_by = current_staff,
                        )
                return Response({"detail":"You are not allow here"}, status=status.HTTP_403_FORBIDDEN)



class ListClientInformationOnlyView(generics.ListAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaff]
    serializer_class = ClientInformationSerializer

    def get_queryset(self):
           current_staff = getattr(self.request.user, "staff_profile", None)
           if current_staff is not None:
                  return ClientInformation.objects.filter(
                      created_by = current_staff,   
                  )
           return Response({"detail":"You are not allowed here"}, status=status.HTTP_403_FORBIDDEN)










# 2. CLIENT REQUEST INFORMATION VIEW
class CreateClientRequestInformationView(generics.CreateAPIView):
          authentication_classes = [CustomJwtCookiesAuth]
          permission_classes = [IsAuthenticated, IsStaff]
          serializer_class = ClientRequestInformationSerializer


class PreviewAllClienInformationView(generics.RetrieveUpdateAPIView):
          authentication_classes = [CustomJwtCookiesAuth]
          permission_classes = [IsAuthenticated, IsStaff]
          serializer_class = ClientInformationToPreviewSerializer
          lookup_field = "id"

          def get_queryset(self):
                 current_staff = getattr(self.request.user, "staff_profile", None)
                 if current_staff is not None:
                        return ClientRequestInformation.objects.filter(
                               client_requested__created_by = current_staff
                        )
                 else:
                        return ClientRequestInformation.objects.none()






 

class SmallClientInfoToCreatItineraryView(generics.RetrieveUpdateAPIView):
          authentication_classes = [CustomJwtCookiesAuth]
          permission_classes = [IsAuthenticated, IsStaff]
          serializer_class = SmallClientInfoToBuildItinerarySerializer
          lookup_field = "id"

          def get_queryset(self):
                 current_staff = getattr(self.request.user, "staff_profile", None)
                 if current_staff is not None:
                        return ClientRequestInformation.objects.filter(
                               client_requested__created_by = current_staff
                        )
                 else:
                        return ClientRequestInformation.objects.none()


