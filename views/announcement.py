from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from anthologist.models import Announcement


def announcement(req, ann_slug):

    ann = get_object_or_404(Announcement, slug=ann_slug)
    return render_to_response('announcement.html', {
        'announcement': ann
    }, context_instance=RequestContext(req))
