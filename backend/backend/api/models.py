from django.db import models
import json

class Diagnosis(models.Model):

    def __str__(self):
        return self.diagnosis

    def set_input_keywords(self, input):
        self.input_keywords = json.dumps(input)
    
    def get_input_keywords(self):
        return json.loads(self.input_keywords)

    input_keywords = models.TextField()

    diagnosis = models.CharField(
        max_length=300,
        null=True,
    )
