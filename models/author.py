from django.db import models
from django.utils.safestring import mark_safe

class Author(models.Model):
    class Meta:
        ordering = ['last_name']
        app_label = 'anthologist'
        
    GENDER_CHOICES = (
        (1, 'male'),
        (2, 'female')
    )
        
    last_name = models.CharField(max_length=30, help_text="Or only name.")
    first_name = models.CharField(max_length=30, blank=True, null=True, help_text="Followed by middle initial, when relevant.")
    birth_year = models.IntegerField(max_length=4, help_text="Or approximate year of existence.")
    birth_modifier = models.CharField(max_length=10, blank=True, null=True, help_text="According to Wikipedia Style: c. (approximate); before; after; etc.")
    death_year = models.IntegerField(max_length=4, blank=True, null=True)
    death_modifier = models.CharField(max_length=10, blank=True, null=True, help_text="According to Wikipedia Style: c. (approximate); before; after; etc.")
    gender = models.IntegerField(choices=GENDER_CHOICES, default=1)
    nations = models.ManyToManyField('Tag', related_name='nation_authors', blank=True, null=True)
    info_url = models.URLField(max_length=255, blank=True, null=True, help_text="Typically a Wikipedia article.")
    slug = models.SlugField(unique=True, help_text="Exclude initial articles and punctuation. Use lowercase and hyphenate. Use only last name if it is distinctive; otherwise, first then last.")
    
    #Test whether the author is attached to a source
    def is_active(self):
        if len(self.source_set.all()) != 0 and len(self.source_set.all()[0].selection_set.all()) != 0:
            return True
        else:
            return False
        
    def full_name(self):
        name_content = list()
        if self.first_name:
            name_content.append(self.first_name)
        name_content.append(self.last_name)
        result = ' '.join(name_content)
        return mark_safe(result)
    
    def dates(self):
        date_content = list()
        if self.birth_modifier:
            date_content.append(self.birth_modifier)
        #BCE years are entered as negative integers, for ordering, but need to display as positive integers with BCE label.
        if self.birth_year < 0:
            yr = str(abs(self.birth_year)) + ' <span class="bce">bce</span>'
        else:
            yr = str(self.birth_year)
        date_content.append(yr)
        if self.death_year:
            date_content.append('-')
            if self.death_modifier:
                date_content.append(self.death_modifier)
            date_content.append(str(self.death_year))
        result = ' '.join(date_content)
        return mark_safe(result)
        
    def __unicode__(self):
        return self.full_name()

    def toJSON(self):
        return dict(
            id = self.id,
            last_name = self.last_name,
            first_name = self.first_name,
            birth_year = self.birth_year,
            birth_modifier = self.birth_modifier,
            death_year = self.death_year,
            death_modifier = self.death_modifier,
            gender = self.gender,
            info_url = self.info_url,
            slug = self.slug,
            full_name = self.full_name(),
            dates = self.dates(),
            #For the "browse" page
            tag_type_display = 'author'
        )
        
    def closure(self):
        author = self.toJSON()
        author['nations'] = [ nation.toJSON() for nation in self.nations.all() ]
        return author
