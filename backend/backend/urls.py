from django.urls import include, path
from rest_framework import routers
from backend.api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
#router.register(r'diagnoses', views.DiagnosisViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path(r'similar-symptoms', views.SimilarSymptoms.as_view(), name="similar-symptoms"),
    path(r'diagnoses', views.Diagnosis.as_view(), name="diagnosis"),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]