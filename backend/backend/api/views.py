from django.contrib.auth.models import User, Group
import os
from django.conf import settings
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from backend.api.models import Diagnosis
from backend.api.serializers import UserSerializer, GroupSerializer, DiagnosisSerializer#, DiagnosisCreateSerializer
from backend.api.ml.nncf import NNCF
from backend.api.ml.svm import SVM

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class DiagnosisViewSet(viewsets.ModelViewSet):
    queryset = Diagnosis.objects.all()

    def get_serializer_class(self):
        return DiagnosisSerializer

class Diagnosis(APIView):

    def post(self, request, format=None):
        symptoms = request.data['symptoms'].strip().split(', ')
        svm = SVM(os.path.join(settings.BASE_DIR, "Training.csv"), os.path.join(settings.BASE_DIR, 'Testing.csv'))
        return Response(str(svm.get_prediction(symptoms)))
        print('Test accuarcy: ' + str(svm.get_test_score()))


class SimilarSymptoms(APIView):
    
    def post(self, request, format=None):
        input_symptoms = request.data['symptoms'].strip().split(', ')
        nncf = NNCF(os.path.join(settings.BASE_DIR, "Training.csv"), 10)
        prediction = nncf.get_nearest_symptoms(input_symptoms, 5, 0.00000001)
        return Response(prediction)