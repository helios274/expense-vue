from rest_framework import serializers
from rest_framework.validators import ValidationError
from rest_framework.exceptions import PermissionDenied
from .models import Category, Expense
from django.db.models import Q
from django.utils.translation import gettext_lazy as _


class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'parent_category',
                  'subcategories', 'is_default']
        read_only_fields = ['id', 'subcategories', 'is_default']

    def get_subcategories(self, obj):
        # Retrieve subcategories accessible to the user
        user = self.context['request'].user
        subcategories = obj.subcategories.filter(
            Q(user=user) | Q(is_default=True))
        return CategorySerializer(subcategories, many=True, context=self.context).data

    def validate(self, data):
        user = self.context['request'].user
        name = data.get('name')
        parent_category = data.get('parent_category')
        # Exclude the current instance if updating
        category_id = self.instance.id if self.instance else None

        # Check for existing category with the same name and parent
        categories = Category.objects.filter(
            name__iexact=name,
            parent_category=parent_category
        ).filter(Q(user=user) | Q(is_default=True))

        # Exclude the Current Category (if updating)
        if category_id:
            categories = categories.exclude(id=category_id)

        if categories.exists():
            raise serializers.ValidationError(
                _("Category with this name already exists under the same parent."))

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        # Ensure user-created categories are not default
        validated_data['is_default'] = False
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if instance.is_default:
            raise PermissionDenied(
                _("You cannot update default categories."))
        return super().update(instance, validated_data)
