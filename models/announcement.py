from django.db import models

#from http://stackoverflow.com/questions/250357/smart-truncate-in-python
def smart_truncate(content, length=400, suffix=' ...'):
    if len(content) <= length:
        return content
    else:
        return content[:length].rsplit(' ', 1)[0] + suffix

class Announcement(models.Model):
    class Meta:
        ordering = ['-date_entered']
        app_label = 'anthologist'
        
    date_entered = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=500, null=True)
    slug = models.SlugField(unique=True)
    text = models.TextField(null=True)
    
    def __unicode__(self):
        return self.title
    
    def class_name(self):
        return 'Announcement'
        #Used to distinguish Announcements from Selections on the homepage, so that the lists can be merged
        #but each instance is given a template corresponding to its model (not the same one for every instance).
    
    def toJSON(self):
        return dict(
            id = 'a' + str(self.id),
            date_entered = self.date_entered.strftime("%d %B %Y, %H:%M"),
            date_entered_microdata = self.date_entered.isoformat(),
            title = self.title,
            slug = self.slug,
            class_name = self.class_name(),
            teaser = smart_truncate(self.text)
        )
    
    def closure(self):
        return self.toJSON()