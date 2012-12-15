from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.db.models import get_model
import json

Quotation = get_model('anthologist', 'Quotation')

def quotation_all(req):
    result = [ quotation.closure() for quotation in Quotation.objects.all() ]
    return HttpResponse(json.dumps(result), content_type="application/json")

def quotation_set(req, Selection, SelectionId):
    result = [ q.toJSON() for q in Quotation.objects.filter(selection__pk=SelectionId).order_by('?') ]
    return HttpResponse(json.dumps(result), content_type="application/json")

def quotation(req, quotationId):
    if quotationId == 'random':
        quotation = Quotation.objects.order_by('?')[0]
    else:
        quotation = get_object_or_404(Quotation, pk=quotationId)
    return HttpResponse(json.dumps(quotation.closure()), content_type="application/json")