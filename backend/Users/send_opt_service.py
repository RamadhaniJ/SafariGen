import secrets
from datetime import timedelta
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from Users.models import UserEmailOTP


class OTPThrottled(Exception):
    """Raised when user requests OTP too fast or too many times."""
    def __init__(self, message, retry_after=None):
        self.message = message
        self.retry_after = retry_after
        super().__init__(message)


COOLDOWN_SECONDS = 60
MAX_PER_HOUR = 5
OTP_TTL_MINUTES = 5


def send_email_otp_service(user):
    now = timezone.now()

    UserEmailOTP.objects.filter(user=user, is_used=False).update(is_used=True)

    # ---- Generate & save new OTP ----
    otp_code = f"{secrets.randbelow(900000) + 100000}"
    user_otp = UserEmailOTP.objects.create(
        user=user,
        otp_code=otp_code,
        expired_at=now + timedelta(minutes=OTP_TTL_MINUTES),
    )

    # ---- Send email ----
    context = {
        "email": user.email,
        "otp_code": otp_code,
        "year": now.year,
    }
    html_body = render_to_string("emails/otp_email.html", context)
    text_body = f"Your SafariGen OTP is {otp_code}. Expires in {OTP_TTL_MINUTES} minutes."

    email = EmailMultiAlternatives(
        subject="Your SafariGen Verification Code",
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.attach_alternative(html_body, "text/html")
    email.send(fail_silently=False)

    return user_otp








def verify_email_otp_service(user, code):
    otp = (
        UserEmailOTP.objects
        .filter(user=user, is_used=False)
        .order_by("-created_at")
        .first()
    )

    if not otp:
        raise OTPThrottled("No active OTP. Please request a new one.")

    if otp.is_expired:
        otp.is_used = True
        otp.save(update_fields=["is_used"])
        raise OTPThrottled("OTP has expired. Please request a new one.")

    if otp.attempts >= otp.MAX_ATTEMPTS:
        otp.is_used = True
        otp.save(update_fields=["is_used"])
        raise OTPThrottled("Too many failed attempts. Request a new OTP.")

    if not secrets.compare_digest(otp.otp_code, code):
        otp.attempts += 1
        otp.save(update_fields=["attempts"])
        remaining = otp.MAX_ATTEMPTS - otp.attempts
        raise OTPThrottled(f"Invalid code. {remaining} attempts remaining.")

    otp.is_used = True
    otp.save(update_fields=["is_used"])
    return otp  


