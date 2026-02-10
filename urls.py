from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdViewSet

router = DefaultRouter()
router.register("ads", AdViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
]
