from django import forms
from . import models
from django.core.validators import MaxLengthValidator

class MakeWOSPuzz(forms.ModelForm):
    class Meta:
        model = models.WosPuzz2
        fields = ['title', 'line1', 'line2', 'line3', 'line4', 'hint']
        help_texts = {
            'line1': "Max 12 characters.",
            'line2': "Max 12 characters.",
            'line3': "Max 12 characters.",
            'line4': "Max 12 characters.",
        }
    line1 = forms.CharField(max_length=12, validators=[MaxLengthValidator(12)])
    line2 = forms.CharField(max_length=12, validators=[MaxLengthValidator(12)])
    line3 = forms.CharField(max_length=12, validators=[MaxLengthValidator(12)])
    line4 = forms.CharField(max_length=12, validators=[MaxLengthValidator(12)])