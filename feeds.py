from django.contrib.syndication.views import Feed
from anthologist.models import Selection, Announcement
from django.conf import settings

class FullFeed(Feed):
    title = "The Anthologist: Selections and News"
    link = "/anthologist/"
    description = "New additions to the Anthologist's collection and announcements about the site and related subjects."
   
    def items(self):
        s = Selection.objects.all()
        a = Announcement.objects.all()
        return sorted(set(s).union(a), key=lambda item: item.date_entered, reverse=True)[:25]

    def item_title(self, item):
        return item.__unicode__()
    
    def item_description(self, item):
        if item.class_name() == "Announcement":
            return item.text
        else:
            return item.teaser
        
    def item_link(self, item):
        host = settings.HOSTNAME
        if item.class_name() == "Announcement":
            return "%sannouncements/%s" % (host, item.slug)
        else:
            return "%sselections/%s" % (host, item.slug)
        
    def item_author_name(self, item):
        if item.class_name() == "Announcement":
            return "The Anthologist"
        else:
            return item.author()
        
    def item_pubdate(self, item):
        return item.date_entered