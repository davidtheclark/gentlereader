from django.db import models
from django.utils.safestring import mark_safe


def applyBCE(yr):
    if yr < 0:
        return str(abs(yr)) + '&nbsp;<span class="bce">bce</span>'
    else:
        return str(yr)


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
        birth = ''
        if self.birth_modifier:
            birth += self.birth_modifier + '&nbsp;'
        birth += applyBCE(self.birth_year)
        date_content.append(birth)
        if self.death_year:
            date_content.append('-')
            death = ''
            if self.death_modifier:
                death += self.death_modifier + '&nbsp;'
            death += applyBCE(self.death_year)
            date_content.append(death)
        result = ' '.join(date_content)
        return mark_safe(result)

    def __unicode__(self):
        return self.full_name()

    def get_category(self):
        return 'authors'

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

    def list_item(self):
        return dict(
            id = self.id,
            slug = self.slug,
            last_name = self.last_name,
            full_name = self.full_name(),
            dates = self.dates(),
            birth_year = self.birth_year
        )

    def closure(self):
        author = self.toJSON()
        author['nations'] = [ nation.toJSON() for nation in self.nations.all() ]
        return author
