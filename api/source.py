from django.shortcuts import get_object_or_404
from django.http import HttpResponse, Http404
from django.db.models import get_model
from tag import tag_set, tag
from author import author_set, author
import json

Source = get_model('gentlereader', 'Source')
Selection = get_model('gentlereader', 'Selection')
source_tag_types = [ 'language', 'forms' ]

def source_set(req):

    #GET business for sorting
    sort_field = req.GET.get('sort', 'author')
    direction = req.GET.get('direction', 'asc')
    dir_mod = '-' if direction == 'des' else ''
    sorter = dir_mod
    if sort_field == 'author':
        sorter += 'author__last_name'
    elif sort_field == 'pub_year':
        sorter += 'pub_year'
    result_set = Source.objects.all().order_by(sorter)

    sources = [ s.closure() for s in result_set if s.is_active() ]
    return HttpResponse(json.dumps(sources), content_type="application/json")

def source(req, sourceId):
    source = get_object_or_404(Source, pk=sourceId)
    return HttpResponse(json.dumps(source.toJSON()), content_type="application/json")

def source_attribute_set(req, selectionId, sourceId, attribute):
    get_object_or_404(Selection, pk=selectionId)
    if attribute in source_tag_types:
        return tag_set(req, attribute, Source, sourceId)
    elif attribute == 'author':
        return author_set(req, Source, sourceId)
    else: raise Http404

def source_attribute(req, selectionId, sourceId, attribute, attributeId):
    get_object_or_404(Selection, pk=selectionId)
    get_object_or_404(Source, pk=sourceId)
    if attribute in source_tag_types:
        return tag(req, attributeId)
    elif attribute == 'author':
        return author(req, attributeId)
    else: raise Http404
