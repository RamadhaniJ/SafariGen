from Users.views import (
    AddListStaffUserView, ManagerProfileView, LoginView, RegistrationView, CustomTokenRefreshView,
    ShortInfoView, LogoutView,
    ManagerDeleteStaffView,

    StaffProfileView
)
from django.urls import path


urlpatterns = [
    path("token/refresh", CustomTokenRefreshView.as_view(), name="custom_token_refresh"),

    #                     AUTHENTICATIONS ---------------------------------------
    path("users/login", LoginView.as_view(), name="login_view"),
    path("users/register", RegistrationView.as_view(), name="user_register_view"),

    path("users/logout", LogoutView.as_view(), name="user_logout_view"),


    path("users/isauthenticated", ShortInfoView.as_view(), name="check_user_is_authenticated"),


    #  --------------------------- MANAGER------------------------------------                                
    path("manager/profile/", ManagerProfileView.as_view(), name="manager_profile_view"),
    path("create/staff/", AddListStaffUserView.as_view(), name="manager_create_staff"),
    path("delete/staff/<uuid:id>/", ManagerDeleteStaffView.as_view(), name="manager_delete_staff"),
 

    #----------------------------STAFF ----------------------------------------
    path("staff/profile/", StaffProfileView.as_view(), name="staff_profile"),
    
]