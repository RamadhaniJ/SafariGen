from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError, AuthenticationFailed




class CustomJwtCookiesAuth(JWTAuthentication):
    def authenticate(self, request):

        path = request.path

        if any(endpoint in path for endpoint in 
               ["users/login",
                "api/account/users/login",
                "users/logout",
                "account/users/logout",
                ]):
            return None

        header = self.get_header(request)

        if header is None:
            raw_token = request.COOKIES.get("access_code") or None 

        else:
            raw_token = self.get_raw_token(header)

        
        if raw_token is None: 
            return None
        

        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
           
            token_session_id = validated_token.get("session_id")
            if not token_session_id or not user.current_session_id:
                raise AuthenticationFailed("Invalid session data.")

            if str(token_session_id) != str(user.current_session_id):
                raise AuthenticationFailed("Your session has expired because you signed in on another device.")

            return (user, validated_token)
        except AuthenticationFailed:
            raise
        
        except (TokenError, InvalidToken):
              return None