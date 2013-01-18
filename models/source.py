from django.db import models
from django.utils.safestring import mark_safe

class Source(models.Model):
    class Meta:
        app_label = 'anthologist'

    
    author = models.ForeignKey('Author')
    section_title = models.CharField(max_length=500, blank=True, null=True)
    volume_title = models.CharField(max_length=500, blank=True, null=True,
                                    help_text="Source MUST have either a volume or section title, though neither is independently required.")    
    language = models.ForeignKey('Tag', related_name='language_sources', blank=True, null=True)
    translator = models.CharField(max_length=60, blank=True, null=True, help_text="First then last name.")
    translation_year = models.IntegerField(max_length=4, blank=True, null=True)
    pub_year = models.IntegerField(max_length=4)
    pub_year_modifier = models.CharField(max_length=10, blank=True, null=True,
                                         help_text="According to Wikipedia Style: c. (approximate); before; after; etc.")
    forms = models.ManyToManyField('Tag', related_name='form_sources', blank=True, null=True)
    digital_text = models.URLField(max_length=255, blank=True, null=True)
    scanned_text = models.URLField(max_length=255, blank=True, null=True)
    info_url = models.URLField(max_length=255, blank=True, null=True, help_text="Typically a Wikipedia article.")
    
    def __unicode__(self):
        return self.full_title()
     
    #Test whether the author is attached to a source
    def is_active(self):
        if len(self.selection_set.all()) != 0:
            return True
        else:
            return False
   
    def root_work(self):
        if self.volume_title:
            return '<cite>' + self.volume_title + '</cite>'
        else:
            return '"' + self.section_title + '"'

    def date_display(self):
        date_content = ''
        if self.pub_year_modifier:
            date_content += self.pub_year_modifier + '&nbsp;'
        if self.pub_year < -0:
            yr = str(abs(self.pub_year)) + '&nbsp;<span class="bce">bce</span>'
        else:
            yr = str(self.pub_year)
        date_content += yr
        return mark_safe(date_content)
        
    def full_title(self):
        title_content = list()
        if self.section_title:
            title_content.append('"' + self.section_title + '"')
        if self.section_title and self.volume_title:
            title_content.append('in')
        if self.volume_title:
            title_content.append('<cite>' + self.volume_title + '</cite>')
        result = ' '.join(title_content)
        return mark_safe(result)
    
    def toJSON(self):
        return dict(
            id = self.id,
            section_title = self.section_title,
            volume_title = self.volume_title,    
            translator = self.translator,
            translation_year = self.translation_year,
            pub_year = self.pub_year,
            pub_year_modifier = self.pub_year_modifier,
            date_display = self.date_display(),
            digital_text = self.digital_text,
            scanned_text = self.scanned_text,
            info_url = self.info_url,
            root_work = self.root_work(),
            full_title = self.full_title()
        )
        
    def selections(self):
        sel_set = []
        for sel in self.selection_set.all():
            sel_set.append({ 'title': sel.__unicode__(), 'slug': sel.slug })
        return sel_set
    
    def closure(self):
        source = self.toJSON()
        source['author'] = self.author.closure()
        source['language'] = [ self.language.toJSON() ]
        source['selections'] = self.selections()
        return source