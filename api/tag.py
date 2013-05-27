from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.db.models import get_model
import json
from gentlereader.models import Form, Genre, Context, Topic, Style, Selection, Author, Source
from gentlereader.models.tag import TAG_TYPES

Tag = get_model('gentlereader', 'Tag')

def tag_set(req, tag_type, model, modelId):
    mod = get_object_or_404(model, pk=modelId)
    if tag_type == 'language':
        tags = [ getattr(mod, tag_type).toJSON() ]
    else:
        tags = [ tag.toJSON() for tag in getattr(mod, tag_type).all() ]
    return HttpResponse(json.dumps(tags), content_type="application/json")

def tag(req, tagId):
    tag = get_object_or_404(Tag, pk=tagId)
    return HttpResponse(json.dumps(tag.toJSON()), content_type="application/json")

#Specific tag sets: maybe later can figure out a way to consolidate this code?
#The "is_active" test ensures that the tag is not unattached (topic has a selection, nation has an author, etc.)
def tag_type_set(x):
    tags = [ tag.toJSON() for tag in Tag.objects.filter(tag_type=x) if tag.is_active() ]
    return HttpResponse(json.dumps(tags), content_type="application/json")

#From models.tag
#TAG_TYPES = (
#    (1, 'nation'), (2, 'language'),
#    (3, 'form'), (4, 'genre'),
#    (5, 'context'), (6, 'topic'),
#    (7, 'style')
#)

def nation_set(req):
    return tag_type_set(1)
def language_set(req):
    return tag_type_set(2)
def form_set(req):
    return tag_type_set(3)
def genre_set(req):
    return tag_type_set(4)
def context_set(req):
    return tag_type_set(5)
def topic_set(req):
    return tag_type_set(6)
def style_set(req):
    return tag_type_set(7)
