from django.db import models

TAG_TYPES = (
    (1, 'nation'), (2, 'language'),
    (3, 'form'), (4, 'genre'),
    (5, 'context'), (6, 'topic'),
    (7, 'style')             
)

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

        
    name = models.CharField(max_length=100)  
    slug = models.SlugField(unique=True, help_text="Exclude initial articles. Lowercase, hyphenate.")
    tag_type = models.IntegerField(choices=TAG_TYPES)
    info_url = models.URLField(max_length=255, blank=True, null=True)
    definition = models.TextField(blank=True, null=True, help_text="Dictionary definition(s). If the defined word is not the tag, wrap it in &lt;b class=\"def-altword\"&gt;. Wrap actual definitions in &lt;ul&gt; and &lt;li&gt; elements.")
    dictionary_source = models.ForeignKey('DictionarySource', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    
    def __unicode__(self):
        return self.name
        
    def toJSON(self):
        return dict(
          id = self.id,
          name = self.name,
          slug = self.slug,
          tag_type = self.tag_type,
          tag_type_display = self.get_tag_type_display(),
          info_url = self.info_url,
          description = self.description            
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