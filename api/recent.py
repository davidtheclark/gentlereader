from django.db.models import get_model
from django.http import HttpResponse
import json

Selection = get_model('gentlereader', 'Selection')
Announcement = get_model('gentlereader', 'Announcement')

s = Selection.objects.all()
a = Announcement.objects.all()

def recent_contents(req):
    recent_content = sorted(set(s).union(a), key=lambda item: item.date_entered, reverse=True)[:10]
    result_set = [ it.closure() for it in recent_content ]
    return HttpResponse(json.dumps(result_set), content_type="application/json")

def recent_selections(req):
    result_set = [ it.closure() for it in s[:10] ]
    return HttpResponse(json.dumps(result_set), content_type="application/json")

def recent_announcements(req):
    result_set = [ it.toJSON() for it in a[:10] ]
    return HttpResponse(json.dumps(result_set), content_type="application/json")