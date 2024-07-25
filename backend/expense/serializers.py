from rest_framework import serializers
from rest_framework.validators import ValidationError
from .models import Category, Expense


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['id', 'user']

    def create(self, validated_data):
        user = self.context['request'].user
        category_name = validated_data['name']
        if Category.objects.filter(name__iexact=category_name, user=user).exists():
            raise ValidationError("Category already exists")
        return Category.objects.create(name=category_name, user=user)


class ExpenseSerializer(serializers.ModelSerializer):
    category = serializers.CharField()

    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['id', 'user']

    def validate(self, attrs):
        request = self.context.get('request')
        if 'category' in attrs:
            try:
                category = Category.objects.get(
                    name=attrs['category'], user=request.user)
                attrs['category'] = category
            except Category.DoesNotExist:
                raise ValidationError("Category doesn't exist")
        return super().validate(attrs)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return Expense.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.category = validated_data.get('category', instance.category)
        instance.amount = validated_data.get('amount', instance.amount)
        instance.description = validated_data.get(
            'description', instance.description)
        instance.date = validated_data.get('date', instance.date)
        instance.save()
        return instance
