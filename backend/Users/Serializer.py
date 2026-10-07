from Users.models import CustomUserModel, ManagerProfile, StaffProfile, Company
from rest_framework import serializers
from Users.send_opt_service import send_email_otp_service
from django.contrib.auth.password_validation import validate_password


class RegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only = True, required=True)
    password2 = serializers.CharField(write_only = True, required=True)
    class Meta:
        model = CustomUserModel
        fields = (
            "full_name", "email",
            "password1", "password2"
        )


    def validate(self, attrs):
        if not (attrs.get("email")):
                raise serializers.ValidationError("Email is required")
        elif CustomUserModel.objects.filter(email__iexact = attrs.get("email")).exists():
                raise serializers.ValidationError("This email already registered")


        
        if len(attrs.get("password1")) < 8:
               raise serializers.ValidationError("Enter a strong password")

        if (attrs.get("password1")) != (attrs.get("password2")) :
                       raise serializers.ValidationError("Password doesn't match!")
        
        return super().validate(attrs)



    def create(self, validated_data):
            password2 = validated_data.pop("password2")

            user = CustomUserModel.objects.create(
                   email = validated_data["email"],
                   full_name = validated_data["full_name"],
                   role = CustomUserModel.UserRoles.MANAGER,
                   is_active= False
            )
            user.set_password(validated_data["password1"])
            user.save()
            send_email_otp_service(user=user)

            return user

 













#+=====================================COMPANIES ==============================

class CompanyOnboardingSerializer(serializers.ModelSerializer):
       class Meta:
              model  = Company  
              fields = (
                     "id","name","email","phone_number",
                     "logo","website","country","about",

                     "certificate_of_incorporation","tax_id_certificate","tax_id_number",

 
                     "status","created_at"
              )

              read_only_fields = ("created_at","status", "id")


       def validate_file_size_and_type(self, file, max_size_mb=5, allowed_extensions=None):
        if not file:
            return file
            

        max_size_bytes = max_size_mb * 1024 * 1024
        if file.size > max_size_bytes:
            raise serializers.ValidationError(f"File size must not exceed {max_size_mb}MB.")
             

        if allowed_extensions:
            ext = file.name.split('.')[-1].lower()
            if ext not in allowed_extensions:
                raise serializers.ValidationError(f"Only {', '.join(allowed_extensions)} files are allowed.")
                
        return file


       def validate(self, attrs):
              BLOCKED_EMAIL_DOMAINS = [
                    "gmail.com","yahoo.com", "outlook.com", "hotmail.com",
                      "icloud.com", "aol.com", "protonmail.com", "mail.com",  
              ]
              file_rules = {
                     "logo": (5, ['jpg', 'jpeg', 'png', 'webp']),
                     "certificate_of_incorporation": (5, ['pdf', 'jpg', 'png']),
                     "tax_id_certificate": (5, ['pdf', 'jpg', 'png']),
              }
              for field, (size, exts) in file_rules.items():
                     if field in attrs and attrs[field]:
                         attrs[field] = self.validate_file_size_and_type(attrs[field], max_size_mb=size, allowed_extensions=exts)

              for field, label in [("website", "Company website"), ("country", "Operating country"), ("tax_id_number", "Tax ID number")]:
                     if not attrs.get(field) and not (self.instance and getattr(self.instance, field, None)):
                          raise serializers.ValidationError({field: f"{label} is required."})


              email = attrs.get("email")
              phone_number = attrs.get("phone_number")


              if not email or not email.strip():
                    raise serializers.ValidationError("valid Company email is required")

              email = email.strip().lower()
              if "@" not in email:
                    raise serializers.ValidationError("Enter a  valid email address")
              
              domain = email.split("@")[1]
              if domain in BLOCKED_EMAIL_DOMAINS:
                    raise serializers.ValidationError("Email rejected. User Official company email address")

              if Company.objects.filter(email__iexact = email).exists():
                    raise serializers.ValidationError("This email already registered")

              if not phone_number or len(phone_number) > 15:
                    raise serializers.ValidationError("Enter a valid company phone number")


              manager = self.context.get("request").user
              if Company.objects.filter(
                    owner = manager
              ).count() >= 3:
                    raise serializers.ValidationError("You can only add max 3 Company")



              
              return super().validate(attrs)



       def create(self, validated_data):
              user = self.context.get("request").user
              if not user.is_active:
                     raise serializers.ValidationError("Your account not activated.")

              manager=getattr(user, "manager_profile", None )
              if manager is None:
                    raise serializers.ValidationError("Only company owner can create company!.")

              company = Company.objects.create(
                      owner = user,
                      status="PENDING",
                     **validated_data
              )

              user.companies.add(company)
              return company


       def update(self, instance, validated_data):
              user = self.context.get("request").user
              
              manager=getattr(user, "manager_profile", None )
              if manager is None:
                    raise serializers.ValidationError("Only company owner can create company!.")

              if  instance.owner != user:
                     raise serializers.ValidationError("You do not allowed to edit this company")


              if instance.status == "VERIFIED":
                     protected_fields = ["certificate_of_incorporation", "tax_id_certificate", "tax_id_number", "name"]
                     for field in protected_fields:
                          if field in validated_data:
                              validated_data.pop(field)


              return super().update(instance, validated_data)



class CompaniesDataTocreateStaffSerializer(serializers.ModelSerializer):
      class Meta:
            model = Company
            fields = (
                  "id","name","logo","website",
            )
            read_only_fields = ("id","name","logo","website")

