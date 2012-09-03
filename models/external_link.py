from django.db import models

class ExternalLinkCategory(models.Model):
    class Meta:
        app_label = 'anthologist'
    
    name = models.CharField(max_length=500, null=True)
    description = models.TextField(blank=True, null=True)
    weight = models.IntegerField(max_length=2)
    
    def __unicode__(self):
        return self.name        
    
class ExternalLink(models.Model):
    class Meta:
        ordering = ['name']
        app_label = 'anthologist'
        
    name = models.CharField(max_length=500, null=True)
    url = models.URLField(max_length=255, null=True)
    category = models.ForeignKey('ExternalLinkCategory')
    description = models.TextField(blank=True, null=True)
    date_entered = models.DateTimeField(auto_now_add=True)
    
    def __unicode__(self):
        return self.name