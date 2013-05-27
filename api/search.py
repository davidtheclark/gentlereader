from django.http import HttpResponse
from django.db.models import get_model
import json
import re

Author = get_model('gentlereader', 'Author')
Selection = get_model('gentlereader', 'Selection')
Tag = get_model('gentlereader', 'Tag')


"""Produce data that is typeahead.js-ready."""


def tokenize_string(string):
    cleaned_string = re.sub(r'[\(\),]', '', string)
    return cleaned_string.split()


def author_search_data(req):
    authors = Author.objects.all()
    result = []
    for a in authors:
        datum = {}
        datum['value'] = a.full_name()
        datum['url'] = '/authors/' + a.slug
        datum['tokens'] = tokens = []
        tokens.append(a.last_name)
        if a.first_name:
            name_parts = [part for part in a.first_name.split() if part[0].isupper()]
            tokens += name_parts
        result.append(datum)

    return HttpResponse(json.dumps(result), content_type="application/json")


def selection_search_data(req):
    selections = Selection.objects.all()
    result = []
    for s in selections:
        datum = {}

        display = '"' + s.__unicode__() + '" by ' + s.get_author()
        if s.from_display() != "None":
            display += '; from ' + s.from_display() + ' (' + s.source.date_display() + ')'
        datum['value'] = display

        datum['url'] = '/selections/' + s.slug

        datum['tokens'] = tokens = []
        source = s.source
        tokens.append(str(source.pub_year))
        if source.section_title:
            tokens += tokenize_string(source.section_title)
        if source.volume_title:
            tokens += tokenize_string(source.volume_title)
        tokens += tokenize_string(source.author.full_name())
        if s.selection_title:
            tokens += tokenize_string(s.selection_title)
        if s.from_section:
            tokens += tokenize_string(s.from_section)

        result.append(datum)

    return HttpResponse(json.dumps(result), content_type="application/json")


def tag_datum(obj):
    datum = {}
    datum['url'] = '/' + obj.get_tag_type_display() + 's/' + obj.slug
    datum['value'] = obj.name
    datum['tokens'] = tokenize_string(obj.name)
    return datum


def nation_search_data(category):
    nations = Tag.objects.filter(tag_type=1)
    result = []
    for n in nations:
        result.append(tag_datum(n))
    return HttpResponse(json.dumps(result), content_type="application/json")


def language_search_data(category):
    languages = Tag.objects.filter(tag_type=2)
    result = []
    for n in languages:
        result.append(tag_datum(n))
    return HttpResponse(json.dumps(result), content_type="application/json")


def form_search_data(category):
    forms = Tag.objects.filter(tag_type=3)
    result = []
    for n in forms:
        result.append(tag_datum(n))
    return HttpResponse(json.dumps(result), content_type="application/json")


def genre_search_data(category):
    genres = Tag.objects.filter(tag_type=4)
    result = []
    for n in genres:
        result.append(tag_datum(n))
    return HttpResponse(json.dumps(result), content_type="application/json")


def context_search_data(category):
    contexts = Tag.objects.filter(tag_type=5)
    result = []
    for n in contexts:
        result.append(tag_datum(n))
    return HttpResponse(json.dumps(result), content_type="application/json")


def topic_search_data(category):
    topics = Tag.objects.filter(tag_type=6)
    result = []
    for n in topics:
        result.append(tag_datum(n))
    return HttpResponse(json.dumps(result), content_type="application/json")
