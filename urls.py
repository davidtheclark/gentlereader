from django.conf.urls.defaults import *
from django.contrib import admin
from anthologist.feeds import FullFeed
from anthologist.sitemap import SelectionSitemap, AnnouncementSitemap, AuthorSitemap, TagSitemap
admin.autodiscover()

# Data Access URLs
urlpatterns = patterns('anthologist.api',
    (r'^api/selections/$', 'selection_set'),
    (r'^api/selections/(?P<selectionId>\d+)/$', 'selection'),
    (r'^api/selections/(?P<selectionId>\d+)/(?P<attribute>source|genres|contexts|topics|styles|quotations)/$', 'selection_attribute_set'),
    (r'^api/selections/(?P<selectionId>\d+)/(?P<attribute>source|genres|contexts|topics|styles|quotations)/(?P<attributeId>\d+)/$', 'selection_attribute'),
    (r'^api/selections/(?P<selectionId>\d+)/source/(?P<sourceId>\d+)/(?P<attribute>language|forms|author)/$', 'source_attribute_set'),
    (r'^api/selections/(?P<selectionId>\d+)/source/(?P<sourceId>\d+)/(?P<attribute>language|forms|author)/(?P<attributeId>\d+)/$', 'source_attribute'),
    (r'^api/selections/(?P<selectionId>\d+)/source/(?P<sourceId>\d+)/author/(?P<authorId>\d+)/(?P<attribute>nations)/$', 'author_attribute_set'),
    (r'^api/selections/(?P<selectionId>\d+)/source/(?P<sourceId>\d+)/author/(?P<authorId>\d+)/(?P<attribute>nations)/(?P<attributeId>\d+)/$', 'author_attribute'),
    (r'^api/quotations/$', 'quotation_set'),
    (r'^api/quotations/(?P<quotationId>\d+|random)/$', 'quotation'),
    (r'^api/sources/$', 'source_set'),
    (r'^api/authors/$', 'author_all'),
    (r'^api/recent/$', 'recent_contents'),
    (r'^api/recent/selections/$', 'recent_selections'),
    (r'^api/recent/announcements/$', 'recent_announcements'),
    
    #tag pages -- maybe later can figure out a way to consolidate this code?
    (r'^api/nations/$', 'nation_set'),
    (r'^api/languages/$', 'language_set'),
    (r'^api/forms/$', 'form_set'),
    (r'^api/genres/$', 'genre_set'),
    (r'^api/contexts/$', 'context_set'),
    (r'^api/topics/$', 'topic_set'),
    (r'^api/styles/$', 'style_set')
)

sitemaps = {
    'selection': SelectionSitemap,
    'announcement': AnnouncementSitemap,
    'author': AuthorSitemap,
    'tag': TagSitemap
}

urlpatterns += patterns('django.contrib.sitemaps.views',
    (r'^sitemap.xml$', 'index', {'sitemaps': sitemaps}),
    (r'^sitemap-(?P<section>.+).xml$', 'sitemap', {'sitemaps': sitemaps}),
)

urlpatterns += patterns('',
    (r'^feed/$', FullFeed()),
)

urlpatterns += patterns('anthologist.views',
    (r'^$', 'home'),
    (r'^selections/$', 'all_selections'),
    (r'^selections/(?P<sel_slug>[\w-]+)/$', 'selection'),
    (r'^announcements/$', 'all_announcements'),
    (r'^announcements/(?P<ann_slug>[\w-]+)/$', 'announcement'),
    (r'^timeline/$', 'timeline'),
    (r'^resources/$', 'resource'),
    (r'^contribute/$', 'contribute'),
    (r'^thanks/$', 'thanks'),
    (r'^browse/$', 'browse'),
    (r'^(?P<tag_type>[\w-]+)/(?P<tag_slug>[\w-]+)/$', 'tag'),
    (r'^(?P<category>[\w-]+)/$', 'category'),
)
