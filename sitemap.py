from django.contrib.sitemaps import Sitemap
from anthologist.models import Selection, Announcement, Author, Tag
from django.conf import settings

host = settings.HOSTNAME

class SelectionSitemap(Sitemap):
    priority = 1.0
    
    def items(self):
        return Selection.objects.all()
    
    def lastmod(self, obj):
        if obj.date_modified:
            return obj.date_modified
        else:
            return obj.date_entered
    
    def location(self, obj):
        return "%sselections/%s" % (host, obj.slug)

class AnnouncementSitemap(Sitemap):
    priority = 0.9
    
    def items(self):
        return Announcement.objects.all()
    
    def lastmod(self, obj):
        return obj.date_entered
    
    def location(self, obj):
        return "%sannouncements/%s" % (host, obj.slug)

class AuthorSitemap(Sitemap):
    priority = 0.7
    
    def items(self):
        return Author.objects.all()
    
    def location(self, obj):
        return "%sauthors/%s" % (host, obj.slug)

class TagSitemap(Sitemap):
    priority = 0.5

    def items(self):
        return Tag.objects.all()
    
    def location(self, obj):
        return "%s%s/%s" % (host, obj.get_tag_type_display() + 's', obj.slug)