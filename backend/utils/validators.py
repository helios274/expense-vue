import re
from rest_framework.serializers import ValidationError


def validate_password(password: str):
    """
    Validates that the given password meets the following criteria:
    - Contains at least one uppercase letter
    - Contains at least one lowercase letter
    - Contains at least one digit
    - Contains at least one special character

    :param password: The password to be validated
    :raises ValidationError: If the password does not meet the criteria.
    """
    errors = []

    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter.")
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter.")
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one digit.")
    if not re.search(r'[\W_]', password):
        errors.append("Password must contain at least one special character.")

    if errors:
        raise ValidationError(errors)


def validate_name(value):
    """
    Validates that the given value contains only alphabets.

    :param value: The name to be validated
    :raises ValidationError: If the value contains non-alphabetic characters.
    """
    if not value.isalpha():
        raise ValidationError("This field can contain only alphabets.")
    return value
