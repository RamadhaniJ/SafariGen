from django.shortcuts import render
from django.contrib.auth import authenticate, password_validation

from Users.models import  CustomUserModel
from Users.Serializer import ( RegistrationSerializer,   CompanyOnboardingSerializer,
                              CompaniesDataTocreateStaffSerializer,
                              ChangePasswordSerializer
                              )
from Users.models import Company


from rest_framework.permissions import BasePermission, IsAuthenticated, AllowAny
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.exceptions import PermissionDenied

from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from Users.authentication import CustomJwtCookiesAuth


import datetime
from django.utils import timezone
from Users.send_opt_service import send_email_otp_service, OTPThrottled,verify_email_otp_service
from django.db import transaction
from django.core import signing
from django.core.exceptions import ValidationError
import secrets


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
    

class IsStaffOrManager(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated
            and request.user.is_active
            and request.user.status == "Active"
            and (
                   request.user.role in [
                                            CustomUserModel.UserRoles.STAFF,
                                            CustomUserModel.UserRoles.MANAGER
                                        ]
                )
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














class RegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistrationSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)


        with transaction.atomic():
            user = serializer.save()


        try:
            send_email_otp_service(user=user)
        except OTPThrottled as e:
            return Response(
                {"detail": e.message, "retry_after": e.retry_after},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )



        return Response(
            {
                "message": "Registration successful. Check your email for the OTP.",
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )










#=================================================OTP===============================
#2. OTP ONLY ...........
#=================================================OTP===============================

class ResendOTPView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get("email", "").lower().strip()
        user = CustomUserModel.objects.filter(email__iexact=email, is_active=False).first()



        if not user:
            return Response({"message": "If the email exists, an OTP has been sent."})

        try:
            send_email_otp_service(user)
        except OTPThrottled as e:
            return Response(
                {"detail": e.message, "retry_after": e.retry_after},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        return Response({"message": "If the email exists, an OTP has been sent."})




class VerifyEmailOTPView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get("email", "").lower().strip()
        code = request.data.get("otp_code", "").strip()

        user = CustomUserModel.objects.filter(
            email__iexact=email, is_active=False
        ).first()

        if not user:
            return Response(
                {"detail": "Invalid request."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            otp = verify_email_otp_service(user, code)
        except OTPThrottled as e:
            return Response(
                {"detail": e.message},
                status=status.HTTP_400_BAD_REQUEST,
            )




        with transaction.atomic():
            user.is_active = True
            user.save(update_fields=["is_active"])



            refresh = RefreshToken.for_user(user)
            access = refresh.access_token
            
            response = Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)

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



    


#=================================================OTP===============================
#=================================================OTP===============================








#@@@@@@@@@@++++++++++++++++++++COMPNIES VIEWS++++++++++++++++++++++

class CompanyOnboardingView(generics.CreateAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsManager]
    serializer_class = CompanyOnboardingSerializer
    parser_classes =[FormParser, MultiPartParser]

    def perform_create(self, serializer):
        serializer.save()




class ListManagerCompanyView(generics.ListAPIView):
        authentication_classes = [CustomJwtCookiesAuth]
        permission_classes = [IsAuthenticated, IsManager]
        serializer_class = CompanyOnboardingSerializer

        def get_queryset(self):
            return Company.objects.filter(owner=self.request.user)






class UpdateCompanyDetailsView(generics.RetrieveUpdateAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsManager]
    serializer_class = CompanyOnboardingSerializer
    parser_classes =[FormParser, MultiPartParser]
    lookup_field = "id"

    def get_queryset(self):
        return Company.objects.filter(owner = self.request.user)




 


class CompaniesDataToCreateStaffView(generics.ListAPIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [ IsAuthenticated,IsManager]
    serializer_class = CompaniesDataTocreateStaffSerializer

    def get_queryset(self):
            return Company.objects.filter(
                owner=self.request.user,
                status = "VERIFIED",
                ).order_by("name")



#@@@@@@@@@@++++++++++++++++++++COMPNIES VIEWS++++++++++++++++++++++






    


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







#============================FORGOT PASSWORD============================
RESET_TOKEN_SALT = "password-reset" # is a name to differentiate.
RESET_TOKEN_MAX_AGE = 10 * 60

class EnterEmailToRecoverPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").lower().strip()

        if email is None:
            return Response(
                          {"detail":"Email address is required"}, 
                            status=status.HTTP_400_BAD_REQUEST
                            )
        

        
        user = CustomUserModel.objects.filter(email__iexact = email).first()
        if user:
            try:
                send_email_otp_service(user=user)
            except OTPThrottled as e:
                return Response(
                                    {"detail":e.message, "retry_after":e.retry_after},
                                    status=status.HTTP_429_TOO_MANY_REQUESTS
                                )
            

        return Response(
            {
                "message":"If the email exists, a recovery code has been sent."
                
            },
                  status=status.HTTP_200_OK
                  
                  )




class EnterOTPToRecoverPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").lower().strip()
        otp_code = (request.data.get("otp_code") or "").strip()

        if not email or not otp_code:
            return Response(
                {"detail":"Email and OTP code are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(otp_code) != 6 or not otp_code.isdigit():
            return Response(
                {"detail":"Enter a valid 6-digit OTP code."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = CustomUserModel.objects.filter(email__iexact = email).first()

        if not user:
            return Response(
                {"detail":"Invalid or expired code."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            verify_email_otp_service(user=user, code=otp_code)
        except OTPThrottled as e:
            return Response(
                {"detail":e.message}, status=status.HTTP_400_BAD_REQUEST
            )

        token = signing.dumps(
            {"uid": str(user.id), "email":user.email},
            salt=RESET_TOKEN_SALT,
        )

        return Response(
            {
                "message":"OTP verified successfully",
                "reset_token": token,
                "expires_in":RESET_TOKEN_MAX_AGE
              
            }, 
            status=status.HTTP_200_OK
        )




class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("reset_token")
        password1 = request.data.get("password1")
        password2 = request.data.get("password2")

        if not token:
            return Response({"detail":"Reset token is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if password1 is None or len(password1) < 8:
            return Response({"detail":"Enter a valid password"}, status=status.HTTP_400_BAD_REQUEST)

 
        if password1 != password2:
            return Response({"detail":"Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payload = signing.loads(
                token,
                salt=RESET_TOKEN_SALT,
                max_age=RESET_TOKEN_MAX_AGE
            )
        except signing.SignatureExpired:
            return Response(
                {"detail":"Reset token has expired. Start again"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except signing.BadSignature:
            return Response(
                {"detail":"Invalid reset token"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = CustomUserModel.objects.filter(
            id = payload.get("uid"),
            email__iexact = payload.get("email",""),
        ).first()

        if not user:
            return Response(
                {"detail":"Invalid reset token"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password1)
        user.save(update_fields=["password"])

        return Response(
            {"message": "Password reset successfully. You can login"}, status=status.HTTP_200_OK
        )


class ResendOTPToResetPasswordView(APIView):
    permission_classes = []

    def post(self, request):
        email = (request.data.get("email") or "").lower().strip()
        user = CustomUserModel.objects.filter(email__iexact=email).first()
                                                    

        if not user:
            return Response({"message": "If the email exists, an OTP has been sent."})

        try:
            send_email_otp_service(user=user)
        except OTPThrottled as e:
            return Response(
                {"detail": e.message, "retry_after": e.retry_after},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        return Response({"message": "If the email exists, an OTP has been sent."})



#============================FORGOT PASSWORD============================




















#======================================================================
#           2.1                 CHANGE PASSWORD 
#======================================================================

class UserChangePasswordView(APIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaffOrManager]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data = request.data, context = {"request":request}
        )

        serializer.is_valid(raise_exception=True)
        user = serializer.save()
       

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        response =  Response({"message":"Password changed successfully."}, status=status.HTTP_200_OK)
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
        

        
        
