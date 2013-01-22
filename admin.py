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
    
    def clean(self):
        cleaned_data = super(SourceForm, self).clean()
        section_title = cleaned_data.get("section_title")
        volume_title = cleaned_data.get("volume_title")
        if not section_title and not volume_title:
            raise forms.ValidationError("You must enter either a 'Volume title' or a 'Section title'.")
        lang = cleaned_data.get("language").name
        translator = cleaned_data.get("translator")
        trans_year = cleaned_data.get("translation_year")
        # 21 is the pl for "English"
        if lang != "English" and not translator:
            raise forms.ValidationError("If the original 'Language' is not English, you must designate a 'Translator'.")
        if lang != "English" and not trans_year:
            raise forms.ValidationError("If the original 'Language' is not English, you must designate a 'Translation year'.")
        return cleaned_data
            
class SourceAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Vitals', {'fields': ['author', 'section_title', 'volume_title', 'forms']}),
        ('Publication', {'fields': ['pub_year', 'pub_year_modifier', 'language', 'translator', 'translation_year']}),
        ('Links', {'fields': ['digital_text', 'scanned_text', 'info_url']})
    ]   
    
    filter_horizontal = ['forms']
    form = SourceForm
     
    list_display = ('__unicode__',)
    search_fields = ['author__last_name', 'author__first_name', 'section_title', 'volume_title']
    list_filter = ['author__last_name']


#selection

class QuotationInlineFormset(forms.models.BaseInlineFormSet):
    def clean(self):
        count = 0
        for form in self.forms:
            try:
                if form.cleaned_data:
                    count += 1
            except AttributeError:
                pass
        if count < 1:
            raise forms.ValidationError("You must enter at least one quotation.")

class QuotationInline(admin.TabularInline):
    model = Quotation
    extra = 3
    formset = QuotationInlineFormset

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
    
    def clean(self):
        cleaned_data = super(SelectionForm, self).clean()
        selection_title = cleaned_data.get("selection_title")
        from_section = cleaned_data.get("from_section")
        excerpt = cleaned_data.get("excerpt")
        if from_section and not selection_title:
            raise forms.ValidationError("If you've entered a 'From section' value, you must also enter a 'Selection title'.")
        if from_section and not excerpt:
            raise forms.ValidationError("If you've entered a 'From section' value, the selection must be designated an 'Excerpt'.")
        return cleaned_data

class ImageInline(admin.StackedInline):
    model = Image
    extra = 1

class SelectionAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Text', { 'fields': [ 'text', 'teaser' ] }),
        ('Vitals', { 'fields': [ 'selection_title', 'source', 'slug', 'excerpt', 'from_section', 'comment_intro', 'comment_text', 'stylesheet' ] }),
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

