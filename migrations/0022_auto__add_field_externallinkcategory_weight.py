# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'ExternalLinkCategory.weight'
        db.add_column('anthologist_externallinkcategory', 'weight',
                      self.gf('django.db.models.fields.IntegerField')(default=1, max_length=2),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'ExternalLinkCategory.weight'
        db.delete_column('anthologist_externallinkcategory', 'weight')


    models = {
        'anthologist.announcement': {
            'Meta': {'ordering': "['-date_entered']", 'object_name': 'Announcement'},
            'date_entered': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'slug': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            'text': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True'})
        },
        'anthologist.author': {
            'Meta': {'ordering': "['last_name']", 'object_name': 'Author'},
            'birth_modifier': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'birth_year': ('django.db.models.fields.IntegerField', [], {'max_length': '4'}),
            'death_modifier': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'death_year': ('django.db.models.fields.IntegerField', [], {'max_length': '4', 'null': 'True', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True', 'blank': 'True'}),
            'gender': ('django.db.models.fields.IntegerField', [], {'default': '1'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'info_url': ('django.db.models.fields.URLField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'nations': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'nation_authors'", 'null': 'True', 'symmetrical': 'False', 'to': "orm['anthologist.Tag']"}),
            'slug': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'})
        },
        'anthologist.externallink': {
            'Meta': {'ordering': "['name']", 'object_name': 'ExternalLink'},
            'category': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['anthologist.ExternalLinkCategory']"}),
            'date_entered': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '255', 'null': 'True'})
        },
        'anthologist.externallinkcategory': {
            'Meta': {'object_name': 'ExternalLinkCategory'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True'}),
            'weight': ('django.db.models.fields.IntegerField', [], {'max_length': '2'})
        },
        'anthologist.image': {
            'Meta': {'object_name': 'Image'},
            'caption': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'machine_name': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True'}),
            'selection': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['anthologist.Selection']"}),
            'source_url': ('django.db.models.fields.URLField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True'})
        },
        'anthologist.quotation': {
            'Meta': {'object_name': 'Quotation'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'quotation': ('django.db.models.fields.TextField', [], {}),
            'selection': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['anthologist.Selection']"})
        },
        'anthologist.selection': {
            'Meta': {'ordering': "['-date_entered']", 'object_name': 'Selection'},
            'comment_intro': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'comment_text': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'contexts': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "'context_selections'", 'blank': 'True', 'to': "orm['anthologist.Tag']"}),
            'date_entered': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'date_modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'excerpt': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'genres': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "'genre_selections'", 'blank': 'True', 'to': "orm['anthologist.Tag']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'selection_title': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'slug': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            'source': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['anthologist.Source']"}),
            'styles': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "'style_selections'", 'blank': 'True', 'to': "orm['anthologist.Tag']"}),
            'stylesheet': ('django.db.models.fields.SlugField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'teaser': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'text': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'topics': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "'topic_selections'", 'blank': 'True', 'to': "orm['anthologist.Tag']"})
        },
        'anthologist.source': {
            'Meta': {'object_name': 'Source'},
            'author': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['anthologist.Author']"}),
            'digital_text': ('django.db.models.fields.URLField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'forms': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'form_sources'", 'null': 'True', 'symmetrical': 'False', 'to': "orm['anthologist.Tag']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'info_url': ('django.db.models.fields.URLField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'language': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'language_sources'", 'null': 'True', 'to': "orm['anthologist.Tag']"}),
            'pub_year': ('django.db.models.fields.IntegerField', [], {'max_length': '4'}),
            'pub_year_modifier': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            'scanned_text': ('django.db.models.fields.URLField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'section_title': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'translation_year': ('django.db.models.fields.IntegerField', [], {'max_length': '4', 'null': 'True', 'blank': 'True'}),
            'translator': ('django.db.models.fields.CharField', [], {'max_length': '60', 'null': 'True', 'blank': 'True'}),
            'volume_title': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'})
        },
        'anthologist.tag': {
            'Meta': {'ordering': "['name']", 'object_name': 'Tag'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'info_url': ('django.db.models.fields.URLField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'slug': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            'tag_type': ('django.db.models.fields.IntegerField', [], {})
        }
    }

    complete_apps = ['anthologist']