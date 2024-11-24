from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate
from .models import User
from utils.validators import validate_password, validate_name
from .tokens import create_jwt_pair
from django.utils.translation import gettext_lazy as _


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
        user = User.objects.create_user(password=password, **validated_data)
        return user


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
