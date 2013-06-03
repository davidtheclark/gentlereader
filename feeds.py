from django.contrib.syndication.views import Feed
from gentlereader.models import Selection, Announcement
from django.conf import settings

class FullFeed(Feed):
    host = settings.HOSTNAME
    title = "The Gentle Reader"
    link = "%s" % (host)
    description = "New additions to The Gentle Reader's collection, along with announcements about the site."

    def items(self):
        s = Selection.objects.all()
        a = Announcement.objects.all()
        return sorted(set(s).union(a), key=lambda item: item.date_entered, reverse=True)[:25]

    def item_title(self, item):
        return item.__unicode__()

    def item_description(self, item):
        return item.get_text()

    def item_link(self, item):
        host = settings.HOSTNAME
        if item.class_name() == "Announcement":
            return "%sannouncements/%s" % (host, item.slug)
        else:
            return "%sselections/%s" % (host, item.slug)

    def item_author_name(self, item):
        if item.class_name() == "Announcement":
            return "The Gentle Reader"
        else:
            return item.get_author()

    def item_pubdate(self, item):
        return item.date_entered
