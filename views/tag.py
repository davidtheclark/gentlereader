from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from anthologist.models import Tag, Author, Selection
import json


def tag(req, tag_type, tag_slug):

    tag_type = tag_type[:-1]  # subtract the "s"
    if tag_type == 'author':
        tag = get_object_or_404(Author, slug=tag_slug)
        tag_type_json = json.dumps(tag_type)
        selections = Selection.objects.filter(source__author=tag)
    else:
        tag = get_object_or_404(Tag, slug=tag_slug)
        tag_type_json = json.dumps(tag.get_tag_type_display())
        if tag_type == 'language':
            selections = Selection.objects.filter(source__language=tag)
        elif tag_type == 'form':
            selections = Selection.objects.filter(source__forms=tag)
        elif tag_type == 'nation':
            selections = Selection.objects.filter(source__author__nations=tag)
        else:
            x = str(tag.get_tag_type_display()) + 's'
            kwargs = {x: tag}
            selections = Selection.objects.filter(**kwargs)

    return render_to_response('tag.html', {
        'tag_type': tag_type,
        'tag': tag,
        'tag_type_json': tag_type_json,
        'selections': selections
    }, context_instance=RequestContext(req))
