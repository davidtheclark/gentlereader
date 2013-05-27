require.config({paths:{jade:'/static/gentlereader/scripts/lib/jade-runtime'},shim:{jade:{exports:'jade'}}});
define(['jade'],function(jade){
function randQuotTempl(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('<a');
buf.push(attrs({ 'href':("/highlights/" + (quotation.id) + ""), "class": ('rq-text') }, {"href":true}));
buf.push('>');
var __val__ = quotation.quotation
buf.push(null == __val__ ? "" : __val__);
buf.push('</a>\n<div class="rq-citation"><a');
buf.push(attrs({ 'href':("/selections/" + (selection.slug) + "") }, {"href":true}));
buf.push('>&mdash; from "' + escape((interp = selection.title) == null ? '' : interp) + '" by ' + escape((interp = selection.author) == null ? '' : interp) + '&nbsp;(' + escape((interp = selection.pub_year) == null ? '' : interp) + ')</a></div>');
}
return buf.join("");
}return randQuotTempl});