from django.shortcuts import render_to_response, redirect, get_object_or_404
from django.template import RequestContext
from anthologist.models import Selection, Quotation, Topic, Context, Genre, Nation, Form
from ..utils import ignore_articles, roman_year

#utility
def _get_selection_tags(s):   
    """ Takes a selection (s) and returns a dictionary with
    all of the selection's tags, organized by category and sorted """

    # establish the tag categories to fetch
    tag_type_list = [ 'forms', 'genres', 'topics', 'contexts', 'nations' ]
    # setup the dictionary, each item being an object with a designated 'type' (category) and a list of tags
    grouped_tags = [ { 'name': tag_type, 'tags': [ ] } for tag_type in tag_type_list ]
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
    
    similar = {}
    
    # tags = [ 'source', 'author', 'topics', 'contexts', 'genres', 'nations', 'forms' ]

    def _add_to_similar(category, tag, selections, weight=1):
        for s in selections:
            if s == mother:
                continue
                
            if s.pk not in similar:
                similar[s.pk] = {
                    'selection': s,
                    'similarities': weight,
                    'share': { category: [ tag ] }
                }
            else:
                obj = similar[s.pk]
                obj['similarities'] += weight
                share = obj['share']
                if category not in share:
                    share[category] = []
                if tag not in share[category]:
                    share[category].append(tag)
    
    source = mother.source
    share_source = Selection.objects.filter(source=source)
    _add_to_similar('source', source, share_source, 1.5)
    
    author = mother.source.author
    share_author = Selection.objects.filter(source__author=author)
    _add_to_similar('author', author, share_author, 1.5)
    
    topics = Topic.objects.filter(topic_selections=mother)
    for t in topics:
        share_topics = Selection.objects.filter(topics=t)
        _add_to_similar('topics', t, share_topics)
    
    contexts = Context.objects.filter(context_selections=mother)
    for c in contexts:
        share_contexts = Selection.objects.filter(contexts=c)
        _add_to_similar('contexts', c, share_contexts)
    
    genres = Genre.objects.filter(genre_selections=mother)
    for g in genres:
        share_genres = Selection.objects.filter(genres=g)
        _add_to_similar('genres', g, share_genres)
    
    nations = Nation.objects.filter(nation_authors=mother.source.author)
    for n in nations:
        share_nations = Selection.objects.filter(source__author__nations=n)
        _add_to_similar('nations', n, share_nations)
    
    forms = Form.objects.filter(form_sources=mother.source)
    for f in forms:
        share_forms = Selection.objects.filter(source__forms=f)
        _add_to_similar('forms', f, share_forms)
    
    sorted_keys = sorted(similar, key=lambda x: similar[x]['similarities'], reverse=True)[0:5]
    shortened_similar = []
    for key in sorted_keys:
        shortened_similar.append(similar[key])
    
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
    brief_quotations = [q for q in sel_quotations if len(q.quotation) <= 450 ]
    quotation = brief_quotations[0]
    
    # get 5 related selections
    related_selections = _get_related_selections(selection)
            
    return render_to_response('selection.html', {
            'selection': selection,
            'grouped_tags': grouped_tags,
            'quotation': quotation,
            'year_entered': roman_year(selection.date_entered.year),
            'year_modified': roman_year(selection.date_modified.year),
            'related_selections': related_selections
        }, context_instance=RequestContext(req))