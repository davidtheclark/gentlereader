from django.shortcuts import render_to_response, redirect, get_object_or_404
from django.template import RequestContext
from collections import OrderedDict
from gentelreader.models import Selection, Quotation, Topic, Context, Genre, Nation
from ..utils import ignore_articles, roman_year


#utility
def _get_selection_tags(s):
    """
    Takes a selection and returns a dictionary with
    all of the selection's tags, organized by category and sorted
    """

    # establish the tag categories to fetch
    tag_type_list = ['topics', 'contexts', 'genres', 'nations', 'forms']
    # setup the dictionary, each item being an object with a designated 'type' (category) and a list of tags
    grouped_tags = [{'name': tag_type, 'tags': []} for tag_type in tag_type_list]
    # get and sort the tags for each category
    for category in grouped_tags:
        this_category = category['name']
        if this_category == 'forms':
            tags = getattr(s.source, this_category).all()
        elif this_category == 'nations':
            tags = getattr(s.source.author, this_category).all()
        else:
            tags = getattr(s, this_category).all()
        # sort the tag-list, using ignore_articles()
        category['tags'] = sorted(tags, key=lambda tag: ignore_articles(tag.name))
        # if the category contains only one tag, un-pluralize the name
        if len(tags) == 1:
            category['name'] = this_category[:-1]

    return grouped_tags


def _get_related_selections(mother):
    """
    Returns a dictionary containing selections related to the
    current selection (mother) by the following attributes: 'source', 'author',
    'topics', 'contexts', 'genres', and 'nations'. The dictionary
    will be limited to the 5 most closely related selections,
    ordered most- to least-related.
    """

    similar = {}

    def _add_to_similar(category, tag, selections, weight=1):
        """
        Add to the dictionary 'similar' entries whose key is
        the selection's primary key, and value an object containing
        the selection, it's similarity 'score', and an ordered
        dictionary categorizing and listing the attributes it shares
        with the view's featured selection. (If the list of shared
        attributes exceeds 5, stop there and append 'and more'.
        """

        for s in selections:
            if s == mother:
                continue

            if s.pk not in similar:
                similar[s.pk] = {
                    'selection': s,
                    # similarities is a weighted score,
                    # whereas count is just the number of shared attributes:
                    # if there are more than 5, more changes to True.
                    'similarities': weight,
                    #
                    'count': 1,
                    'more': False,
                    # an OrderedDict because the category order is intentional
                    'share': OrderedDict()
                }
                share = similar[s.pk]['share']
                share[category] = [tag]
            else:
                obj = similar[s.pk]
                if obj['count'] == 5:
                    obj['more'] = True
                    continue
                obj['count'] += 1
                obj['similarities'] += weight
                share = obj['share']
                if category not in share:
                    share[category] = []
                if tag not in share[category]:
                    share[category].append(tag)

    """For each of the 'relating' attribute-values (not the category
    name, but the specific attribute; e.g. not 'author' but 'William James'),
    get a set of selections that share that attribute-value
    and send the selection-set through _add_to_similar."""

    source = mother.source
    share_source = Selection.objects.filter(source=source)
    _add_to_similar('source', source, share_source, 2)

    author = mother.source.author
    share_author = Selection.objects.filter(source__author=author)
    _add_to_similar('author', author, share_author, 2)

    topics = Topic.objects.filter(topic_selections=mother)
    for t in topics:
        share_topics = Selection.objects.filter(topics=t)
        _add_to_similar('topic', t, share_topics)

    contexts = Context.objects.filter(context_selections=mother)
    for c in contexts:
        share_contexts = Selection.objects.filter(contexts=c)
        _add_to_similar('context', c, share_contexts)

    genres = Genre.objects.filter(genre_selections=mother)
    for g in genres:
        share_genres = Selection.objects.filter(genres=g)
        _add_to_similar('genre', g, share_genres)

    nations = Nation.objects.filter(nation_authors=mother.source.author)
    for n in nations:
        share_nations = Selection.objects.filter(source__author__nations=n)
        _add_to_similar('nation', n, share_nations)

    sorted_keys = sorted(similar, key=lambda x: similar[x]['similarities'], reverse=True)[0:5]
    shortened_similar = []
    for key in sorted_keys:
        shortened_similar.append(similar[key])

    """
    If a category in a selection's 'shared' attributes-list
    has more than one attribute-value, pluralize the category name.
    """
    for item in shortened_similar:
        share = item['share']
        for category in share:
            if len(share[category]) == 0:
                del share[category]
            elif category != 'author' and category != 'source' and \
                category[-1] != 's' and len(share[category]) > 1:
                share[category + 's'] = share.pop(category)

    return shortened_similar


def selection(req, sel_slug):

    # 'most recent' and 'random' will redirect to an actual selection's slug
    if sel_slug == 'most-recent' or sel_slug == 'random':
        if sel_slug == 'most-recent':
            selection = Selection.objects.latest('date_entered')
        elif sel_slug == 'random':
            selection = Selection.objects.order_by('?')[0]
        url = '/selections/' + selection.slug
        return redirect(url)

    # get the selection
    else:
        selection = get_object_or_404(Selection, slug=sel_slug)

    # get the selection's tags
    grouped_tags = _get_selection_tags(selection)

    # get a random brief quotation (fewer than 450 characters long) to display as the highlight
    sel_quotations = Quotation.objects.filter(selection=selection).order_by('?')
    brief_quotations = [q for q in sel_quotations if len(q.quotation) <= 450]
    quotations = brief_quotations

    # get 5 related selections
    related_selections = _get_related_selections(selection)

    return render_to_response('selection.html', {
        'selection': selection,
        'source': selection.source,
        'grouped_tags': grouped_tags,
        'quotations': quotations,
        'year_entered': roman_year(selection.date_entered.year),
        'year_modified': roman_year(selection.date_modified.year),
        'related_selections': related_selections
    }, context_instance=RequestContext(req))
