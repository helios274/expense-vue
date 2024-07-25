from django.contrib import admin
from django.urls import path, include
from expense.views import ExpenseViewSet, CategoryViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='categories')
router.register('', ExpenseViewSet, basename='expenses')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('account.urls')),
    path('api/expenses/', include('expense.urls')),
    path('api/expenses/', include(router.urls))
]
