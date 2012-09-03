from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
from django.db.models import get_model
from tag import tag, tag_set
from source import source, source_set
from quotation import quotation, quotation_set
import json

Selection = get_model('anthologist', 'Selection')
selection_tags = [ 'genres', 'contexts', 'topics', 'styles' ]

def selection_set(req):

    #GET business for sorting
    sort_field = req.GET.get('sort', 'date_entered')
    direction = req.GET.get('direction', 'des')
    dir_mod = '-' if direction == 'des' else ''
    sorter = dir_mod
    if sort_field == 'author':
        sorter += 'source__author__last_name'
    elif sort_field == 'pub_year':
        sorter += 'source__pub_year'
    else:
        sorter += sort_field
    result_set = Selection.objects.all().order_by(sorter)
    
    #GET business for filtering
    filter_params = [ 'nations', 'language', 'forms', 'author', 'genres', 'contexts', 'topics', 'styles', 'source' ]
    for param in filter_params:
        val = req.GET.get(param, False)
        if val:
            val_split = val.split(',') #in case of multiple values given for the same param, e.g. (?genres=5,22)
            for it in val_split: 
                if param == 'nations': full_param = 'source__author__' + param 
                if param in [ 'language', 'forms', 'author' ]: full_param = 'source__' + param
                if param in [ 'genres', 'contexts', 'topics', 'styles', 'source' ]: full_param = param
                result_set = result_set.filter(**{ full_param: it })
    closure = req.GET.get('closure', 'true')
    if closure == 'true':
        result = [ sel.closure() for sel in result_set ]
    else:
        result = [ sel.toJSON() for sel in result_set ]
        
    return HttpResponse(json.dumps(result), content_type="application/json")

def selection(req, selectionId):
    sel = get_object_or_404(Selection, pk=selectionId)
    closure = req.GET.get('closure', 'true')
    if closure == 'true':
        result = sel.closure()
    else:
        result = sel.toJSON()
    return HttpResponse(json.dumps(result), content_type="application/json")

def selection_attribute_set(req, selectionId, attribute):
    if attribute in selection_tags:
        return tag_set(req, attribute, Selection, selectionId)
    elif attribute == 'source':
        return source_set(req, Selection, selectionId)
    elif attribute == 'quotations':
        return quotation_set(req, Selection, selectionId)
    else: raise Http404
    
def selection_attribute(req, selectionId, attribute, attributeId):
    get_object_or_404(Selection, pk=selectionId)
    if attribute in selection_tags:
        return tag(req, attributeId)
    elif attribute == 'source':
        return source(req, attributeId)
    elif attribute == 'quotations':
        return quotation(req, attributeId)
    else: raise Http404
