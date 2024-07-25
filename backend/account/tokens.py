from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


def create_jwt_pair(user: User) -> dict[str, str]:
    refresh = RefreshToken.for_user(user)
    tokens = {
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    }
    return tokens
