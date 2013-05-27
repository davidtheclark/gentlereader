from django.db import models

class Image(models.Model):
    class Meta:
        app_label = 'gentlereader'

    selection = models.ForeignKey('Selection')
    image = models.CharField(max_length=255, blank=True, null=True, help_text="Max width 425px.")
    machine_name = models.CharField(max_length=500, null=True)
    title = models.CharField(max_length=500, null=True)
    caption = models.TextField(null=True)
    source_url = models.URLField(max_length=255, blank=True, null=True)

    def __unicode__(self):
        return self.machine_name