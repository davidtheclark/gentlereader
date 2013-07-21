from django.db import models
from django.utils.safestring import mark_safe
from quotation import Quotation
from ..utils import dumb_to_smart_quotes


#utility
def _get_from_display(s, mark):
    """Return a sentence describing the selection's source.
    Return nothing if the source has no selection title
    (which should indicate that the selection
    constitutes a complete short text."""
    if s.selection_title:
        from_section = s.from_section
        source = s.source
        vol = source.volume_title
        result = ''
        if from_section:
            if mark:
                result += '"' + from_section + '" in '
            else:
                result += from_section + ' in '
        if vol:
            if mark:
                result += '<cite>' + vol + '</cite>'
            else:
                result += vol
        else:
            result += '"' + source.section_title + '"'
        return mark_safe(result)
    else:
        return


class Selection(models.Model):
    class Meta:
        ordering = ['-date_entered']
        app_label = 'gentlereader'

    date_entered = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    text = models.TextField(null=True, help_text="For subsections, use &lt;section&gt; tags. For subheadings within the selection, use a &lt;div&gt; element with class 'sel-body-subheading', FOLLOWED BY a &lt;section&gt;.")
    teaser = models.TextField(null=True)
    comment_intro = models.TextField(blank=True, null=True, help_text="Comment to introduce the selection to the reader.")
    comment_text = models.TextField(blank=True, null=True, help_text="Comment to describe the textual source, proofreading, editing, &amp;c.")
    source = models.ForeignKey('Source')
    excerpt = models.BooleanField(help_text="Is the selection an excerpt (checked) or a complete short text (unchecked)?")
    from_section = models.CharField(max_length=100, blank=True, null=True, help_text="IF SELECTION IS AN EXCERPT (and has a selection_title), optionally provide a name for the section (of the source volume) from which it's excerpted. To be displayed as 'selection_title,' from 'from_section'.")
    selection_title = models.CharField(max_length=100, blank=True, null=True,
                                       help_text="A title for the selection, either the title of the section, included in its entirety, of the source volume, or an original title. Necessary if the selection is an excerpt or if the source is just a volume. If the source has a section_title attribute, this field is optional, the selection's title will refer back to the source section.")
    genres = models.ManyToManyField('Tag', related_name='genre_selections', blank=True)
    contexts = models.ManyToManyField('Tag', related_name='context_selections', blank=True)
    topics = models.ManyToManyField('Tag', related_name='topic_selections', blank=True)
    styles = models.ManyToManyField('Tag', related_name='style_selections', blank=True)
    slug = models.SlugField(unique=True, help_text="Use selection title if there is one; otherwise, source title. Exclude initial articles and punctuation. Use lowercase and hyphenate.")
    stylesheet = models.SlugField(blank=True, null=True, help_text="If this selection requires its own accompanying stylesheet, specify the filename -- which should match the selection's slug, unless there's a good reason. Ensure the file is in static/gentlereader/css/selection-specific/.")

    def __unicode__(self):
        """If the source has a selection title provided, return it;
        otherwise, return the section title from the source (which
        would mean that the selection constitutes of the full-text of
        that section)."""
        if self.selection_title:
            return mark_safe(self.selection_title)
        else:
            return mark_safe(self.source.section_title)

    def get_title(self):
        """Return the selection's name with a non-breaking space
        between the last and second-to-last words, to prevent orphans."""
        """words = self.__unicode__().split()
        last_word = len(words) - 1
        title_adj = ''
        for i, word in enumerate(words):
            if i != last_word and i != last_word - 1:
                title_adj += word + ' '
            elif i == last_word - 1:
                title_adj += word + '&nbsp;'
            elif i == last_word:
                title_adj += word
        return mark_safe(title_adj)"""
        # The problem is that 2 long words won't split at a small width
        return mark_safe(self)

    def ends_without_punctuation(self):
        punctuation = "?,.!"
        if self.get_title()[-1] in punctuation:
            return False

    def get_author(self):
        return mark_safe(self.source.author.full_name())

    def shortened_passage(self):
        return r'"' + self.text[:70] + r'..."'

    def from_display(self):
        return mark_safe(_get_from_display(self, True))

    def from_display_safe(self):
        return mark_safe(_get_from_display(self, False))

    def get_teaser(self):
        return mark_safe(dumb_to_smart_quotes(self.teaser))

    def get_comment_text(self):
        return mark_safe(self.comment_text)

    def get_comment_intro(self):
        return mark_safe(self.comment_intro)

    def get_text(self):
        return mark_safe(dumb_to_smart_quotes(self.text))

    def class_name(self):
        """Used to distinguish Announcements from Selections on the homepage, so that the lists can be merged
        #but each list-item is given a template corresponding to its model."""
        return 'Selection'

    def toJSON(self):
        return dict(
            id=self.id,
            date_entered=self.date_entered.strftime("%B %d, %Y"),
            date_modified=self.date_modified.strftime("%d %B %Y, %H:%M"),
            slug=self.slug,
            author=self.get_author(),
            title=self.get_title(),
            from_display=self.from_display(),
            date_display=self.source.date_display(),
            teaser=self.get_teaser()
        )

    def list_item(self):
        selection = self.toJSON();
        selection['date_entered_sort'] = self.date_entered.strftime("%B %d, %Y %H:%M:%S"),
        selection['date_entered_simple'] = self.date_entered.strftime("%d %b %y"),
        s = selection['source'] = {}
        s['pub_year'] = self.source.pub_year
        s['date_display'] = self.source.date_display()
        a = s['author'] = {}
        a['last_name'] = self.source.author.last_name
        a['full_name'] = self.source.author.full_name()
        a['slug'] = self.source.author.slug
        return selection

    def closure(self):
        selection = self.list_item()
        selection['source'] = self.source.closure()
        selection['nations'] = [nation.toJSON() for nation in self.source.author.nations.all()]
        selection['language'] = [self.source.language.toJSON()]
        selection['forms'] = [form.toJSON() for form in self.source.forms.all()]
        selection['contexts'] = [context.toJSON() for context in self.contexts.all()]
        selection['genres'] = [genre.toJSON() for genre in self.genres.all()]
        selection['topics'] = [topic.toJSON() for topic in self.topics.all()]
        selection['styles'] = [style.toJSON() for style in self.styles.all()]
        return selection

    def with_quotations(self):
        sel = dict(
            date_display=self.source.date_display(),
            id=self.id,
            date_entered=self.date_entered.strftime("%d %B %Y, %H:%M"),
            excerpt=self.excerpt,
            selection_title=self.selection_title,
            slug=self.slug,
            source_display=self.source.full_title(),
            title=self.__unicode__(),
        )
        sel['quotations'] = [q.toJSON() for q in Quotation.objects.filter(selection=self).order_by('?')]
        return sel
