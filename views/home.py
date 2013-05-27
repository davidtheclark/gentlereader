from gentelreader.models import Selection, Announcement, Quotation
from django.shortcuts import render_to_response
from django.template import RequestContext


def get_random_quot():
    """Return a random quotation"""
    return Quotation.objects.all().order_by('?')[0]


def home(req):
    selections = Selection.objects.all()
    announcements = Announcement.objects.all()
    recent_additions = sorted(set(selections).union(announcements), key=lambda item: item.date_entered, reverse=True)[:5]
    return render_to_response('home.html', {
        'recent_additions': recent_additions,
        'random_quot': get_random_quot()
    }, context_instance=RequestContext(req))


def about(req):
    return render_to_response('about.html', {}, context_instance=RequestContext(req))
