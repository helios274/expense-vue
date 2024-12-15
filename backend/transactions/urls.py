from django.urls import path, include
from .views import AccountViewSet, CategoryViewSet, TagViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='categories')
router.register('accounts', AccountViewSet, basename='accounts')
router.register('tags', TagViewSet, basename='tags')

urlpatterns = [
    path('', include(router.urls))
]
