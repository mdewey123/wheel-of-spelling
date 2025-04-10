from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import *

@receiver(post_save, sender=User)
def first_puzz(sender, instance, created, **kwargs):
    if created:
        WosPuzz.objects.create(
            User = instance,
            title = 'First puzz',
            sentence = f'Welcome {instance.name} puzz is short for puzzle',
            hint = 'First puzz',
        )

@receiver(post_save, sender=User)
def first_puzz2(sender, instance, created, **kwargs):
    if created:
        WosPuzz2.objects.create(
            User = instance,
            title = 'First puzz',
            line1 = 'Welcome',
            line2 = f'{instance.name}',
            line3 = 'puzzle short',
            line4 = 'is puzz',
            hint = 'First puzz',
        ) 
 