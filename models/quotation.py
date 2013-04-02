from django.db import models
from django.utils.safestring import mark_safe
from ..utils import dumb_to_smart_quotes

class Quotation(models.Model):
    class Meta:
        app_label = 'anthologist'
        
    selection = models.ForeignKey('Selection')
    quotation = models.TextField()
    
    def __unicode__(self):
        return self.quotation
    
    def get_quotation(self):
        return mark_safe(dumb_to_smart_quotes(self.quotation))
    
    def get_source(self):
        sel = self.selection
        sel_title = sel.get_title()
        result = '<a href="/selections/' + sel.slug + '">"' + sel_title
        if sel_title[-1:] != '?':
            result += ','
        result += '" ' + sel.get_author() + '&nbsp;(' + str(sel.source.pub_year) + ')</a>'
        return mark_safe(result)
    
    def is_brief(self):
        if len(self.quotation) <= 450:
            return True
        else:
            return False
    
    def toJSON(self):
        return dict(
            id = self.id,
            quotation = self.quotation
        )
    
    def closure(self):
        data = dict(
            quotation = self.toJSON(),
            selection = dict()
        )
        data['selection']['pub_year'] = self.selection.source.date_display()
        data['selection']['author'] = self.selection.source.author.full_name()
        data['selection']['author_slug'] = self.selection.source.author.slug
        data['selection']['author_dates'] = self.selection.source.author.dates()
        data['selection']['author_id'] = self.selection.source.author.pk
        data['selection']['title'] = self.selection.__unicode__()
        data['selection']['slug'] = self.selection.slug
        return data