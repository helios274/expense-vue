from django.urls import path, include
from .views import AccountViewSet, CategoryViewSet, TagViewSet, TransactionViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='categories')
router.register('accounts', AccountViewSet, basename='accounts')
router.register('tags', TagViewSet, basename='tags')
router.register('', TransactionViewSet, basename='transactions')

urlpatterns = [
    path('', include(router.urls))
]
