from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from .serializers import AccountSerializer, CategorySerializer
from .models import Account, Category, Transaction


class AccountViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing financial accounts. Users can create, read, update, and delete their accounts.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = AccountSerializer

    def get_queryset(self):
        """
        Returns a queryset of accounts accessible to the authenticated user.
        """
        user = self.request.user
        return Account.objects.filter(user=user)

    def get_object(self):
        """
        Retrieve the account object by its primary key, ensuring it belongs to the user's accessible accounts.
        Raises a 404 if not found.
        """
        pk = self.kwargs.get('pk')
        return get_object_or_404(self.get_queryset(), pk=pk)

    def perform_create(self, serializer):
        """
        Automatically associate the created account with the authenticated user.
        """
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        """
        Prevent deletion of accounts that have associated transactions.
        """
        if Transaction.objects.filter(account=instance).exists():
            raise ValidationError(
                _("Account cannot be deleted because it has associated transactions."))
        instance.delete()

    def create(self, request, *args, **kwargs):
        """
        Create a new account and return a success message upon creation.
        """
        response = super().create(request, *args, **kwargs)
        response.data = {
            "message": _("Account created successfully."),
            "data": {
                "account": response.data
            }
        }
        return response

    def list(self, request, *args, **kwargs):
        """
        Retrieve a list of all accounts accessible to the authenticated user.
        Returns a success message upon successful retrieval.
        """
        queryset = self.get_queryset()
        serializer = self.serializer_class(
            queryset, many=True
        )
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing categories. Categories can be either expense or income categories.
    - Default categories cannot be updated or deleted.
    - Categories with associated transactions cannot be deleted.
    - Users can create their own categories in addition to default categories provided by the system.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer

    def get_queryset(self):
        """
        Returns a queryset of categories accessible to the authenticated user.
        This includes both user-created categories and default categories.
        """
        user = self.request.user
        return Category.objects.filter(Q(user=user) | Q(is_default=True))

    def get_object(self):
        """
        Retrieve the category object by its primary key, ensuring it belongs to the user's accessible categories.
        Raises a 404 if not found.
        """
        pk = self.kwargs.get('pk')
        return get_object_or_404(self.get_queryset(), pk=pk)

    def perform_create(self, serializer):
        """
        Automatically associate the created category with the authenticated user.
        """
        serializer.save(user=self.request.user,
                        is_default=False)  # Ensure user-created categories are not default

    def perform_update(self, serializer):
        """
        Prevent updates to default categories.
        """
        instance = serializer.instance
        if instance.is_default:
            raise PermissionDenied(_("You cannot update default categories."))
        serializer.save()

    def perform_destroy(self, instance):
        """
        Prevent deletion of default categories and categories that have associated transactions.
        """
        if instance.is_default:
            raise PermissionDenied(_("You cannot delete default categories."))

        # Check if there are any transactions associated with this category
        if Transaction.objects.filter(category=instance).exists():
            raise ValidationError(
                _("Category cannot be deleted because it has associated transactions."))

        instance.delete()

    def create(self, request, *args, **kwargs):
        """
        Create a new category for the user.
        Returns a success message upon creation.
        """
        response = super().create(request, *args, **kwargs)
        response.data = {
            "success": True,
            "message": _("Category added successfully."),
            "data": {
                "category": response.data
            }
        }
        return response

    def list(self, request, *args, **kwargs):
        """
        Retrieve a list of all categories accessible to the authenticated user.
        Returns a success message upon successful retrieval.
        """
        queryset = self.get_queryset()
        serializer = self.serializer_class(
            queryset, many=True
        )
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        """
        Update an existing category.
        Returns a success message upon successful update.
        """
        response = super().update(request, *args, **kwargs)
        response.data = {
            "success": True,
            "message": _("Category updated successfully."),
            "data": {
                "category": response.data
            }
        }
        return response

    def destroy(self, request, *args, **kwargs):
        """
        Delete a category.
        Returns a success message upon successful deletion, or an error if the category cannot be deleted.
        """
        super().destroy(request, *args, **kwargs)
        return Response(
            data={
                "success": True,
                "message": _("Category deleted successfully.")
            },
            status=status.HTTP_200_OK
        )
