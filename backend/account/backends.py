from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model


class CustomAuthenticationBackend(ModelBackend):
    """
    Custom authentication backend that allows authentication of inactive users.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        try:
            # Use case-insensitive matching for email
            case_insensitive_email_field = '{}__iexact'.format(
                UserModel.USERNAME_FIELD)
            user = UserModel._default_manager.get(
                **{case_insensitive_email_field: username})
        except UserModel.DoesNotExist:
            return None
        else:
            if user.check_password(password):
                return user
        return None
