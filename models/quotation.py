from django.db import models

class Quotation(models.Model):
    class Meta:
        app_label = 'anthologist'
        
    selection = models.ForeignKey('Selection')
    quotation = models.TextField()
    
    def __unicode__(self):
        return self.quotation
    
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
        data['selection']['author-slug'] = self.selection.source.author.slug
        data['selection']['author-dates'] = self.selection.source.author.dates()
        data['selection']['source'] = self.selection.__unicode__()
        data['selection']['slug'] = self.selection.slug
        return data