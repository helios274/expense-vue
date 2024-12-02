# urls.py
from django.urls import path
from .views import (
    UserRegistrationView,
    VerifyEmailView,
    ResendVerificationView,
    UserLoginView,
    CookieTokenRefreshView,
    UserProfileView
)
from rest_framework_simplejwt.views import TokenVerifyView

urlpatterns = [
    path('token/refresh', CookieTokenRefreshView.as_view(), name='refresh_token'),
    path('token/verify', TokenVerifyView.as_view(), name='verify_token'),
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('resend-verify-email/', ResendVerificationView.as_view(),
         name='resend-verify-email'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]
