from django.shortcuts import render_to_response
from django.template import RequestContext
from django.db.models import Q
from gentelreader.models import Author, Selection, Nation, Language, Form, Genre, Context, Topic


def search_results(req):

    query = req.GET.get('query')

    count = 0

    if query:

        query_list = query.split()

        results = {
            'authors': [],
            'selections': [],
            'nations': [],
            'languages': [],
            'forms': [],
            'genres': [],
            'contexts': [],
            'topics': []
        }
        # Authors: last name, first name, nation

        def check_author(term):
            return Author.objects.filter(
                Q(last_name__icontains=term) |
                Q(first_name__icontains=term))

        for term in query_list:
            authors = check_author(term)
            if len(authors) > 0:
                for a in authors:
                    if a not in results['authors']:
                        results['authors'].append(a)

        # Selection: source section title, source volume title, selection title, from section, source pub year, author
        results['selections'] = Selection.objects.filter(
            Q(selection_title__icontains=query) |
            Q(from_section__icontains=query) |
            Q(source__pub_year__icontains=query) |
            Q(source__section_title__icontains=query) |
            Q(source__volume_title__icontains=query) |
            Q(source__author__in=results['authors']))

        # Nations
        results['nations'] = Nation.objects.filter(name__icontains=query)
        # Languages
        results['languages'] = Language.objects.filter(name__icontains=query)
        # Forms
        results['forms'] = Form.objects.filter(name__icontains=query)
        # Genres
        results['genres'] = Genre.objects.filter(name__icontains=query)
        # Contexts
        results['contexts'] = Context.objects.filter(name__icontains=query)
        # Topics
        results['topics'] = Topic.objects.filter(name__icontains=query)

        # Any results?
        for category in results:
            count += len(results[category])

    else:
        results = False

    return render_to_response('search.html', {
        'query': query,
        'results': results,
        'count': count
    }, context_instance=RequestContext(req))
