from django import forms
from . import models

class MakeWOSPuzz(forms.ModelForm):
    class Meta:
        model = models.WosPuzz2
        fields = ['title', 'line1', 'line2', 'line3', 'line4', 'hint']
