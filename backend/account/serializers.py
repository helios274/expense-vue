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
        )]
    )
    first_name = serializers.CharField(
        max_length=30,
        validators=[validate_name]
    )
    last_name = serializers.CharField(
        max_length=30,
        validators=[validate_name]
    )
    password = serializers.CharField(
        min_length=5,
        max_length=25,
        write_only=True,
        validators=[validate_password]
    )
    confirm_password = serializers.CharField(
        write_only=True
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

# serializers.py


class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()

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
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        user = authenticate(request=self.context.get(
            'request'), username=email, password=password)

        if not user:
            raise serializers.ValidationError(_('Invalid credentials'))

        data['user'] = user
        return data

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
