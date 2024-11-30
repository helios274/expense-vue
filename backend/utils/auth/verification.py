import random
import hashlib
from datetime import timedelta, datetime
from django.utils import timezone


def generate_verification_code() -> str:
    """
    Generate a random 6-digit numeric verification code.

    Returns:
        str: A 6-digit verification code as a string.
    """
    return str(random.randint(100000, 999999))


def hash_verification_code(code: str) -> str:
    """
    Hash a verification code using SHA-256.

    This function takes a verification code as input, encodes it in UTF-8,
    and returns its SHA-256 hash.

    Args:
        code (str): The verification code to hash.

    Returns:
        str: A SHA-256 hash of the input verification code.
    """
    return hashlib.sha256(code.encode('utf-8')).hexdigest()


def get_verification_code_expiry(minutes: int) -> datetime:
    """
    Calculate the expiry timestamp for a verification code.

    This function takes the desired expiry time in minutes and returns a
    `datetime` object representing the expiration timestamp, calculated as
    the current time plus the specified duration.

    Args:
        minutes (int): The number of minutes until the code expires.

    Returns:
        datetime: A timezone-aware `datetime` object indicating the expiry time.
    """
    return timezone.now() + timedelta(minutes=minutes)
