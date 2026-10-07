from django.shortcuts import render
from django.contrib.auth import authenticate

from Users.models import StaffProfile, CustomUserModel
from Users.Serializer import ( RegistrationSerializer, ManagerProfileSerialzier, AddStaffSerializer, ShortInfoSerialziser ,
                              StaffProfileSerializer)


from rest_framework.permissions import BasePermission, IsAuthenticated, AllowAny
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from Users.authentication import CustomJwtCookiesAuth


import datetime
from django.utils import timezone
from Users.send_opt_service import send_email_otp_service, OTPThrottled,verify_email_otp_service
from Users.view_auth import IsManager, IsStaff
from django.db import transaction


# Create your views here.





class ManagerProfileView(generics.RetrieveUpdateAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsManager]
    serializer_class = ManagerProfileSerialzier
    parser_classes = [FormParser, MultiPartParser]

    def get_object(self):
        return self.request.user.manager_profile














#----------------------------------------------------------
#---------------------STAFF VIEWS-------------------------
#----------------------------------------------------------
class AddListStaffUserView(generics.ListCreateAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsManager]
    serializer_class = AddStaffSerializer


    def get_queryset(self):
        manager = self.request.user
        if manager is None:
            return CustomUserModel.objects.none()
        
        return CustomUserModel.objects.filter(
            created_by = manager,
            role = CustomUserModel.UserRoles.STAFF
        )


class UpdateStaffUserView(generics.UpdateAPIView):
        authentication_classes = [CustomJwtCookiesAuth]
        permission_classes = [IsAuthenticated, IsManager]
        serializer_class = AddStaffSerializer
        lookup_field = "id"

        def get_queryset(self):
            return CustomUserModel.objects.filter(
                created_by = self.request.user,
                role = CustomUserModel.UserRoles.STAFF
            )







class ManagerDeleteStaffView(APIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsManager]

    def delete(self, request, id):
        try:
            user = CustomUserModel.objects.get(
                id = id,
                created_by = request.user,
                role = CustomUserModel.UserRoles.STAFF
            )
        except CustomUserModel.DoesNotExist:
            return Response({"detail":"Staff member not found"}, status=status.HTTP_404_NOT_FOUND)

        user.delete()

        return Response(
            {"message":"Staff member deleted successfully"},
            status=status.HTTP_200_OK
        )





#----------------------------------------------------------
#---------------------STAFF VIEWS-------------------------
#----------------------------------------------------------







class ShortInfoView(APIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated]


    def get(self, request):
        user = ShortInfoSerialziser(request.user).data
        return Response(
            {
                "user":user
            }, status=status.HTTP_200_OK
        )




class StaffProfileView(generics.RetrieveUpdateAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaff]
    serializer_class = StaffProfileSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user.staff_profile