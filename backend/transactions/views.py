from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from .serializers import CategorySerializer
from .models import Category, Transaction


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
