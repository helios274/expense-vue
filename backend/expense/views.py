from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth, TruncDay
from django.utils.dateparse import parse_date
from datetime import datetime, timedelta
from decimal import Decimal
from .permissions import IsOwner
from .serializers import CategorySerializer, ExpenseSerializer
from .models import Category, Expense
from .filters import ExpenseFilter
from .pagination import CustomPagination


class CategoryViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsOwner]
    serializer_class = CategorySerializer

    def create(self, request):
        serializer = self.serializer_class(
            data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response = {
                "success": True,
                "message": "Category added successfully",
                "data": {
                    "category": serializer.data
                }
            }
            return Response(data=response, status=status.HTTP_201_CREATED)

    def list(self, request):
        queryset = Category.objects.filter(user=request.user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        queryset = get_object_or_404(Category, pk=pk, user=request.user)
        serializer = self.serializer_class(queryset)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        queryset = get_object_or_404(Category, pk=pk, user=request.user)
        serializer = self.serializer_class(
            queryset, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            response = {
                "success": True,
                "message": "Category updated successfully",
                "data": {
                    "category": serializer.data
                }
            }
            return Response(data=response, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        category = get_object_or_404(Category, pk=pk, user=request.user)
        if Expense.objects.filter(category=category).exists():
            response = {
                "message": "Category cannot be deleted because it has associated expenses."
            }
            return Response(data=response, status=status.HTTP_403_FORBIDDEN)
        category.delete()
        response = {
            "success": True,
            "message": "Category deleted successfully."
        }
        return Response(data=response, status=status.HTTP_200_OK)


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    pagination_class = CustomPagination
    filter_backends = [
        DjangoFilterBackend, SearchFilter, OrderingFilter
    ]
    filterset_class = ExpenseFilter
    search_fields = ['category__name', 'amount', 'description']
    ordering_fields = ['amount', 'date']

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        expense = self.get_object()
        expense.delete()
        response = {
            "success": True,
            "message": "Expense deleted successfully"
        }
        return Response(data=response, status=status.HTTP_200_OK)


class ExpenseData(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request):
        user = request.user
        today = datetime.now()
        start_of_month = today.replace(
            day=1, hour=0, minute=0, second=0, microsecond=0)

        # Filter expenses once
        expenses = Expense.objects.filter(user=user)

        # Calculate total expenses and amount
        total_expenses = expenses.count()
        total_amount = expenses.aggregate(total=Sum('amount'))[
            'total'] or Decimal('0.0')

        # Filter expenses for the current month
        expenses_month = expenses.filter(date__gte=start_of_month)
        total_expenses_month = expenses_month.count()
        total_amount_month = expenses_month.aggregate(
            total=Sum('amount'))['total'] or Decimal('0.0')

        # Calculate total expenses and amount by category for this month
        category_data = expenses_month.values('category__name').annotate(
            total_expenses=Sum('id'), total_amount=Sum('amount')
        ).order_by('category__name')

        # Transform category data
        category_data = [
            {
                'category_name': category['category__name'],
                'total_expenses': category['total_expenses'],
                'total_amount': category['total_amount'] or Decimal('0.0')
            }
            for category in category_data if category['total_amount'] is not None
        ]

        # Build the response data
        response_data = {
            'total_expenses': total_expenses,
            'total_amount': total_amount,
            # 'total_expenses_month': total_expenses_month,
            # 'total_amount_month': total_amount_month,
            # 'total_expenses_by_category': category_data,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class DailyExpenseSummary(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request):
        user = request.user
        date_param = request.query_params.get('date')

        if date_param:
            try:
                date_value = parse_date(date_param)
                if date_value:
                    start_of_month = date_value.replace(day=1)
                    end_of_month = (
                        start_of_month + timedelta(days=32)
                    ).replace(day=1) - timedelta(seconds=1)
                else:
                    start_of_month = datetime.strptime(
                        date_param, '%Y-%m').replace(day=1)
                    end_of_month = (
                        start_of_month + timedelta(days=32)
                    ).replace(day=1) - timedelta(seconds=1)

            except ValueError:
                raise ValidationError(
                    "Invalid date format. Use YYYY-MM or YYYY-MM-DD")
        else:
            today = datetime.now()
            start_of_month = today.replace(
                day=1, hour=0, minute=0, second=0, microsecond=0)
            end_of_month = (
                start_of_month + timedelta(days=32)
            ).replace(day=1) - timedelta(seconds=1)

        expenses = Expense.objects.filter(
            user=user, date__gte=start_of_month, date__lte=end_of_month)
        daily_data = expenses.annotate(day=TruncDay('date')).values('day').annotate(
            total_expenses=Count('id'), total_amount=Sum('amount')).order_by('day')

        return Response(daily_data, status=status.HTTP_200_OK)


class MonthlyExpenseTrend(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request):
        user = request.user
        year_param = request.query_params.get('year')

        if year_param:
            try:
                year_value = int(year_param)
                start_of_year = datetime(year_value, 1, 1)
                end_of_year = datetime(year_value, 12, 31, 23, 59, 59)
            except ValueError:
                return Response({'error': 'Invalid year format. Use YYYY'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            today = datetime.now()
            start_of_year = today.replace(
                month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
            end_of_year = today.replace(
                month=12, day=31, hour=23, minute=59, second=59, microsecond=999999)

        expenses = Expense.objects.filter(
            user=user, date__gte=start_of_year, date__lte=end_of_year)
        monthly_data = expenses.annotate(month=TruncMonth('date')).values('month').annotate(
            total_expenses=Count('id'), total_amount=Sum('amount')).order_by('month')

        return Response(monthly_data, status=status.HTTP_200_OK)


class ExpenseByDateRange(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request):
        user = request.user
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        if not start_date or not end_date:
            return Response({'error': 'Please provide start_date and end_date'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            end_date = datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)

        expenses = Expense.objects.filter(
            user=user, date__gte=start_date, date__lte=end_date)
        expense_data = expenses.values('date').annotate(
            total_expenses=Count('id'), total_amount=Sum('amount')).order_by('date')

        return Response(expense_data, status=status.HTTP_200_OK)


class CategoryWiseExpenseDistribution(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request):
        user = request.user
        expenses = Expense.objects.filter(user=user)
        category_data = expenses.values('category__name').annotate(
            total_expenses=Count('id'), total_amount=Sum('amount')).order_by('category__name')

        return Response(category_data, status=status.HTTP_200_OK)
