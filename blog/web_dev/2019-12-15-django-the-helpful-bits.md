---
layout: post
title:  "Django Relationships"
date: 2019-12-15
published: true
tags: [python]
---

For some reason, in the winter I get the urge to learn something new. This year, I'm attempting to pick up Django again (gave an effort a year ago too).  One of the things I wanted to better understand is how to implement database relationships.  

This tutorial assumes you have gone through a some Django tutorials, but you are by no means a Django ninja. I'll assume you have a basic understanding of Django models, views, templates and urls.  If you need help with the basics I strong recommend you check out Django's [First Steps Tutorial](https://docs.djangoproject.com/en/3.0/intro/tutorial01/) and [MDNs Django Tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/Tutorial_local_library_website).

## Model Relationships
Model relationships work really well in Django and they are configured to work out of the box in many of the views.  But that is kind of what makes them hard.  I was expecting to have to configure more than I did. And because it is the default configuration you get weird answers when you google around.  Usually someone doing something way more complex then needs to be done.  So here are the simple ways.

### Step 1 - make a model with a relationship
We are going to make a one-to-many relationship between teachers and students. One teacher will have many students. This example will be an elementary school example so students only have one teacher. This also assumes you have a Django app already started `python manag.py startapp app`.

In your `app/models.py`:

```python
from django import models
from django.urls import reverse

class Teacher(models.Model):
  first_name = models.CharField(max_length = 50)
  last_name = models.Charfield(max_length = 50)

  def get_absolute_url(self):
        return reverse('teacher-detail', kwargs={'pk':self.pk})

  def __str__(self):
        teacher_name = "%s %s" %(str(self.first_name), str(self.last_name))
        return(teacher_name)

class Student(models.Model):
  first_name = models.CharField(max_length = 50)
  last_name = models.Charfield(max_length = 50)
  parents_name = models.Charfield(max_length = 50)
  teacher = models.ForeignKey(Teacher, on_delete = models.PROTECT, null = True)

  def __str__(self):
        student_name = "%s %s" %(str(self.first_name), str(self.last_name))
        return(student_name)

    def get_absolute_url(self):
        return reverse('student-detail', kwargs={'pk':self.pk})
```

Then migrate the models in the terminal:

```bash
python manage.py makemigrations app
python manage.py migrate
```

A few things here before we move onto the views. The models are basic relationship models.  Each student should be related to one teacher so we add a `models.ForeignKey()` to the `Student` model. The only thing we have to do to make that connection is pass `Teacher` as a parameter.  I've also added `on_delete = models.PROTECT` so that if we ever delete a teacher it will not delete the students.  This attribute was particularly useful - and not included in many of the tutorials I saw. You have to careful though because this means that not all students need to have teachers so you will lack the form validation to remind you to add one.  You will also need to add `null = True` because we are not requiring that a student have a teacher. If you do want to have all of the students removed if a teacher is deleted you can change to `on_delete = models.CASCADE` and `null = False`.

## Step 2 - The Views
I wanted two things when developing my app out of a relationship.  I wanted to be able to assign a teacher to a student in the student form with a `<select>` drop down.  Within a school you would have more than one teacher.  And each teacher has many students. I also wanted to be able to display the teacher view with all of the students listed on the teacher page.

### Student Create View with Teacher Dropdown
This part was way too easy and it took me a while to figure it out because it was so easy.  I was thinking there had to be some configuration, but there really isn't. Fort this we will use generic class based views.

In your `app/views.py` file:
```python
from django.views import generic
from .models import Student, Teacher

#...more imports and views removed ...

class StudentCreateView(generic.CreateView):
  model = Student
  fields = [
    'first_name',
    'last_name',
    'parents_name',
    'teacher'
  ]
```

That is literally it.  In your template, you don't need any configuration either, you can just call the generic form.

In the `app/templates/app/student_form.html`:
```html
{% raw %}
<form method="post"> ## {% csrf_token %}
    {{ form.as_p }}
    <input type="submit" value="Save">
</form>
{% endraw %}
```

And there should be a dropdown there for you to select the teacher.

The last thing I wanted to do is to make a view that allowed me to list all of the students under the teacher view.

In the `app/views.py` file:

```python
from django.views import generic
from .models import Student, Teacher

#...more imports and views removed ...
class TeacherDetail(generic.DetailView):
  model = Teacher

```

Then in the template which should be in the `app/template/app/teacher_detail.html` (that's where the Django generic view looks) file:

```html
<h1>{{ object.first_name }} {{object.last_name}}</h1> ##Add the name of the teacher.

## Below is a list of all of their students:
<ul>
  {% for students in object.Students_set.all %}
    <li>{{students.first_name}} {{stunts.last_name}}</li>
  {% endfor %}
</ul>
```

The `Model_set.all` is the important part when querying the database.   It calls all students that are related to the current teacher.  Then you loop through them and list them out.

## Final thoughts

Hopefully this helped you better understand how relationships work in Django.  I'm continually amazed at how Django is designed to make things you want to do a lot as strait forward as possible.  As with most frameworks, it can be hard to understand at first, but after a few tutorials Django seems to be the easiest to understand for me.
