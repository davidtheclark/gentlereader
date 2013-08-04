require.config({paths:{jade:'/static/gentlereader/scripts/lib/jade-runtime'},shim:{jade:{exports:'jade'}}});
define(['jade'],function(jade){
function brQuotRandomTempl(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('\n<h2 class="hl-random-h">A Few at Random</h2>');
// iterate locals
;(function(){
  if ('number' == typeof locals.length) {

    for (var $index = 0, $$l = locals.length; $index < $$l; $index++) {
      var q = locals[$index];

buf.push('\n<section class="hl-sel-block">\n  <h3 class="hl-subhead"><span class="header-from">from&nbsp;</span><a');
buf.push(attrs({ 'href':("/selections/" + (q.selection.slug) + "") }, {"href":true}));
buf.push('>&ldquo;' + escape((interp = q.selection.title) == null ? '' : interp) + '');
 var title = q.selection.title
if ( title.charAt(title.length - 1) != '?&rdquo;')
{
buf.push(',&rdquo;');
}
buf.push('&nbsp;by ' + escape((interp = q.selection.author) == null ? '' : interp) + '&nbsp;<span class="hl-sel-dates">(' + escape((interp = q.selection.pub_year) == null ? '' : interp) + ')</span></a></h3>\n  <ul>\n    <li class="hl-i">\n      <div class="hl-quotationmark">&#8220;</div><a');
buf.push(attrs({ 'href':("/highlights/" + (q.quotation.id) + ""), "class": ('hl-quote') + ' ' + ('hl-random') }, {"href":true}));
buf.push('>');
var __val__ = q.quotation.quotation
buf.push(null == __val__ ? "" : __val__);
buf.push('</a>\n    </li>\n  </ul>\n  <div class="hl-more"><a');
buf.push(attrs({ 'href':("/selections/" + (q.selection.slug) + "") }, {"href":true}));
buf.push('>read this full selection &raquo;</a><br/><a');
buf.push(attrs({ 'href':("/highlights/#" + (q.selection.author_slug) + "") }, {"href":true}));
buf.push('>+ more highlights from ' + escape((interp = q.selection.author) == null ? '' : interp) + '</a></div>\n</section>');
    }

  } else {
    var $$l = 0;
    for (var $index in locals) {
      $$l++;      var q = locals[$index];

buf.push('\n<section class="hl-sel-block">\n  <h3 class="hl-subhead"><span class="header-from">from&nbsp;</span><a');
buf.push(attrs({ 'href':("/selections/" + (q.selection.slug) + "") }, {"href":true}));
buf.push('>&ldquo;' + escape((interp = q.selection.title) == null ? '' : interp) + '');
 var title = q.selection.title
if ( title.charAt(title.length - 1) != '?&rdquo;')
{
buf.push(',&rdquo;');
}
buf.push('&nbsp;by ' + escape((interp = q.selection.author) == null ? '' : interp) + '&nbsp;<span class="hl-sel-dates">(' + escape((interp = q.selection.pub_year) == null ? '' : interp) + ')</span></a></h3>\n  <ul>\n    <li class="hl-i">\n      <div class="hl-quotationmark">&#8220;</div><a');
buf.push(attrs({ 'href':("/highlights/" + (q.quotation.id) + ""), "class": ('hl-quote') + ' ' + ('hl-random') }, {"href":true}));
buf.push('>');
var __val__ = q.quotation.quotation
buf.push(null == __val__ ? "" : __val__);
buf.push('</a>\n    </li>\n  </ul>\n  <div class="hl-more"><a');
buf.push(attrs({ 'href':("/selections/" + (q.selection.slug) + "") }, {"href":true}));
buf.push('>read this full selection &raquo;</a><br/><a');
buf.push(attrs({ 'href':("/highlights/#" + (q.selection.author_slug) + "") }, {"href":true}));
buf.push('>+ more highlights from ' + escape((interp = q.selection.author) == null ? '' : interp) + '</a></div>\n</section>');
    }

  }
}).call(this);

}
return buf.join("");
}return brQuotRandomTempl});