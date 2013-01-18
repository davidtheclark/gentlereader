from django.db import models
from anthologist.models import Author, Source, Selection

TAG_TYPES = [
    (1, 'nation'), (2, 'language'),
    (3, 'form'), (4, 'genre'),
    (5, 'context'), (6, 'topic'),
    (7, 'style')             
]

class DictionarySource(models.Model):
    class Meta:
        app_label = 'anthologist'
        
    name = models.CharField(max_length=200)
    link = models.URLField(max_length=255, blank=True, null=True)
    
    def __unicode__(self):
        return self.name

class Tag(models.Model):     
    class Meta:
        ordering = ['name']
        app_label = 'anthologist'
        
    name = models.CharField(max_length=100, help_text="Lowercase unless it's a proper noun. No punctuation.")  
    slug = models.SlugField(unique=True, help_text="Exclude initial articles and punctuation. Use lowercase and hyphenate.")
    tag_type = models.IntegerField(choices=TAG_TYPES)
    info_url = models.URLField(max_length=255, blank=True, null=True, help_text="Typically a Wikipedia article.")
    definition = models.TextField(blank=True, null=True, help_text="Dictionary definition(s). If the defined word is not the tag, wrap it in &lt;b class=\"def-altword\"&gt;. Wrap actual definitions in &lt;ul&gt; and &lt;li&gt; elements.")
    dictionary_source = models.ForeignKey('DictionarySource', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    
    def __unicode__(self):
        return self.name
    
    #Test whether the tag is currently attached (author to source, topic to selection, etc.).
    def is_active(self):
        if (self.tag_type == 1 and len(Author.objects.filter(nations=self)) != 0) or \
           (self.tag_type == 2 and len(Source.objects.filter(language=self)) != 0) or \
           (self.tag_type == 3 and len(Source.objects.filter(forms=self)) != 0) or \
           (self.tag_type == 4 and len(Selection.objects.filter(genres=self)) != 0) or \
           (self.tag_type == 5 and len(Selection.objects.filter(contexts=self)) != 0) or \
           (self.tag_type == 6 and len(Selection.objects.filter(topics=self)) != 0) or \
           (self.tag_type == 7 and len(Selection.objects.filter(styles=self)) != 0):
            return True
        else:
            return False             
        
    def toJSON(self):
        return dict(
          id = self.id,
          name = self.name,
          slug = self.slug,
          tag_type = self.tag_type,
          tag_type_display = self.get_tag_type_display(),       
        )
        
class Objects():
    def __init__(self, tag_type):
        self.tag_type = tag_type
    def filter(self, **kwargs):
        kwargs['tag_type'] = self.tag_type
        return Tag.objects.filter(**kwargs)
    def create(self, **kwargs):
        kwargs['tag_type'] = self.tag_type
        return Tag.objects.create(**kwargs)
    def get(self, **kwargs):
        kwargs['tag_type'] = self.tag_type
        return Tag.objects.get(**kwargs)
    def all(self):     
        return Tag.objects.filter(tag_type=self.tag_type)

class Nation(): objects = Objects(1)
class Language(): objects = Objects(2)
class Form(): objects = Objects(3)
class Genre(): objects = Objects(4)
class Context(): objects = Objects(5)
class Topic(): objects = Objects(6)
class Style(): objects = Objects(7)