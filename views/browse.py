from django.shortcuts import render_to_response
from django.template import RequestContext
from gentlereader.models import Tag, Author, Selection, Source, Announcement
from gentlereader.models.tag import TAG_TYPES
from gentlereader.utils import ignore_articles
import json

categories = ['selections', 'highlights', 'authors', 'timeline', 'forms', 'genres', 'topics', 'contexts', 'nations', 'languages', 'announcements']


def browse_category(req, category):
    """Get active tags in a given category."""

    if category == 'authors':
        tags = [a for a in Author.objects.all() if a.is_active()]

    else:
        tag_no = [i[0] for i in TAG_TYPES if i[1] == category[:-1]][0]
        tags = [t for t in Tag.objects.filter(tag_type=tag_no) if t.is_active()]
        tags = sorted(tags, key=lambda tag: ignore_articles(tag.name.lower()))

    other_categories = [c for c in categories if c != category]

    return render_to_response('browse.html', {
        'other_categories': other_categories,
        'category': category,
        'category_json': json.dumps(category),
        'tags': tags
    }, context_instance=RequestContext(req))


def browse_selections(req):
    """Get all selections."""

    selections = Selection.objects.all()
    other_categories = [c for c in categories if c != 'selections']
    return render_to_response('browse.html', {
        'other_categories': other_categories,
        'category': 'selections',
        'category_json': json.dumps('selections'),
        'selections': selections
    }, context_instance=RequestContext(req))


def browse_timeline(req):
    """Get all selections, organized by date."""

    years = {}
    result = []
    for source in Source.objects.all():
        source_year = source.pub_year
        if source_year not in years:
            years[source_year] = source.date_display()

    for year, display in years.iteritems():
        year_selections = Selection.objects.filter(source__pub_year=year)
        result.append({'year': year, 'date_display': display, 'selections': year_selections})
    result = sorted(result, key=lambda i: -i['year'])

    other_categories = [c for c in categories if c != 'timeline']

    return render_to_response('browse.html', {
        'other_categories': other_categories,
        'category': 'timeline',
        'category_json': json.dumps('timeline'),
        'years': result
    }, context_instance=RequestContext(req))


def browse_highlights(req):
    """Get all authors. Highlight-fetching is AJAX."""

    authors = Author.objects.all().order_by('last_name')
    other_categories = [c for c in categories if c != 'highlights']
    return render_to_response('browse.html', {
        'other_categories': other_categories,
        'category': 'highlights',
        'category_json': json.dumps('highlights'),
        'authors': authors
    }, context_instance=RequestContext(req))


def browse_announcements(req):
    """Get all announcements."""

    announcements = Announcement.objects.all()
    other_categories = [c for c in categories if c != 'announcements']
    return render_to_response('browse.html', {
        'other_categories': other_categories,
        'category': 'announcements',
        'category_json': json.dumps('announcements'),
        'announcements': announcements
    }, context_instance=RequestContext(req))
