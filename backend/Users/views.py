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


# Create your views here.

# Permissions 

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool( 
            request.user
            and request.user.is_authenticated
            and request.user.status == "Active"
            and request.user.role == CustomUserModel.UserRoles.ADMIN
         )


class IsManager(BasePermission):
    def has_permission(self, request, view):
        return bool( 
                request.user 
                and request.user.is_authenticated
                # and request.user.is_verified
                and request.user.is_active
                and request.user.status == "Active"
                and request.user.role == CustomUserModel.UserRoles.MANAGER
         )


class IsStaff(BasePermission):
    def has_permission(self, request, view):
        return bool( 
                request.user and request.user.is_authenticated
                and request.user.is_active
                and request.user.status == "Active"
                and request.user.role == CustomUserModel.UserRoles.STAFF
         )
    



class CustomTokenRefreshView(TokenRefreshView):

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_code")

        if refresh_token is None:
            return Response(
                {"detail":"Authentication required"},
                status=status.HTTP_403_FORBIDDEN
            )

        request.data["refresh"] = refresh_token
        
        try:
            response = super().post(request, *args, **kwargs)
        except (TokenError, InvalidToken, CustomUserModel.DoesNotExist):
            return Response({"detail":"Authentication required"},
                            status=status.HTTP_403_FORBIDDEN
                            )

        if response.status_code == 200:
            access = response.data.get("access")
            if access:
                response.set_cookie(
                    key="access_code",
                    value=access,
                    httponly=True,
                    secure=True,
                    samesite='None',
                    path='/',
                    expires= timezone.now() + datetime.timedelta(minutes=30)
                )

        return response




class RegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegistrationSerializer



class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email:
            return Response(
                {"detail":"Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not password:
            return Response(
                {"detail":"Password is required"},
                status=status.HTTP_400_BAD_REQUEST
            )


        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response(
                {"detail":"Invalid email or password"},
                status=status.HTTP_403_FORBIDDEN
            )

        if not user.is_active:
            return Response(
                {"detail":"Your account is inactive!"},
                status=status.HTTP_403_FORBIDDEN
                )
        if user.status == "Banned":
            return Response(
                {"detail":"This account is banned"},
                status=status.HTTP_403_FORBIDDEN
            )

    
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        response = Response({"message":"Welcome Back"}, status=status.HTTP_200_OK)
        response.set_cookie(
            key="access_code",
            value=str(access),
            path='/',
            samesite='None',
            httponly=True,
            secure=True,
            expires=timezone.now() + datetime.timedelta(minutes=30)
        )

        response.set_cookie(
                            key="refresh_code",
                            value=str(refresh),
                            path='/',
                            samesite='None',
                            httponly=True,
                            secure=True,
                            expires=timezone.now() + datetime.timedelta(days=14)
                        )
        return response






class ManagerProfileView(generics.RetrieveUpdateAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsManager]
    serializer_class = ManagerProfileSerialzier
    parser_classes = [FormParser, MultiPartParser]

    def get_object(self):
        return self.request.user.manager_profile










class AddListStaffUserView(generics.ListCreateAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsManager]
    serializer_class = AddStaffSerializer


    def get_queryset(self):
        manager = self.request.user
        if manager is None:
            return CustomUserModel.objects.none()
        
        return CustomUserModel.objects.filter(
            created_by = manager
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








class LogoutView(APIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message":"Logged out"}, status=status.HTTP_200_OK)

        response.delete_cookie(
            key="access_code",
            path="/",
            samesite = 'None',
        )

        response.delete_cookie(
            key="refresh_code",
            path="/",
            samesite = "None",
        )

        return response




class StaffProfileView(generics.RetrieveUpdateAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaff]
    serializer_class = StaffProfileSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user.staff_profile