from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncMonth, TruncDay
from django.utils.translation import gettext_lazy as _
from django.utils.dateparse import parse_date
from datetime import datetime, timedelta
from decimal import Decimal
from .permissions import IsOwner
from .serializers import CategorySerializer
from .models import Category, Expense
from .filters import ExpenseFilter
from .pagination import CustomPagination


class CategoryViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer

    def get_queryset(self):
        user = self.request.user
        return Category.objects.filter(Q(user=user) | Q(is_default=True))

    def get_object(self, pk):
        queryset = self.get_queryset()
        return get_object_or_404(queryset, pk=pk)

    def create(self, request):
        serializer = self.serializer_class(
            data=request.data, context={'request': request}
        )
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response = {
                "success": True,
                "message": _("Category added successfully."),
                "data": {
                    "category": serializer.data
                }
            }
            return Response(data=response, status=status.HTTP_201_CREATED)

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(
            queryset, many=True, context={'request': request}
        )
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        category = self.get_object(pk)
        serializer = self.serializer_class(
            category, context={'request': request}
        )
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        category = self.get_object(pk)

        if category.is_default:
            raise PermissionDenied(_("You cannot update default categories."))

        serializer = self.serializer_class(
            category, data=request.data, partial=True, context={'request': request}
        )
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response = {
                "success": True,
                "message": _("Category updated successfully."),
                "data": {
                    "category": serializer.data
                }
            }
            return Response(data=response, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        category = self.get_object(pk)

        if category.is_default:
            return Response(
                {"error": _("You cannot delete default categories.")},
                status=status.HTTP_403_FORBIDDEN
            )
        if Expense.objects.filter(category=category).exists():
            response = {
                "message": _("Category cannot be deleted because it has associated expenses.")
            }
            return Response(data=response, status=status.HTTP_403_FORBIDDEN)
        category.delete()
        response = {
            "success": True,
            "message": _("Category deleted successfully.")
        }
        return Response(data=response, status=status.HTTP_200_OK)