#+=====================================COMPANIES ==============================










class ManagerProfileSerialzier(serializers.ModelSerializer):
       full_name = serializers.CharField(source = "user.full_name", read_only = True)
       joined_at = serializers.DateTimeField(source = "user.joined_at", read_only = True)
       email = serializers.EmailField(source = "user.email", read_only = True)



       class Meta:
              model = ManagerProfile
              fields = (
                     "phone_number", "avatar",
                     "about_me", 
                     
                     "updated_at", "joined_at","email","full_name"
              )
              read_only_fields = (
                    "updated_at","joined_at","email"
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
       companies = serializers.PrimaryKeyRelatedField(
             queryset = Company.objects.all(),
             many = True,
             write_only= True
       )
       created_by =serializers.SerializerMethodField()

       company_data = CompaniesDataTocreateStaffSerializer(many=True, read_only=True, source="companies")

       class Meta:
              model =CustomUserModel
              fields = (
                     "password", "companies","full_name","email", 
                      
                       "created_by","joined_at","id",
                       "company_data"
              )
              read_only_fields = ("joined_at","created_by","id")



       def get_created_by(self, obj):
             return obj.created_by.full_name if obj.created_by else None
 


       def validate(self, attrs):
              manager = self.context["request"].user
              companies = attrs.get("companies")

              if (attrs.get("email") is None):
                     raise serializers.ValidationError("Email is required!")


              if (attrs.get("full_name") is None):
                     raise serializers.ValidationError("Full name is required!")


              if self.instance is None:
                     if (attrs.get("password") is None or len(attrs.get("password")) < 8):
                            raise serializers.ValidationError("Enter strong password! (min 8 chars).")


              email = CustomUserModel.objects.filter(email__iexact = attrs.get("email"))
              if self.instance:
                    email = email.exclude(id = self.instance.id)
              if email.exists():
                    raise serializers.ValidationError("Email already in use. ")


               # KWENYE KILA COMAPANY MAX STAFF NI 2? TU
              if self.instance is None: 
                     if CustomUserModel.objects.filter(
                     created_by = manager, 
                     role = CustomUserModel.UserRoles.STAFF
                     ).count() >= 2:
                            raise serializers.ValidationError(
                                   "You can only create a maximum of 2 staff members."
                            )

              if not companies:
                    raise serializers.ValidationError("You must have and assign staff to a speific company")


              for company in companies:
                  if company.status  != "VERIFIED":
                           raise serializers.ValidationError(
            f"Company '{company.name}' is not verified. You can only assign staff to verified companies."

        )

                  if company.owner != manager:
                        raise serializers.ValidationError(
                              f"You don't own '{company.name}'."
                        )

              return attrs



       def create(self, validated_data):
              manager = self.context.get("request").user
              raw_password = validated_data.pop("password")
              companies = validated_data.pop("companies")

              staff_user = CustomUserModel.objects.create(
                     role = CustomUserModel.UserRoles.STAFF,
                     full_name = validated_data["full_name"],
                     email = validated_data["email"],

                     created_by = manager,
                     is_active = True,

              )

              staff_user.set_password(raw_password)
              staff_user.companies.set(companies)
              staff_user.save()

              return staff_user

       
       def update(self, instance, validated_data):
             manager = self.context.get("request").user
             raw_password = validated_data.pop("password", None)
             companies = validated_data.pop("companies", None)

             if instance.created_by != manager:
                   raise serializers.ValidationError("Action denied, You can only edit your staff.")

             if raw_password:
                   instance.set_password(raw_password)

             for attr, value in validated_data.items():
                   setattr(instance, attr, value)
             instance.save()

             if companies is not None:
                   instance.companies.set(companies)
             return instance

       
    



 

class ShortInfoSerialziser(serializers.ModelSerializer):
       class Meta:
              model = CustomUserModel
              fields = ("email","role","full_name")
              read_only_fields = ( 
                     "email","role","full_name"
              )

    



  
class StaffProfileSerializer(serializers.ModelSerializer):
       full_name = serializers.CharField(source = "user.full_name", read_only = True)
       joined_at = serializers.DateTimeField(source = "user.joined_at", read_only = True)
       email = serializers.EmailField(source = "user.email", read_only = True)



      
       class Meta:
              model = StaffProfile
              fields = (
                     "phone_number", "avatar",
                     "about_me", 
                     
                     "updated_at", "joined_at","email","full_name"
              )
              read_only_fields = ("updated_at","joined_at","email")


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
       














#===================================================================================
#                               2.1   CHANGE PASSWORD
#===================================================================================
class ChangePasswordSerializer(serializers.Serializer):
      current_password = serializers.CharField(write_only = True, required = True)
      new_password = serializers.CharField(write_only = True, required = True, validators=[validate_password]
                                           )
      confirm_new_password = serializers.CharField(write_only=True, required=True)


      def validate_current_password(self, value):
            user = self.context.get("request").user
            if not user.check_password(value):
                  raise serializers.ValidationError("Current password is incorrect.")
            return value

      def validate(self, attrs):
            if attrs.get("new_password") != attrs.get("confirm_new_password"):
                  raise serializers.ValidationError("Passwords do not match")

            if attrs.get("current_password") == attrs.get("new_password"):
                  raise serializers.ValidationError("New password must be different from the current one")
            return attrs

      def save(self, **kwargs):
            user = self.context.get("request").user
            user.set_password(self.validated_data["new_password"])
            user.save(update_fields=["password"])
            return user



 