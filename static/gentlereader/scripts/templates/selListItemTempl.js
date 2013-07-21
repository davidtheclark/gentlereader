require.config({paths:{jade:'/static/gentlereader/scripts/lib/jade-runtime'},shim:{jade:{exports:'jade'}}});
define(['jade'],function(jade){
function selListItemTempl(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('\n<section><a');
buf.push(attrs({ 'href':('/selections/' + (model.get("slug")) + '') }, {"href":true}));
buf.push('>\n    <h3>' + escape((interp = model.get("title")) == null ? '' : interp) + '</h3>\n    <div class="li-sel-dets"><span class="li-sel-author">' + escape((interp = model.get("author")) == null ? '' : interp) + '.&#32;</span>');
if ( model.get("from_display"))
{
buf.push('' + ((interp = model.get("from_display")) == null ? '' : interp) + '');
}
buf.push('&#32;(' + ((interp = model.get("date_display")) == null ? '' : interp) + '). <span class="li-sel--posttime">Posted ' + escape((interp = model.get("date_entered")) == null ? '' : interp) + '</span>\n    </div></a></section>\n<section class="li-sel--teaser"><span class="teaser-text hyphenate">');
var __val__ = model.get("teaser")
buf.push(null == __val__ ? "" : __val__);
buf.push('</span><a');
buf.push(attrs({ 'href':('/selections/' + (model.get("slug")) + ''), "class": ('read-on') }, {"href":true}));
buf.push('>read&nbsp;on</a></section>');
}
return buf.join("");
}return selListItemTempl});