require.config({paths:{jade:'/static/anthologist/js/libraries/jade-runtime'},shim:{jade:{exports:'jade'}}});
define(['jade'],function(jade){
function sourceListItem(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('\n<li><a');
buf.push(attrs({ 'href':("/authors/" + (author.slug) + ""), "class": ('source-author') }, {"href":true}));
buf.push('>');
var __val__ = author.last_name
buf.push(escape(null == __val__ ? "" : __val__));
if ( author.first_name)
{
buf.push(', ' + escape((interp = author.first_name) == null ? '' : interp) + '');
if ( author.first_name.substring(author.first_name.length-1) != '.')
{
buf.push('.');
}
}
else
{
buf.push('.');
}
buf.push('&nbsp;</a>' + ((interp = full_title) == null ? '' : interp) + '.&nbsp;<a');
buf.push(attrs({ 'href':("/timeline/#" + (pub_year) + ""), "class": ('source-date') }, {"href":true}));
buf.push('>');
var __val__ = date_display
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a>.&nbsp;');
if ( translator)
{
buf.push('Trans. <span class="source-translator">');
var __val__ = translator
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>, <span class="source-translation-year">');
var __val__ = translation_year
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>. ');
}
buf.push('\n  <ul class="source-inner-list">\n    <li>');
if ( selections.length > 1)
{
buf.push('Selections:&nbsp;');
}
else
{
buf.push('Selection:&nbsp;');
}
buf.push('\n      <ul class="source-selection-list">');
// iterate selections
;(function(){
  if ('number' == typeof selections.length) {

    for (var $index = 0, $$l = selections.length; $index < $$l; $index++) {
      var sel = selections[$index];

buf.push('\n        <li><a');
buf.push(attrs({ 'href':("/selections/" + (sel.slug) + "") }, {"href":true}));
buf.push('>');
var __val__ = sel.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
    }

  } else {
    var $$l = 0;
    for (var $index in selections) {
      $$l++;      var sel = selections[$index];

buf.push('\n        <li><a');
buf.push(attrs({ 'href':("/selections/" + (sel.slug) + "") }, {"href":true}));
buf.push('>');
var __val__ = sel.title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></li>');
    }

  }
}).call(this);

buf.push('\n      </ul>\n    </li>\n    <li>Follow-up:&nbsp;');
if ( scanned_text)
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (scanned_text) + ""), 'target':("_blank"), "class": ('source-link') }, {"href":true,"target":true}));
buf.push('>[scanned text] </a>');
}
if ( digital_text)
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (digital_text) + ""), 'target':("_blank"), "class": ('source-link') }, {"href":true,"target":true}));
buf.push('>[digital text] </a>');
}
if ( info_url)
{
buf.push('<a');
buf.push(attrs({ 'href':("" + (info_url) + ""), 'target':("_blank"), "class": ('source-link') }, {"href":true,"target":true}));
buf.push('>[information] </a>');
}
buf.push('\n    </li>\n  </ul>\n</li>');
}
return buf.join("");
}return sourceListItem});