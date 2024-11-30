# urls.py
from django.urls import path
from .views import (
    UserRegistrationView, VerifyEmailView, ResendVerificationView, UserLoginView, UserProfileView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

urlpatterns = [
    path('jwt/create', TokenObtainPairView.as_view(), name='create_token'),
    path('jwt/refresh', TokenRefreshView.as_view(), name='refresh_token'),
    path('jwt/verify', TokenVerifyView.as_view(), name='verify_token'),
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('resend-verify-email/', ResendVerificationView.as_view(),
         name='resend-verify-email'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]
