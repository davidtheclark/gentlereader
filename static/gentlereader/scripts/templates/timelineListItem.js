require.config({paths:{jade:'/static/gentlereader/scripts/lib/jade-runtime'},shim:{jade:{exports:'jade'}}});
define(['jade'],function(jade){
function timelineListItem(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('<a');
buf.push(attrs({ 'href':("/selections/" + (model.get('slug')) + "") }, {"href":true}));
buf.push('>\n  <h2 class="tl-title">' + escape((interp = model.get('title')) == null ? '' : interp) + '</h2>by ' + escape((interp = model.get('author')) == null ? '' : interp) + '</a><span class="tl-showteaser uft-trigger uft-a">[&nbsp;teaser&nbsp;&#9662;&nbsp;]</span>\n<div class="tl-teaser hyphenate uft-b"><span class="teaser-text">' + escape((interp = model.get('teaser')) == null ? '' : interp) + '</span><a');
buf.push(attrs({ 'href':("/selections/{" + (model.get('slug')) + ""), "class": ('read-on') }, {"href":true}));
buf.push('>read&nbsp;on</a></div>');
}
return buf.join("");
}return timelineListItem});