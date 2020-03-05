from django.contrib.auth.models import User, Group
from rest_framework import serializers
from backend.api.models import Diagnosis
from backend.api.ml.nncf import NNCF
import os
from django.conf import settings
#model = train_model('backend/api/Training.csv')

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnosis
        fields = "__all__"

    def create(self, validated_data):
        print(validated_data, "test")

        symptoms = validated_data["input_keywords"].split(', ')

        nncf = NNCF(os.path.join(settings.BASE_DIR, "Training.csv"), 10)
        prediction = nncf.get_nearest_symptoms(symptoms, 5, 0.00000001)
        diagnosis = Diagnosis.objects.create(input_keywords=validated_data["input_keywords"], diagnosis=prediction)
        diagnosis.save()
        return diagnosis
        
        '''X = convert_words(words, 'backend/api/Training.csv')
        y = get_predictions(model, [X])
        diagnosis = Diagnosis.objects.create(input_keywords=validated_data["input_keywords"], diagnosis=y)
        diagnosis.save()
        return diagnosis'''
