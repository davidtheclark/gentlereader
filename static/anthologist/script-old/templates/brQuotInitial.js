require.config({paths:{jade:'/static/anthologist/js/libraries/jade-runtime'},shim:{jade:{exports:'jade'}}});
define(['jade'],function(jade){
function brQuotInitial(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
// iterate locals
;(function(){
  if ('number' == typeof locals.length) {

    for (var $index = 0, $$l = locals.length; $index < $$l; $index++) {
      var q = locals[$index];

buf.push('\n<section class="sel-block">\n  <h3><span class="header-from">from&nbsp;</span><a');
buf.push(attrs({ 'href':("/selections/" + (q.selection.slug) + "") }, {"href":true}));
buf.push('>"' + escape((interp = q.selection.title) == null ? '' : interp) + '"');
 var title = q.selection.title
if ( title.charAt(title.length - 1) != '?')
{
buf.push(',');
}
buf.push('&nbsp;by ' + escape((interp = q.selection.author) == null ? '' : interp) + '&nbsp;<span class="sel-dates">(' + escape((interp = q.selection.pub_year) == null ? '' : interp) + ')</span></a></h3>\n  <ul class="quotation-list">\n    <li class="quotation-list-item"><span class="quotation-marker">&#8220;</span><a');
buf.push(attrs({ 'href':("/highlights/" + (q.quotation.id) + ""), "class": ('quotation-text') + ' ' + ('random-quot') }, {"href":true}));
buf.push('>');
var __val__ = q.quotation.quotation
buf.push(null == __val__ ? "" : __val__);
buf.push('</a></li>\n  </ul>\n  <div class="read-more"><a');
buf.push(attrs({ 'href':("/selections/" + (q.selection.slug) + "") }, {"href":true}));
buf.push('>read this full selection &raquo;</a><a');
buf.push(attrs({ 'href':("/highlights/#author/" + (q.selection.author_id) + "") }, {"href":true}));
buf.push('>+ more highlights from ' + escape((interp = q.selection.author) == null ? '' : interp) + '</a></div>\n</section>');
    }

  } else {
    var $$l = 0;
    for (var $index in locals) {
      $$l++;      var q = locals[$index];

buf.push('\n<section class="sel-block">\n  <h3><span class="header-from">from&nbsp;</span><a');
buf.push(attrs({ 'href':("/selections/" + (q.selection.slug) + "") }, {"href":true}));
buf.push('>"' + escape((interp = q.selection.title) == null ? '' : interp) + '"');
 var title = q.selection.title
if ( title.charAt(title.length - 1) != '?')
{
buf.push(',');
}
buf.push('&nbsp;by ' + escape((interp = q.selection.author) == null ? '' : interp) + '&nbsp;<span class="sel-dates">(' + escape((interp = q.selection.pub_year) == null ? '' : interp) + ')</span></a></h3>\n  <ul class="quotation-list">\n    <li class="quotation-list-item"><span class="quotation-marker">&#8220;</span><a');
buf.push(attrs({ 'href':("/highlights/" + (q.quotation.id) + ""), "class": ('quotation-text') + ' ' + ('random-quot') }, {"href":true}));
buf.push('>');
var __val__ = q.quotation.quotation
buf.push(null == __val__ ? "" : __val__);
buf.push('</a></li>\n  </ul>\n  <div class="read-more"><a');
buf.push(attrs({ 'href':("/selections/" + (q.selection.slug) + "") }, {"href":true}));
buf.push('>read this full selection &raquo;</a><a');
buf.push(attrs({ 'href':("/highlights/#author/" + (q.selection.author_id) + "") }, {"href":true}));
buf.push('>+ more highlights from ' + escape((interp = q.selection.author) == null ? '' : interp) + '</a></div>\n</section>');
    }

  }
}).call(this);

}
return buf.join("");
}return brQuotInitial});