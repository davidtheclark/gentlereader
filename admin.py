from anthologist.models import Nation, Language, Form, Genre, Context, Topic, Style, Author, Source, Selection, Quotation, Tag, ExternalLink, ExternalLinkCategory, Image, Announcement, DictionarySource
from django.contrib import admin
from django import forms
from django.forms import ModelForm, Textarea

#author

n = { 
    'nations': Nation
}

class AuthorForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(AuthorForm, self).__init__(*args, **kwargs)
        
        for key, value in n.iteritems():
            tags = value.objects.all()
            fld = self.fields[key].widget
            fld.choices = [ (tag.id, tag.__unicode__()) for tag in tags ]

class AuthorAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Name', {'fields': ['last_name', 'first_name', 'slug']}),
        ('Dates', {'fields': ['birth_year', 'birth_modifier', 'death_year', 'death_modifier']}),
        ('Other', {'fields': ['gender', 'nations', 'info_url']})
    ]
    filter_horizontal = [ fld for fld in n.keys() ]
    form = AuthorForm
    
    list_display = ('__unicode__',)
    search_fields = ['last_name', 'first_name', 'nations__name']
    list_filter = ['nations__name']


#source

s = {
    'language': Language,  
    'forms': Form
}

class SourceForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(SourceForm, self).__init__(*args, **kwargs)
        
        for key, value in s.iteritems():
            tags = value.objects.all()
            fld = self.fields[key].widget
            fld.choices = [ (tag.id, tag.__unicode__()) for tag in tags ]
            
class SourceAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Vitals', {'fields': ['author', 'section_title', 'volume_title', 'forms']}),
        ('Publication', {'fields': ['pub_year', 'pub_year_modifier', 'language', 'translator', 'translation_year']}),
        ('Links', {'fields': ['digital_text', 'scanned_text', 'info_url']})
    ]   
    
    filter_horizontal = ['forms']
    form = SourceForm
     
    list_display = ('__unicode__',)
    search_fields = ['author__last_name', 'author__first_name', 'section_title', 'volume_title', 'language']
    list_filter = ['author__last_name', 'language']


#selection

class QuotationInline(admin.TabularInline):
    model = Quotation
    extra = 3

m = { 
    'genres': Genre, 
    'contexts': Context,
    'topics': Topic,
    'styles': Style 
}

class SelectionForm(forms.ModelForm):
    class Meta:
        widgets = { 'text': Textarea(attrs={ 'cols': 85, 'rows': 50 })}
        
    def __init__(self, *args, **kwargs):
        super(SelectionForm, self).__init__(*args, **kwargs)
        
        for key, value in m.iteritems():
            tags = value.objects.all()
            fld = self.fields[key].widget
            fld.choices = [ (tag.id, tag.__unicode__()) for tag in tags ]

class ImageInline(admin.StackedInline):
    model = Image
    extra = 1

class SelectionAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Text', { 'fields': [ 'text', 'teaser' ] }),
        ('Vitals', { 'fields': [ 'selection_title', 'source', 'slug', 'excerpt', 'comment_intro', 'comment_text', 'stylesheet' ] }),
        ('Tags', { 'fields': [ 'genres', 'contexts', 'topics', 'styles' ] })
    ]
    filter_horizontal = [ fld for fld in m.keys() ]
    form = SelectionForm
    inlines = [QuotationInline, ImageInline]
        
    search_fields = ('text', 'source__author__last_name', 'source__author__first_name', 'source__volume_title', 'source__section_title', 'selection_title')
    list_display = ('author', '__unicode__', 'shortened_passage', 'date_entered')


class TagAdmin(admin.ModelAdmin):
    search_fields = [ 'name', 'definition', 'description' ]
    list_display = ('name', 'tag_type', 'definition', 'description', 'info_url')

class ExternalLinkAdmin(admin.ModelAdmin):
    search_fields = [ 'name', 'url', 'category', 'description', ]
    list_display = ( 'name', 'category', 'description', 'url', 'date_entered' )

class AnnouncementForm(forms.ModelForm):
    class Meta:
        widgets = { 'text': Textarea(attrs={ 'cols': 85, 'rows': 50 })}

class AnnouncementAdmin(admin.ModelAdmin):
    form = AnnouncementForm


admin.site.register(Author, AuthorAdmin)
admin.site.register(Source, SourceAdmin)
admin.site.register(Selection, SelectionAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(DictionarySource)
admin.site.register(ExternalLink, ExternalLinkAdmin)
admin.site.register(ExternalLinkCategory)
admin.site.register(Announcement, AnnouncementAdmin)

