---
layout: post
title:  "Django Getting Started"
date: 2018-12-08
published: true
tags: [ django, MVC ]
---

My notes on learning Django.  I'm using this [Django Tutorial](https://docs.djangoproject.com/en/2.1/intro/tutorial01/).

### Set up a virtual Environment
Find instructions to do that [here](https://docs.djangoproject.com/en/2.1/intro/contributing/#getting-a-copy-of-django-s-development-version)

Create a virtual environment with [virtualenv](https://virtualenv.pypa.io/en/latest/).
```bash
## In the directory where you wish to create the environment
virtualenv nameOfEnvironment
## Move into folder that the environment was created
cd nameOfEnvironment
## activate that
source bin/activate
## Install Django
pip install Django
```

Every time you want to run Django.

### Create a project
`cd` to project parent folder and run:

```bash
django-admin startproject name_of_project
cd name_of_project
```

### Create app within project
```bash
python manage.py startapp polls
```

### Migrate models
Good to do this at the very beginning of the site.
```bash
python manage.py migrate
```

If you have a new model you should run this first:
```bash
python manage.py makemigrations
```
### Create a super user
```bash
python manage.py createsuperuser
```
### Run a server
```bash
python manage.py runserver
```

### Start a shell for DB actions

```bash
python manage.py shell
```

### Working with URLs
* [Tutorial Basics on Views and URLs](https://docs.djangoproject.com/en/2.1/intro/tutorial03/#writing-more-views)
* [Resources](https://docs.djangoproject.com/en/2.1/topics/http/urls/)

## Steps for starting an app
### Create an app:
```bash
python manage.py startapp polls
```
### Make a view. The very basics:

```python
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")
```

### Create a url for the view: app/views.py (may need to create the file)
```python
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
]
```

Then point the root `urls.py` file to the app `urls.py`.  the root/urls.py file should look like this:
```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('herds/', include('herds.urls')),
]
```
