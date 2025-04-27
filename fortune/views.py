from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from .models import *
from .forms import *
# Create your views here.


def index(request):
    return render(request, 'fortune/index.html')

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "fortune/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "fortune/login.html")

    
@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

     
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "fortune/register.html", {
                "message": "Passwords must match."
            })


        try:
            user = models.User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "fortune/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "fortune/register.html")

def profile(request, user):
    return render(request, 'fortune/profile.html')

def wheel_of_spelling(request):
    grid = range(12)
    consenants = ("b", "c", 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z')
    vowels = ('a', 'e', 'i', 'o', 'u')
    puzzles = WosPuzz2.objects.filter(User = request.user)
    welcome_puzz = puzzles.first()

    if request.method == "POST":

        newPuzz = MakeWOSPuzz(request.POST, request.FILES)
        
        if newPuzz.is_valid():
            np = newPuzz.save(commit=False)
            np.User = request.user
            np.save()
            return HttpResponseRedirect(reverse("WOS" ))
    else:
        newPuzz = MakeWOSPuzz()

    return render(request, 'fortune/wheel_of_spelling.html', {
       'grid': grid,
       'consenants': consenants,
       'vowels': vowels,
       'newPuzz': newPuzz,
       'puzzles': puzzles,
       'welcome_puzz': welcome_puzz,
    })

def class_lists(request):
    user = request.user
    student_form = NewStudent
    classroom_form = NewRoom

    return render(request, 'fortune/class_list.html', {
        'user': user,
    })