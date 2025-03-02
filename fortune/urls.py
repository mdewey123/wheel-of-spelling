from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('profile', views.profile, name='profile'),
    path('game/wheel_of_spelling', views.wheel_of_spelling, name='WOS'),
    path('profile/class_lists', views.class_lists, name='classes'),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
]