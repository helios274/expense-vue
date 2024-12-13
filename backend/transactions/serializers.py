from rest_framework import serializers
from rest_framework.validators import ValidationError
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Category model, which distinguishes between income and expense categories.

    This serializer:
    - Enforces unique category names under the same parent for each user or default category set.
    - Disallows updates to default categories.
    - Requires the 'type' field, ensuring categories are explicitly defined as 'expense' or 'income'.
    """
    subcategories = serializers.SerializerMethodField(read_only=True)
    type = serializers.ChoiceField(
        choices=[('expense', 'Expense'), ('income', 'Income')],
        required=True,  # The type field is now mandatory
        error_messages={
            'required': "Category type (either 'expense' or 'income') is required.",
            'blank': 'Category type cannot be blank.',
        }
    )

    class Meta:
        model = Category
        fields = ['id', 'name', 'parent_category',
                  'subcategories', 'is_default', 'type']
        read_only_fields = ['id', 'subcategories', 'is_default']

    def get_subcategories(self, obj):
        """
        Retrieve subcategories that the user can access. 
        Includes both user-created and default subcategories.
        """
        user = self.context['request'].user
        # Fetch subcategories that are either user-specific or default
        subcategories = obj.subcategories.filter(
            Q(user=user) | Q(is_default=True))
        return CategorySerializer(subcategories, many=True, context=self.context).data

    def validate(self, data):
        """
        Validate that:
        - The category name is unique under the same parent for this user or in default categories.
        - Prevent duplicate category names.
        """
        user = self.context['request'].user
        name = data.get('name', getattr(self.instance, 'name', None))
        parent_category = data.get('parent_category', getattr(
            self.instance, 'parent_category', None))
        category_id = self.instance.id if self.instance else None

        # Query for existing categories with the same name and parent
        categories = Category.objects.filter(
            name__iexact=name,
            parent_category=parent_category
        ).filter(Q(user=user) | Q(is_default=True))

        # Exclude the current category if we are updating
        if category_id:
            categories = categories.exclude(id=category_id)

        if categories.exists():
            raise ValidationError(
                _("A category with this name already exists under the same parent.")
            )

        return data

    def create(self, validated_data):
        """
        Create a new user-specific category.

        - Set `user` to the current user.
        - Ensure `is_default` is False since this is a user-created category.
        """
        user = self.context['request'].user
        validated_data['user'] = user
        validated_data['is_default'] = False
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Update a user-specific category.

        - Disallow updating default categories.
        - Prevent changes to `is_default`.
        """
        if instance.is_default:
            raise PermissionDenied(_("You cannot update default categories."))

        if 'is_default' in validated_data:
            raise ValidationError(
                _("You cannot change the 'is_default' status of a category."))

        return super().update(instance, validated_data)
