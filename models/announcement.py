from django.db import models
from django.utils.safestring import mark_safe
from ..utils import dumb_to_smart_quotes

#from http://stackoverflow.com/questions/250357/smart-truncate-in-python
# "suffix" could be used to add ellipsis or something else.


def smart_truncate(content, length=400, suffix=''):
    if len(content) <= length:
        return content
    else:
        return content[:length].rsplit(' ', 1)[0] + suffix


class Announcement(models.Model):
    class Meta:
        ordering = ['-date_entered']
        app_label = 'gentlereader'

    date_entered = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=500, null=True)
    slug = models.SlugField(unique=True, help_text="Exclude initial articles and punctuation. Use lowercase and hyphenate.")
    text = models.TextField(null=True)

    def get_title(self):
        return mark_safe(dumb_to_smart_quotes(self.title))

    def get_teaser(self):
        return mark_safe(smart_truncate(self.text, 400, suffix=''))

    def get_text(self):
        return mark_safe(dumb_to_smart_quotes(self.text))

    def __unicode__(self):
        return self.title

    def class_name(self):
        return 'Announcement'
        #Used to distinguish Announcements from Selections on the homepage, so that the lists can be merged
        #but each list-item is given a template corresponding to its model.

    def toJSON(self):
        return dict(
            id='a' + str(self.id),
            date_entered=self.date_entered.strftime("%d %B %Y, %H:%M"),
            date_entered_microdata=self.date_entered.isoformat(),
            title=self.title,
            slug=self.slug,
            class_name=self.class_name(),
            teaser=smart_truncate(self.text)
        )

    def closure(self):
        return self.toJSON()
