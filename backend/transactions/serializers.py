from rest_framework import serializers
from rest_framework.validators import ValidationError
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from .models import Account, Category, Tag, Transaction


class AccountSerializer(serializers.ModelSerializer):
    """
    Serializer for the Account model, which represents a user's financial account.
    This serializer:
    - Requires the 'account_type' field, ensuring accounts are explicitly defined as 'cash', 'upi', 'bank', 'credit', or 'debit'.
    - Requires the 'balance' field, ensuring the balance is non-negative.
    - Requires the 'user' field, ensuring the account belongs to the authenticated user.
    """
    account_type = serializers.ChoiceField(
        choices=[('cash', 'Cash'),
                 ('upi', 'UPI'),
                 ('bank', 'Bank Account'),
                 ('credit', 'Credit Card'),
                 ('debit', 'Debit Card'),],
        error_messages={
            'required': "Account type (either 'cash', 'upi', 'bank', 'credit', or 'debit') is required.",
            'blank': 'Account type cannot be blank.',
        }
    )

    class Meta:
        model = Account
        fields = ['id', 'name', 'account_type', 'balance']
        read_only_fields = ['id']

    def validate(self, data):
        user = self.context['request'].user
        name = data.get('name', getattr(self.instance, 'name', None))
        balance = data.get('balance', getattr(self.instance, 'balance', None))
        account_id = self.instance.id if self.instance else None

        # Query for existing accounts with the same name
        existing_accounts = Account.objects.filter(
            user=user, name__iexact=name)

        # Exclude the current account if we are updating
        if account_id:
            existing_accounts = existing_accounts.exclude(id=account_id)

        if existing_accounts.exists():
            raise ValidationError(
                _("An account with this name already exists.")
            )

        if balance < 0:
            raise ValidationError(_('Balance cannot be negative.'))

        return data


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


class TagSerializer(serializers.ModelSerializer):
    """
    Serializer for the Tag model, which represents a user-defined label for transactions.
    """
    class Meta:
        model = Tag
        fields = ['id', 'name']
        read_only_fields = ['id']

    def validate(self, data):
        """
        Validate that:
        - The tag name is unique for each user.
        """
        user = self.context['request'].user
        name = data.get('name', getattr(self.instance, 'name', None))
        tag_id = self.instance.id if self.instance else None

        # Query for existing tags with the same name
        existing_tags = Tag.objects.filter(
            user=user, name__iexact=name)

        # Exclude the current tag if we are updating
        if tag_id:
            existing_tags = existing_tags.exclude(id=tag_id)

        if existing_tags.exists():
            raise ValidationError(
                _("A tag with this name already exists.")
            )

        return data


class TransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Transaction model, which represents a user's financial transaction.
    This serializer:
    - Ensures that the user is set to the authenticated user on create.
    - Validates that the selected category matches the transaction type (income or expense).
    - Optionally, checks if the account is valid for the user.
    """
    type = serializers.ChoiceField(
        choices=[('expense', 'Expense'), ('income', 'Income')],
        error_messages={
            'required': "Transaction type (either 'expense' or 'income') is required.",
            'blank': 'Transaction type cannot be blank.',
        }
    )

    class Meta:
        model = Transaction
        fields = [
            'id', 'type', 'amount', 'date', 'category', 'description',
            'account', 'tags', 'merchant', 'receipt'
        ]
        read_only_fields = ['id']

    def validate(self, data):
        """
        Validate that:
        - The category is compatible with the transaction type (e.g., no expense category for income transaction).
        - Additional validations can be added as needed.
        """
        transaction_type = data.get(
            'type', getattr(self.instance, 'type', None))
        category = data.get('category', getattr(
            self.instance, 'category', None))
        account = data.get('account', getattr(self.instance, 'account', None))
        user = self.context['request'].user

        # Validate category compatibility
        if category:
            # Assuming category model has a `type` field that is 'income' or 'expense'
            if category.type != transaction_type:
                raise serializers.ValidationError(
                    _("The selected category is not valid for a {} transaction.".format(
                        transaction_type))
                )
            # Ensure the user can access this category (user-specific or default)
            if category.user is not None and category.user != user:
                raise serializers.ValidationError(
                    _("You do not have permission to use this category."))

        # Validate account belongs to the user (if account provided)
        if account and account.user != user:
            raise serializers.ValidationError(
                _("You do not have permission to use this account."))

        return data
