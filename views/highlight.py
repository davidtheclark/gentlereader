from django.shortcuts import render_to_response, redirect, get_object_or_404
from django.template import RequestContext
from anthologist.models import Quotation


def highlight(req, highlight_id):

    h = get_object_or_404(Quotation, pk=highlight_id)
    return render_to_response('highlight.html', {
        'h': h
    }, context_instance=RequestContext(req))


def highlight_random(req):
    random = Quotation.objects.order_by('?')[0]
    url = '/highlights/' + str(random.pk)
    return redirect(url)
