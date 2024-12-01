from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
from rest_framework.validators import UniqueValidator
from utils.validators import validate_password, validate_name, validate_verification_code
from utils.auth.tokens import create_jwt_pair
from utils.auth.verification import (
    generate_verification_code,
    hash_verification_code,
    get_verification_code_expiry,
)
from utils.email_senders import send_verification_email
from django.utils.translation import gettext_lazy as _
from django.utils import timezone


class CreateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message=_("Email is already in use")
        )],
        error_messages={
            'required': 'Email is required.',
            'blank': 'Email is required.',
        }
    )
    first_name = serializers.CharField(
        min_length=2,
        max_length=50,
        validators=[validate_name],
        error_messages={
            'required': 'First name is required.',
            'blank': 'First name is required.',
            'min_length': 'First name must be at least {min_length} characters long.',
            'max_length': 'First name must not exceed {max_length} characters.',
        }
    )
    last_name = serializers.CharField(
        max_length=50,
        validators=[validate_name],
        required=False,
        allow_null=True,
        allow_blank=True,
        error_messages={
            'max_length': 'Last name must not exceed {max_length} characters.',
        }
    )
    password = serializers.CharField(
        min_length=5,
        max_length=25,
        write_only=True,
        validators=[validate_password],
        error_messages={
            'required': 'Password is required.',
            'blank': 'Password is required.',
            'min_length': 'Password must be at least {min_length} characters long.',
            'max_length': 'Password must not exceed {max_length} characters.',
        }
    )
    confirm_password = serializers.CharField(
        write_only=True,
        error_messages={
            'required': 'Confirm Password is required.',
            'blank': 'Confirm Password is required.',
        }
    )

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name',
                  'password', 'confirm_password']

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError(
                {"password": _("Password and Confirm Password do not match.")}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.is_active = False

        # Generate and hash verification code
        plain_code = generate_verification_code()
        user.verification_code = hash_verification_code(plain_code)
        user.verification_code_expiry = get_verification_code_expiry(15)
        user.save()

        # Send verification email
        send_verification_email(user, plain_code)
        return user


class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    verification_code = serializers.CharField(
        max_length=6, validators=[validate_verification_code])

    def validate(self, attrs):
        email = attrs.get('email')
        code = attrs.get('verification_code')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('User not found.')

        if user.is_active:
            raise serializers.ValidationError('User is already verified.')

        if user.verification_code_expiry and timezone.now() > user.verification_code_expiry:
            raise serializers.ValidationError('Verification code has expired.')

        hashed_code = hash_verification_code(code)
        if hashed_code != user.verification_code:
            raise serializers.ValidationError('Invalid verification code.')

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        user.is_active = True
        user.verification_code = None
        user.verification_code_expiry = None
        user.save()
        return user


class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(
        error_messages={
            'required': 'Email is required.',
            'blank': 'Email cannot be blank.',
        }
    )

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            # Do not reveal whether the user exists
            pass
        else:
            if user.is_active:
                raise serializers.ValidationError(
                    "This account is already active.")
            self.user = user
        return value

    def save(self):
        if hasattr(self, 'user'):
            # Generate and hash new verification code
            plain_code = generate_verification_code()
            self.user.verification_code = hash_verification_code(plain_code)
            self.user.verification_code_expiry = get_verification_code_expiry(
                15)
            self.user.save()
            # Send verification email
            send_verification_email(self.user, plain_code)


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(
        error_messages={
            'required': 'Email is required.',
            'blank': 'Email cannot be blank.',
        }
    )
    password = serializers.CharField(
        write_only=True,
        error_messages={
            'required': 'Password is required.',
            'blank': 'Password cannot be blank.',
        }
    )

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # Authenticate the user
        user = authenticate(request=self.context.get(
            'request'), email=email, password=password)

        if user is None:
            raise serializers.ValidationError(
                detail=_("Invalid email or password."),
                code='authentication_failed'
            )

        if not user.is_active:
            # Generate and hash verification code
            plain_code = generate_verification_code()
            user.verification_code = hash_verification_code(plain_code)
            user.verification_code_expiry = get_verification_code_expiry(15)
            user.save()

            # Send verification email
            send_verification_email(user, plain_code)

            raise serializers.ValidationError(
                detail=_(
                    "Your account is not activated. Please verify your email."),
                code='account_inactive'
            )

        # Authentication successful
        attrs['user'] = user
        return attrs

    def create(self, validated_data):
        user = validated_data.get('user')
        tokens = create_jwt_pair(user)
        return {
            'tokens': tokens,
            'user': {
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'last_login': user.last_login,
                'date_joined': user.date_joined
            }
        }


class UserProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(validators=[validate_name])
    last_name = serializers.CharField(validators=[validate_name])

    class Meta:
        model = User
        fields = ['email', 'first_name',
                  'last_name', 'date_joined', 'last_login']
        read_only_fields = ['email', 'date_joined', 'last_login']
