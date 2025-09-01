from django.contrib import admin

# Register your models here.

from .models import *
admin.site.register(User)
admin.site.register(WosPuzz)
admin.site.register(WosPuzz2)
admin.site.register(SchoolClass)
admin.site.register(Student)