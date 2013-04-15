from django.shortcuts import render_to_response
from django.template import RequestContext
from anthologist.models import Tag
from anthologist.models.tag import TAG_TYPES
import json

def category(req, category):
    """Get active tags in a given category."""
    tag_no = [ i[0] for i in TAG_TYPES if i[1] == category[:-1] ][0]
    tags = [ t for t in Tag.objects.filter(tag_type=tag_no) if t.is_active() ]
    
    return render_to_response('browse.html', {
        'category': category,
        'category_json': json.dumps(category),
        'tags': tags
    }, context_instance=RequestContext(req))