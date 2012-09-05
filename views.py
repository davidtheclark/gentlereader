from django.shortcuts import render_to_response, redirect
from anthologist.models import Selection, Author, Topic, Nation, Language, Form, Genre, Context, Topic, Style, Tag, ExternalLink, ExternalLinkCategory, Announcement
from django.template import RequestContext
import json
from django.shortcuts import get_object_or_404
from anthologist.forms import ContactForm
from django.core.mail import EmailMessage
from django.http import HttpResponseRedirect


def ignore_articles(string): #utility function used below.
    if string.startswith("the "):
        return string[4:]
    elif string.startswith("an "):
        return string[3:]
    elif string.startswith("a "):
        return string[2:]
    else:
        return string

def selection(req, sel_slug):
    
    #make the "most recent" menu item redirect to the actual url of the most recently entered selection
    if sel_slug == 'most-recent' or sel_slug == 'random':
        if sel_slug == 'most-recent':
            selection = Selection.objects.latest('date_entered')
        elif sel_slug == 'random':
            selection = Selection.objects.order_by('?')[0] 
        url = '/selections/' + selection.slug
        return redirect(url)   
    else:
        selection = get_object_or_404(Selection, slug=sel_slug)
    tag_type_list = [ 'forms', 'genres', 'topics', 'contexts', 'styles', 'nations' ] #determines categories in the sidebar
    grouped_tags = [{ 'type': tag_type, 'tags': [] } for tag_type in tag_type_list ]
    for item in grouped_tags:
        this_type = item['type']
        if this_type == 'forms':
            item['tags'] = getattr(selection.source, this_type).all() #order_by('name') is default in models.py
        elif this_type == 'nations':
            item['tags'] = getattr(selection.source.author, this_type).all()
        else:
            item['tags'] = getattr(selection, this_type).all()
        #re-order the tags by using ignore_articles() (defined above), so that, e.g., "the egg" comes in the "e" range, not the "t" range.
        item['tags'] = sorted(item['tags'], key=lambda tag: ignore_articles(tag.name))
    return render_to_response('selection.jade', {
            'selection': selection,
            'grouped_tags': grouped_tags 
        }, context_instance=RequestContext(req))

def tag(req, tag_type, tag_slug):
    tag_type = tag_type[:-1] #subtract the "s"
    if tag_type == 'author':
        tag = get_object_or_404(Author, slug=tag_slug)
        tag_type_json = json.dumps(tag_type)
        related_tags = Author.objects.all() #order_by('last_name') is default in models.py
    else:
        tag = get_object_or_404(Tag, slug=tag_slug)
        tag_type_json = json.dumps(tag.get_tag_type_display()) #necessary because tag_type returns an integer
        related_tags = Tag.objects.filter(tag_type=tag.tag_type) #order_by('name') is default in models.py
    return render_to_response('tag.jade', {
            'tag_type': tag_type,
            'tag': tag,
            'tag_type_json': tag_type_json,
            'related_tags': related_tags,
            'filter_tag_types': [ 'forms', 'genres', 'topics', 'contexts', 'styles', 'nations', 'language'  ]
        }, context_instance=RequestContext(req))

category_array = [ 'selections', 'authors', 'timeline', 'forms', 'genres', 'topics', 'contexts', 'styles', 'nations', 'languages', ]

def category(req, category):
    #this "exec" business necessary to use variable as model name in query
    code = 'tags = ' + str(category.capitalize()[:-1] + '.objects.all()')
    exec code
    return render_to_response('browse.jade', {
        'category': category,
        'category_json': json.dumps(category),
        'category_array': category_array,
        'tags': tags
    }, context_instance=RequestContext(req))

def all_selections(req):
    return render_to_response('browse.jade', {
        'category': 'selections',
        'category_array': category_array
    }, context_instance=RequestContext(req))

def home(req):
    s = Selection.objects.all()
    a = Announcement.objects.all()
    recent_content = sorted(set(s).union(a), key=lambda item: item.date_entered, reverse=True)[:10]
    selections_only = Selection.objects.all()[:10]
    announcements_only = Announcement.objects.all()[:10]
    return render_to_response('home.jade', {
        'recent_content': recent_content,
        'selections_only': selections_only,
        'announcements_only': announcements_only
    }, context_instance=RequestContext(req))

def timeline(req):
    return render_to_response('browse.jade', {
        'category': 'timeline',
        'category_array': category_array,
    }, context_instance=RequestContext(req))

def resource(req):
    link_categories = ExternalLinkCategory.objects.all().order_by('weight')
    links = ExternalLink.objects.all()
    return render_to_response('resource.jade', {
        'links': links,
        'link_categories': link_categories
    }, context_instance=RequestContext(req))

def all_announcements(req):
    announcements = Announcement.objects.all()
    return render_to_response('browse.jade', {
        'category': 'announcements',
        'announcements': announcements
    }, context_instance=RequestContext(req))

def announcement(req, ann_slug):
    ann = get_object_or_404(Announcement, slug=ann_slug)
    return render_to_response('announcement.jade', { 'ann': ann }, context_instance=RequestContext(req)) 

def contribute(req):
    auto_subject = req.GET.get('subject')
    
    if req.method == 'POST': # If the form has been submitted...
        form = ContactForm(req.POST) # A form bound to the POST data
        if form.is_valid(): # All validation rules pass
            subject = form.cleaned_data['subject']
            message = '(From ' + form.cleaned_data['sender'] + ') ' + form.cleaned_data['message']
            sender = form.cleaned_data['sender']
            cc_myself = form.cleaned_data['cc_myself']
            recipients = [ 'dave@projectegghead.com' ]
            if cc_myself:
                recipients.append(sender)
            from django.core.mail import send_mail
            send_mail(subject, message, sender, recipients)
            return HttpResponseRedirect('/thanks/') # Redirect after POST
    else:
        form = ContactForm() # An unbound form'
    return render_to_response('contribute.html', { 'form': form, 'auto_subject': auto_subject }, context_instance=RequestContext(req))
  
def thanks(req):
    return render_to_response('contribute.html', { 'thanks': 'thanks' }, context_instance=RequestContext(req))
    