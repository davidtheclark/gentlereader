from django.shortcuts import get_object_or_404
from django.http import HttpResponse, Http404
from django.db.models import get_model
from tag import tag_set, tag
import json

Selection = get_model('anthologist', 'Selection')
Source = get_model('anthologist', 'Source')
Author = get_model('anthologist', 'Author')

def author_set(req, model, modelId):
    mod = get_object_or_404(model, pk=modelId)
    author = [ mod.author.toJSON() ]
    return HttpResponse(json.dumps(author), content_type="application/json")

def author(req, authorId):
    author = get_object_or_404(Author, pk=authorId)
    return HttpResponse(json.dumps(author.toJSON()), content_type="application/json")

def author_attribute_set(req, selectionId, sourceId, authorId, attribute):
    get_object_or_404(Selection, pk=selectionId)
    get_object_or_404(Source, pk=sourceId)
    if attribute == 'nations':
        return tag_set(req, attribute, Author, sourceId)
    else: raise Http404
    
def author_attribute(req, selectionId, sourceId, authorId, attribute, attributeId):
    get_object_or_404(Selection, pk=selectionId)
    get_object_or_404(Source, pk=sourceId)
    get_object_or_404(Author, pk=authorId)
    if attribute == 'nations':
        return tag(req, attributeId)
    else: raise Http404

def author_all(req):
    sort_field = req.GET.get('sort', 'last_name')
    direction = req.GET.get('direction', 'asc')
    dir_mod = '-' if direction == 'des' else ''
    #Collect authors and filter out any authors that are not attached to a source that is itself attached to a selection
    authors = [ a for a in Author.objects.all().order_by(dir_mod + sort_field) if a.is_active() ]
    result_set = [ item.toJSON() for item in authors ]
    return HttpResponse(json.dumps(result_set), content_type="application/json")