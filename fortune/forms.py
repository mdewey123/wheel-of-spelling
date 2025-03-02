from django import forms
from . import models

class MakeWOSPuzz(forms.ModelForm):
    class Meta:
        model = models.WosPuzz
        fields = ['title', 'sentence', 'hint']
