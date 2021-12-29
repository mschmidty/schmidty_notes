---
layout: post
title:  "Django View that returns JSON with a relationship"
date: 2020-01-03
published: true
tags: [js, json, django]
---

I am starting to really like Django development.  I'm not a python developer and I am by no means a "full stack" developer, but I keep finding ways to make things in Django without much effort.  

One very useful tool I recently found was a method to return json data and including related fields.   I'm working on a project that I can use a work (really a leveling up side project).  It is a plant database (digital herbarium) that my field crews have been developing in excel.  After two years of collection, it the dataset has outgrown excel.  

To best display the information, I figured that instead of making a bunch of views that return data in a bunch of different ways — which would require lots of work —it would be easier to return json that I could then sort on the fly with javascript in whatever way that the user wanted to (e.g. taxonomic family, color, number of sepals, carpels, or petals, etc.).  

Here we will look at a simplified model that will return all species in the database with a Family relationship.   

In the `appname/models.py`

```python
from django.db import models

class Family(models.Model):
    family = models.CharField(max_length = 100)
    family_description = models.TextField(null = True)

class plant_basics(models.Model):
    genus = models.CharField(max_length = 500)
    species = models.CharField(max_length = 500)
    symbol = models.CharField(max_length = 6, null = True)
    common_name = models.CharField(max_length = 100, null = True)
    description = models.TextField(null = True)
    family = models.ForeignKey(Family, on_delete = models.PROTECT, null = True)
```

Here we have two tables with various fields.  There is a one-to-many relationship between the `Family` and the `plant_basics` model.   

To return json data to a url that you can use on any page on your site, put the following in your `appname/view.py` file:

```python
from django.http import JsonResponse
from .models import plant_basics, Family

def familyJsonIndex(request):
    species = plant_basics.objects.values('genus', 'species','common_name', 'id', 'family__family')
    return JsonResponse({'species': list(species)})
```

Here we query the database with `plant_basics.objects`.  We then subset the model by using `.values()`, which allows us to only return the columns of the table that we want.  Within `values()` we can return any column by just naming it.  If we want to return a relationship we need to use the double underscore syntax `(model__columnName)`.  For us we want to return the family of each plant so the whole string all together is `species = plant_basics.objects.values('genus', 'species','common_name', 'id', 'family__family')`.  Now all we need to do is return that data as json with `return JsonResponse({'species': list(species)})`.

The last thing we need to do is add a url for our json to return to.  In your `appname/urls.py` file:

```python
urlpatterns = [
	## ..more paths..#
	path('species_api/', views.familyJsonIndex, name = "species_apii"),
]
```

Now you can navigate to `http://example.com/appname/species_api` and walla json.



