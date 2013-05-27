from django.contrib.sitemaps import Sitemap
from gentlereader.models import Selection, Announcement, Author, Tag, Quotation

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
        return "/selections/%s" % (obj.slug)

class AnnouncementSitemap(Sitemap):
    priority = 0.8

    def items(self):
        return Announcement.objects.all()

    def lastmod(self, obj):
        return obj.date_entered

    def location(self, obj):
        return "/announcements/%s" % (obj.slug)

class AuthorSitemap(Sitemap):
    priority = 0.7

    def items(self):
        return Author.objects.all()

    def location(self, obj):
        return "/authors/%s" % (obj.slug)

class TagSitemap(Sitemap):
    priority = 0.5

    def items(self):
        return Tag.objects.all()

    def location(self, obj):
        return "/%s/%s" % (obj.get_tag_type_display() + 's', obj.slug)

class QuotationSitemap(Sitemap):
    priority = 1.0

    def items(self):
        return Quotation.objects.all()

    def lastmod(self, obj):
        return obj.selection.date_entered

    def location(self, obj):
        return "/highlights/%s" % (obj.pk)