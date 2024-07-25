import django_filters
from .models import Expense


class ExpenseFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(
        field_name="category__name", lookup_expr="iexact")
    min_amount = django_filters.NumberFilter(
        field_name="amount", lookup_expr="gte")
    max_amount = django_filters.NumberFilter(
        field_name="amount", lookup_expr="lte")
    start_date = django_filters.DateFilter(
        field_name="date", lookup_expr="gte")
    stop_date = django_filters.DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = Expense
        fields = ['date', 'category', 'amount']
