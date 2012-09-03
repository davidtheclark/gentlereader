# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Tag'
        db.create_table(u'anthologist_tag', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('tag_type', self.gf('django.db.models.fields.IntegerField')()),
            ('info_url', self.gf('django.db.models.fields.URLField')(max_length=255, null=True, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal(u'anthologist', ['Tag'])

        # Adding model 'Author'
        db.create_table(u'anthologist_author', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('last_name', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('first_name', self.gf('django.db.models.fields.CharField')(max_length=30, null=True, blank=True)),
            ('birth_year', self.gf('django.db.models.fields.IntegerField')(max_length=4)),
            ('birth_modifier', self.gf('django.db.models.fields.CharField')(max_length=10, null=True, blank=True)),
            ('death_year', self.gf('django.db.models.fields.IntegerField')(max_length=4, null=True, blank=True)),
            ('death_modifier', self.gf('django.db.models.fields.CharField')(max_length=10, null=True, blank=True)),
            ('info_url', self.gf('django.db.models.fields.URLField')(max_length=255, null=True, blank=True)),
        ))
        db.send_create_signal(u'anthologist', ['Author'])

        # Adding M2M table for field nations on 'Author'
        db.create_table(u'anthologist_author_nations', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('author', models.ForeignKey(orm[u'anthologist.author'], null=False)),
            ('tag', models.ForeignKey(orm[u'anthologist.tag'], null=False))
        ))
        db.create_unique(u'anthologist_author_nations', ['author_id', 'tag_id'])

        # Adding model 'Source'
        db.create_table(u'anthologist_source', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('author', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['anthologist.Author'])),
            ('section_title', self.gf('django.db.models.fields.CharField')(max_length=500, null=True, blank=True)),
            ('volume_title', self.gf('django.db.models.fields.CharField')(max_length=500, null=True, blank=True)),
            ('language', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='language_sources', null=True, to=orm['anthologist.Tag'])),
            ('translator', self.gf('django.db.models.fields.CharField')(max_length=60, null=True, blank=True)),
            ('translation_year', self.gf('django.db.models.fields.IntegerField')(max_length=4, null=True, blank=True)),
            ('pub_year', self.gf('django.db.models.fields.IntegerField')(max_length=4)),
            ('pub_year_modifier', self.gf('django.db.models.fields.CharField')(max_length=10, null=True, blank=True)),
            ('digital_text', self.gf('django.db.models.fields.URLField')(max_length=255, null=True, blank=True)),
            ('scanned_text', self.gf('django.db.models.fields.URLField')(max_length=255, null=True, blank=True)),
            ('info_url', self.gf('django.db.models.fields.URLField')(max_length=255, null=True, blank=True)),
        ))
        db.send_create_signal(u'anthologist', ['Source'])

        # Adding M2M table for field forms on 'Source'
        db.create_table(u'anthologist_source_forms', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('source', models.ForeignKey(orm[u'anthologist.source'], null=False)),
            ('tag', models.ForeignKey(orm[u'anthologist.tag'], null=False))
        ))
        db.create_unique(u'anthologist_source_forms', ['source_id', 'tag_id'])

        # Adding model 'Selection'
        db.create_table(u'anthologist_selection', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('date_entered', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('date_modified', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('text', self.gf('django.db.models.fields.TextField')(null=True)),
            ('teaser', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('comment', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('source', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['anthologist.Source'])),
            ('excerpt', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('selection_title', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
        ))
        db.send_create_signal(u'anthologist', ['Selection'])

        # Adding M2M table for field genres on 'Selection'
        db.create_table(u'anthologist_selection_genres', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('selection', models.ForeignKey(orm[u'anthologist.selection'], null=False)),
            ('tag', models.ForeignKey(orm[u'anthologist.tag'], null=False))
        ))
        db.create_unique(u'anthologist_selection_genres', ['selection_id', 'tag_id'])

        # Adding M2M table for field contexts on 'Selection'
        db.create_table(u'anthologist_selection_contexts', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('selection', models.ForeignKey(orm[u'anthologist.selection'], null=False)),
            ('tag', models.ForeignKey(orm[u'anthologist.tag'], null=False))
        ))
        db.create_unique(u'anthologist_selection_contexts', ['selection_id', 'tag_id'])

        # Adding M2M table for field topics on 'Selection'
        db.create_table(u'anthologist_selection_topics', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('selection', models.ForeignKey(orm[u'anthologist.selection'], null=False)),
            ('tag', models.ForeignKey(orm[u'anthologist.tag'], null=False))
        ))
        db.create_unique(u'anthologist_selection_topics', ['selection_id', 'tag_id'])

        # Adding M2M table for field styles on 'Selection'
        db.create_table(u'anthologist_selection_styles', (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('selection', models.ForeignKey(orm[u'anthologist.selection'], null=False)),
            ('tag', models.ForeignKey(orm[u'anthologist.tag'], null=False))
        ))
        db.create_unique(u'anthologist_selection_styles', ['selection_id', 'tag_id'])

        # Adding model 'Quotation'
        db.create_table(u'anthologist_quotation', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('selection', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['anthologist.Selection'])),
            ('quotation', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'anthologist', ['Quotation'])

        # Adding model 'Announcement'
        db.create_table(u'anthologist_announcement', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('date', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=500, null=True)),
            ('text', self.gf('django.db.models.fields.TextField')(null=True)),
        ))
        db.send_create_signal(u'anthologist', ['Announcement'])


    def backwards(self, orm):
        # Deleting model 'Tag'
        db.delete_table(u'anthologist_tag')

        # Deleting model 'Author'
        db.delete_table(u'anthologist_author')

        # Removing M2M table for field nations on 'Author'
        db.delete_table('anthologist_author_nations')

        # Deleting model 'Source'
        db.delete_table(u'anthologist_source')

        # Removing M2M table for field forms on 'Source'
        db.delete_table('anthologist_source_forms')

        # Deleting model 'Selection'
        db.delete_table(u'anthologist_selection')

        # Removing M2M table for field genres on 'Selection'
        db.delete_table('anthologist_selection_genres')

        # Removing M2M table for field contexts on 'Selection'
        db.delete_table('anthologist_selection_contexts')

        # Removing M2M table for field topics on 'Selection'
        db.delete_table('anthologist_selection_topics')

        # Removing M2M table for field styles on 'Selection'
        db.delete_table('anthologist_selection_styles')

        # Deleting model 'Quotation'
        db.delete_table(u'anthologist_quotation')

        # Deleting model 'Announcement'
        db.delete_table(u'anthologist_announcement')


    models = {
        u'anthologist.announcement': {
            'Meta': {'object_name': 'Announcement'},
            'date': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'text': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True'})
        },
        u'anthologist.author': {
            'Meta': {'object_name': 'Author'},
            'birth_modifier': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'birth_year': ('django.db.models.fields.IntegerField', [], {'max_length': '4'}),
            'death_modifier': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'death_year': ('django.db.models.fields.IntegerField', [], {'max_length': '4', 'null': 'True', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'info_url': ('django.db.models.fields.URLField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'nations': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'nation_authors'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['anthologist.Tag']"})
        },
        u'anthologist.quotation': {
            'Meta': {'object_name': 'Quotation'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'quotation': ('django.db.models.fields.TextField', [], {}),
            'selection': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['anthologist.Selection']"})
        },
        u'anthologist.selection': {
            'Meta': {'object_name': 'Selection'},
            'comment': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'contexts': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "'context_selections'", 'blank': 'True', 'to': u"orm['anthologist.Tag']"}),
            'date_entered': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'date_modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'excerpt': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'genres': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "'genre_selections'", 'blank': 'True', 'to': u"orm['anthologist.Tag']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'selection_title': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'source': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['anthologist.Source']"}),
            'styles': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "'style_selections'", 'blank': 'True', 'to': u"orm['anthologist.Tag']"}),
            'teaser': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'text': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'topics': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "'topic_selections'", 'blank': 'True', 'to': u"orm['anthologist.Tag']"})
        },
        u'anthologist.source': {
            'Meta': {'object_name': 'Source'},
            'author': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['anthologist.Author']"}),
            'digital_text': ('django.db.models.fields.URLField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'forms': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'form_sources'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['anthologist.Tag']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'info_url': ('django.db.models.fields.URLField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'language': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'language_sources'", 'null': 'True', 'to': u"orm['anthologist.Tag']"}),
            'pub_year': ('django.db.models.fields.IntegerField', [], {'max_length': '4'}),
            'pub_year_modifier': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'scanned_text': ('django.db.models.fields.URLField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'section_title': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'translation_year': ('django.db.models.fields.IntegerField', [], {'max_length': '4', 'null': 'True', 'blank': 'True'}),
            'translator': ('django.db.models.fields.CharField', [], {'max_length': '60', 'null': 'True', 'blank': 'True'}),
            'volume_title': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'})
        },
        u'anthologist.tag': {
            'Meta': {'object_name': 'Tag'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'info_url': ('django.db.models.fields.URLField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'tag_type': ('django.db.models.fields.IntegerField', [], {})
        }
    }

    complete_apps = ['anthologist']