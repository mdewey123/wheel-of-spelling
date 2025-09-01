from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE
from django.utils.text import slugify

# Create your models here.

class User(AbstractUser):
  name = models.CharField(max_length=12)
  def __str__(self):
    return f"{self.username} ({self.email})"
  
class WosPuzz(models.Model):
  User = models.ForeignKey(User, on_delete=CASCADE)
  title = models.CharField(max_length=15)
  sentence = models.CharField(max_length=45)
  hint = models.CharField(max_length=25, blank=True, null=True)

  def __str__(self):
    return self.title
  
class WosPuzz2(models.Model):
  User = models.ForeignKey(User, on_delete=CASCADE)
  title = models.CharField(max_length=15)
  line1 = models.CharField(max_length=12)
  line2 = models.CharField(max_length=12)
  line3 = models.CharField(max_length=12)
  line4 = models.CharField(max_length=12)
  hint = models.CharField(max_length=25, blank=True, null=True)

  def __str__(self):
    return self.title


class SchoolClass(models.Model):
  teacher = models.ForeignKey(User, on_delete=CASCADE)
  name = models.CharField(max_length=15)
  class Meta:
    unique_together = ("teacher", "name")

  def __str__(self):
    return f"{self.name} ({self.teacher.username})"
  
class Student(models.Model):
  school_class = models.ForeignKey(SchoolClass, on_delete=CASCADE)
  name = models.CharField(max_length=25)
  number = models.IntegerField()
  seating_position = models.IntegerField(null=True)

  class Meta:
    unique_together = [
      ("school_class", "number"),
      ("school_class", "name", "number"),
      
    ]
  def __str__(self):
    return f"{self.name} in {self.school_class.name}"