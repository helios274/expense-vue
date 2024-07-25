from django.urls import path
from .views import (
    ExpenseData,
    DailyExpenseSummary,
    MonthlyExpenseTrend,
    ExpenseByDateRange,
    CategoryWiseExpenseDistribution
)

urlpatterns = [
    path('data', ExpenseData.as_view()),
    path('data/daily', DailyExpenseSummary.as_view()),
    path('data/monthly', MonthlyExpenseTrend.as_view()),
    path('data/by-date', ExpenseByDateRange.as_view()),
    path('data/by-category', CategoryWiseExpenseDistribution.as_view()),
]
