import re
from rest_framework.serializers import ValidationError


def validate_password(password: str):
    """
    Validate that the given value contains at least one uppercase letter,
    one lowercase letter, and one special character.

    :param value: The password to be validated
    :raises ValidationError: If the password does not contain at least one uppercase letter,
    one lowercase letter, and one special character.
    """
    if not re.search(r'[A-Z]', password):
        raise ValidationError(
            "Password must contain at least one uppercase letter.")
    if not re.search(r'[a-z]', password):
        raise ValidationError(
            "Password must contain at least one lowercase letter.")
    if not re.search(r'[\W_]', password):
        raise ValidationError(
            "Password must contain at least one special character.")


def validate_alpha(value: str):
    """
    Validate that the given value contains only alphabets (a-z, A-z).

    :param value: The value to be validated
    :raises ValidationError: If the value contains non-alphabet characters
    """
    if not re.match("^[A-Za-z]+$", value):
        raise ValidationError(
            "This field must contain only alphabets (A-Z, a-z).")
