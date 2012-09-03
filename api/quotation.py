from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.db.models import get_model
import json

Quotation = get_model('anthologist', 'Quotation')

def quotation_set(req):
    result_set = Quotation.objects.all()
    
    #filters (if I need them)
    """filter_params = [ 'nations', 'language', 'forms', 'author', 'genres', 'contexts', 'topics', 'styles', 'source' ]
    for param in filter_params:
        val = req.GET.get(param, False)
        if val:
            if param == 'nations': full_param = 'selection__source__author__' + param
            if param in [ 'language', 'forms', 'author' ]: full_param = 'selection__source__' + param
            if param in [ 'genres', 'contexts', 'topics', 'styles', 'source' ]: full_param = 'selection__' + param
            result_set = result_set.filter(**{ full_param: val })"""
            
    result = [ quotation.closure() for quotation in result_set ]
    return HttpResponse(json.dumps(result), content_type="application/json")

def quotation(req, quotationId):
    if quotationId == 'random':
        quotation = Quotation.objects.order_by('?')[0]
    else:
        quotation = get_object_or_404(Quotation, pk=quotationId)
    return HttpResponse(json.dumps(quotation.closure()), content_type="application/json")