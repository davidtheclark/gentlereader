require.config({paths:{jade:'/static/gentlereader/scripts/lib/jade-runtime'},shim:{jade:{exports:'jade'}}});
define(['jade'],function(jade){
function brQuotAuthTempl(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('\n<h2 id="highlight-author" class="highlight-author-h"><span class="header-from">from&nbsp;</span><a');
buf.push(attrs({ 'href':('/authors/' + (author.slug) + '') }, {"href":true}));
buf.push('>');
var __val__ = author.full_name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</a></h2>');
// iterate selections
;(function(){
  if ('number' == typeof selections.length) {

    for (var $index = 0, $$l = selections.length; $index < $$l; $index++) {
      var s = selections[$index];

buf.push('\n<section class="hl-sel-block">\n  <h3 class="hl-subhead"><a');
buf.push(attrs({ 'href':("/selections/" + (s.slug) + "") }, {"href":true}));
buf.push('>&ldquo;' + escape((interp = s.title) == null ? '' : interp) + '&rdquo;&nbsp;<span class="sel-dates">(' + escape((interp = s.date_display) == null ? '' : interp) + ')</span></a></h3>\n  <ul');
buf.push(attrs({ 'data-sel':("" + (s.id) + "") }, {"data-sel":true}));
buf.push('>');
// iterate s.quotations
;(function(){
  if ('number' == typeof s.quotations.length) {

    for (var $index = 0, $$l = s.quotations.length; $index < $$l; $index++) {
      var q = s.quotations[$index];

buf.push('\n    <li class="hl-i"><span class="hl-quotationmark">&#8220;</span><a');
buf.push(attrs({ 'href':("/highlights/" + (q.id) + ""), "class": ('hl-quote') }, {"href":true}));
buf.push('>');
var __val__ = q.quotation
buf.push(null == __val__ ? "" : __val__);
buf.push('</a></li>');
    }

  } else {
    var $$l = 0;
    for (var $index in s.quotations) {
      $$l++;      var q = s.quotations[$index];

buf.push('\n    <li class="hl-i"><span class="hl-quotationmark">&#8220;</span><a');
buf.push(attrs({ 'href':("/highlights/" + (q.id) + ""), "class": ('hl-quote') }, {"href":true}));
buf.push('>');
var __val__ = q.quotation
buf.push(null == __val__ ? "" : __val__);
buf.push('</a></li>');
    }

  }
}).call(this);

buf.push('\n  </ul>\n  <div class="hl-more">\n    <div><a');
buf.push(attrs({ 'href':("/selections/" + (s.slug) + "") }, {"href":true}));
buf.push('>read this full selection &raquo;</a></div>\n  </div>\n</section>');
    }

  } else {
    var $$l = 0;
    for (var $index in selections) {
      $$l++;      var s = selections[$index];

buf.push('\n<section class="hl-sel-block">\n  <h3 class="hl-subhead"><a');
buf.push(attrs({ 'href':("/selections/" + (s.slug) + "") }, {"href":true}));
buf.push('>&ldquo;' + escape((interp = s.title) == null ? '' : interp) + '&rdquo;&nbsp;<span class="sel-dates">(' + escape((interp = s.date_display) == null ? '' : interp) + ')</span></a></h3>\n  <ul');
buf.push(attrs({ 'data-sel':("" + (s.id) + "") }, {"data-sel":true}));
buf.push('>');
// iterate s.quotations
;(function(){
  if ('number' == typeof s.quotations.length) {

    for (var $index = 0, $$l = s.quotations.length; $index < $$l; $index++) {
      var q = s.quotations[$index];

buf.push('\n    <li class="hl-i"><span class="hl-quotationmark">&#8220;</span><a');
buf.push(attrs({ 'href':("/highlights/" + (q.id) + ""), "class": ('hl-quote') }, {"href":true}));
buf.push('>');
var __val__ = q.quotation
buf.push(null == __val__ ? "" : __val__);
buf.push('</a></li>');
    }

  } else {
    var $$l = 0;
    for (var $index in s.quotations) {
      $$l++;      var q = s.quotations[$index];

buf.push('\n    <li class="hl-i"><span class="hl-quotationmark">&#8220;</span><a');
buf.push(attrs({ 'href':("/highlights/" + (q.id) + ""), "class": ('hl-quote') }, {"href":true}));
buf.push('>');
var __val__ = q.quotation
buf.push(null == __val__ ? "" : __val__);
buf.push('</a></li>');
    }

  }
}).call(this);

buf.push('\n  </ul>\n  <div class="hl-more">\n    <div><a');
buf.push(attrs({ 'href':("/selections/" + (s.slug) + "") }, {"href":true}));
buf.push('>read this full selection &raquo;</a></div>\n  </div>\n</section>');
    }

  }
}).call(this);

}
return buf.join("");
}return brQuotAuthTempl});