from Users.views import (
      ManagerProfileView, 
     ShortInfoView,

    AddListStaffUserView,
    UpdateStaffUserView,
    ManagerDeleteStaffView,

    StaffProfileView
)
from Users.view_auth import (
   LoginView, RegistrationView, CustomTokenRefreshView,LogoutView,


   ResendOTPView,
   VerifyEmailOTPView,  

   
   CompanyOnboardingView, 
   UpdateCompanyDetailsView,
   ListManagerCompanyView,
   CompaniesDataToCreateStaffView,

   EnterEmailToRecoverPasswordView,
   EnterOTPToRecoverPasswordView,
   ResetPasswordView,
   ResendOTPToResetPasswordView,

   UserChangePasswordView
)
from django.urls import path


urlpatterns = [
    path("token/refresh", CustomTokenRefreshView.as_view(), name="custom_token_refresh"),
 
    #                     AUTHENTICATIONS ---------------------------------------
    path("users/login", LoginView.as_view(), name="login_view"),
    path("users/register", RegistrationView.as_view(), name="user_register_view"),

    #======---------------------RESET PASSWORD---------------------------
    path("users/password-reset/email", EnterEmailToRecoverPasswordView.as_view(), name="enter_email"),
    path("users/password-reset/opt", EnterOTPToRecoverPasswordView.as_view(), name="enter_otp"),
    path("users/password-reset/confirmation", ResetPasswordView.as_view(), name="reset_password"),
    path("users/password-reset/resend", ResendOTPToResetPasswordView.as_view(), name="resend_otp_password"),
    #======---------------------RESET PASSWORD---------------------------

  

    #====================== OTP==============
    path("users/verify/email-opt", VerifyEmailOTPView.as_view(), name="verify_email_otp"),
    path("users/resend-otp", ResendOTPView.as_view(), name="resend_otp_to_user"),
    #====================== OTP===================



    #=================COMPANY==============
    path('users/create/company', CompanyOnboardingView.as_view(), name="manager_create_company_info"),
    path('users/update/company/<uuid:id>/', UpdateCompanyDetailsView.as_view(), name="manager_edit_company_info"),
    path('users/list/company', ListManagerCompanyView.as_view(), name="list_companies"),
    path('users/list/companies-data', CompaniesDataToCreateStaffView.as_view(), name="list_companies_to_create_staff"),
    #=================COMPANY==============





    path("users/logout", LogoutView.as_view(), name="user_logout_view"),
    path("users/isauthenticated", ShortInfoView.as_view(), name="check_user_is_authenticated"),


    #  --------------------------- MANAGER--&--MANAGE---STAFFS-----------------------------                                
    path("manager/profile/", ManagerProfileView.as_view(), name="manager_profile_view"),

    path("manager/staff/create/", AddListStaffUserView.as_view(), name="manager_create_staff"),
    path("manager/staff/<uuid:id>/update/", UpdateStaffUserView.as_view(), name="manager_update_staff"),
    path("manager/staff/<uuid:id>/delete/", ManagerDeleteStaffView.as_view(), name="manager_delete_staff"),
 



    #----------------------------STAFF PROFILES----------------------------------------
    path("staff/profile/", StaffProfileView.as_view(), name="staff_profile"),



    #============================================================================
    #                           2.1 CHANGE PASSWORD
    #============================================================================

    path("change/password/", UserChangePasswordView.as_view(), name="users_Change_password")
    
]