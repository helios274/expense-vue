from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import generics, status, mixins
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import (
    CreateUserSerializer,
    VerifyEmailSerializer,
    ResendVerificationSerializer,
    UserProfileSerializer,
    UserLoginSerializer
)
from .permissions import IsOwner


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = [AllowAny]

    def create(self, request: Request) -> Response:
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response = {
                "success": True,
                "message": "Account has been created. Please check your inbox for email verification.",
            }
            return Response(data=response, status=status.HTTP_201_CREATED)


class VerifyEmailView(APIView):
    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response = {
                "success": True,
                "message": "Email verified successfully.",
            }
            return Response(response, status=status.HTTP_200_OK)


class ResendVerificationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResendVerificationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        # Always return the same response, regardless of whether the email exists or not
        return Response(
            {"message": "If an account with this email exists, a verification email has been sent."},
            status=status.HTTP_200_OK
        )


class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            data = serializer.save()
            return Response(data, status=status.HTTP_200_OK)


class UserProfileView(
    generics.GenericAPIView,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin
):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        queryset = User.objects.filter(id=self.request.user.id)
        return queryset

    def get(self, request: Request):
        user = self.request.user
        serializer = UserProfileSerializer(instance=user)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def patch(self, request: Request):
        user = self.request.user
        serializer = UserProfileSerializer(
            instance=user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(data=serializer.data, status=status.HTTP_200_OK)
