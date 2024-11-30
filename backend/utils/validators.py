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
    Validates that the given value contains only alphabets and certain special characters(' - <space>).

    :param value: The name to be validated
    :raises ValidationError: If the value contains non-alphabetic characters.
    """
    if not re.match(r"^[A-Za-z]+(?:[-' ][A-Za-z]+)*$", value):
        raise ValidationError(
            "This field can contain only alphabets and certain special characters.")
    return value


def validate_verification_code(verification_code: str) -> None:
    """
    Validate that the verification code is a string of exactly 6 digits.

    This function checks whether the provided verification code is a string 
    containing only numeric characters and has a length of 6. If the code 
    does not meet these criteria, a `ValueError` is raised.

    Args:
        verification_code (str): The verification code to validate.

    Raises:
        ValueError: If the verification code is not a string.
        validationError: If the verification code is not six digits.

    Returns:
        None: The function does not return a value but raises an exception 
              if validation fails.
    """
    if not isinstance(verification_code, str):
        raise ValueError("Verification code must be a string.")

    if not re.fullmatch(r"\d{6}", verification_code):
        raise ValidationError("Invalid verification code.")
