from Users.models import CustomUserModel, ManagerProfile, StaffProfile
from rest_framework import serializers


class RegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only = True, required=True)
    password2 = serializers.CharField(write_only = True, required=True)
    class Meta:
        model = CustomUserModel
        fields = (
            "company_name", "email", "phone_number",
            "password1", "password2"
        )


    def validate(self, attrs):
        if (len(attrs.get("company_name").strip()) < 2):
            raise serializers.ValidationError("Enter a valid company name")
        elif CustomUserModel.objects.filter(company_name__iexact = attrs.get("company_name")).exists():
               raise serializers.ValidationError("This company already registered")


        if not (attrs.get("email")):
                raise serializers.ValidationError("Email is required")
        elif CustomUserModel.objects.filter(email = attrs.get("email")).exists():
                raise serializers.ValidationError("This email already registered")


        if (attrs.get("phone_number")) and len(attrs.get("phone_number")) > 15 :
                    raise serializers.ValidationError("Enter a valid phone number")

        
        if len(attrs.get("password1")) < 8:
               raise serializers.ValidationError("Enter a strong password")

        if (attrs.get("password1")) != (attrs.get("password2")) :
                       raise serializers.ValidationError("Password doesn't match!")
        
        return super().validate(attrs)



    def create(self, validated_data):
            password2 = validated_data.pop("password2")

            user = CustomUserModel.objects.create(
                   email = validated_data["email"],
                   company_name = validated_data["company_name"],
                   phone_number = validated_data["phone_number"],
                   role = CustomUserModel.UserRoles.MANAGER,
                   is_active= True
            )
            user.set_password(validated_data["password1"])
            user.save()
            return user





class ManagerProfileSerialzier(serializers.ModelSerializer):
       is_verified = serializers.BooleanField(source = "user.is_verified", read_only = True)

       joined_at = serializers.DateTimeField(source = "user.joined_at", read_only = True)
       phone_number = serializers.CharField(source = "user.phone_number", read_only = True)

       email = serializers.CharField(source = "user.email", read_only = True)
       company_name = serializers.CharField(source = "user.company_name", read_only = True)


       class Meta:
              model = ManagerProfile
              fields = (
                     "full_name", "avatar",
                     "about_me", "updated_at",

                     "is_verified", "joined_at","phone_number","email","company_name"
              )


       def validate(self, attrs):
               avatar = attrs.get("avatar") or None
               if avatar and avatar.size > 5 * 1024 * 1024:
                      raise serializers.ValidationError("Max allowed image size is 5MB")
               return super().validate(attrs)

       def update(self, instance, validated_data):
              user = self.context.get("request").user
              if user != instance.user:
                     raise serializers.ValidationError("You are not allowed to Edit this Profile")
              return super().update(instance, validated_data)
       










class AddStaffSerializer(serializers.ModelSerializer):
       password = serializers.CharField(write_only = True, required = True)

       class Meta:
              model =CustomUserModel
              fields = (
                     "password", "email", 
                     "joined_at", "phone_number","id"
              )
              read_only_fields = ("joined_at","phone_number","id")



       def validate(self, attrs):
              manager = self.context["request"].user

              if (attrs.get("email") is None):
                     raise serializers.ValidationError("Email is required!")

              if CustomUserModel.objects.filter(created_by = manager).count() >= 3:
                     raise serializers.ValidationError(
                            "You can only create a maximum of 3 staff members."
                     )

              if not manager.is_verified:
                     raise serializers.ValidationError(
                            "You must be verified to add staff Members "
                     )
              return attrs



       def create(self, validated_data):
              manager = self.context.get("request").user
              raw_password = validated_data.pop("password")

              staff_user = CustomUserModel.objects.create(
                     role = CustomUserModel.UserRoles.STAFF,

                     company_name = manager.company_name,
                     email = validated_data["email"],

                     created_by = manager,
                     is_active = True,

              )

              staff_user.set_password(raw_password)
              staff_user.save()

              return staff_user

       
    





class ShortInfoSerialziser(serializers.ModelSerializer):
       class Meta:
              model = CustomUserModel
              fields = ("email","role","is_verified")
              read_only_fields = (
                     "email","role","is_verified"
              )

    



  
class StaffProfileSerializer(serializers.ModelSerializer):
       email = serializers.EmailField(source= "user.email", read_only = True, required=False)
       joined_at = serializers.EmailField(source= "user.joined_at", read_only = True, required=False)
       class Meta:
              model = StaffProfile
              fields = (
                     "full_name", "avatar",
                     "about_me","updated_at",

                     "email","joined_at"
              )
              read_only_fields = ("updated_at","email","joined_at")


       def validate(self, attrs):
              MAX_AVATAR_SIZE = 3 * 1024 * 1024
              avatar = attrs.get("avatar")
              
              if avatar and avatar.size > MAX_AVATAR_SIZE:
                     raise serializers.ValidationError("Max allowed image size is 3 MB")
              return super().validate(attrs)

       def update(self, instance, validated_data):
              user = self.context.get("request").user
              if instance.user != user:
                     raise serializers.ValidationError("You don't have permission to edit this profile")
              return super().update(instance, validated_data)