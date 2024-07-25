from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate
from .models import User
from utils.validators import validate_password, validate_alpha
from .tokens import create_jwt_pair


class CreateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message="Email is already in use"
        )]
    )
    password = serializers.CharField(
        min_length=5,
        max_length=25,
        write_only=True,
        validators=[validate_password]
    )

    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
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
            raise serializers.ValidationError('Invalid credentials')

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
    first_name = serializers.CharField(validators=[validate_alpha])
    last_name = serializers.CharField(validators=[validate_alpha])

    class Meta:
        model = User
        fields = ['email', 'first_name',
                  'last_name', 'date_joined', 'last_login']
        read_only_fields = ['email', 'date_joined', 'last_login']
