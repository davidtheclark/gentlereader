require.config({paths:{jade:'/static/gentlereader/scripts/lib/jade-runtime'},shim:{jade:{exports:'jade'}}});
define(['jade'],function(jade){
function timelineListItem(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('\n<li class="tl-li">\n  <div class="tl-year">{{ item.year }}</div>\n  <ul class="tl-sels">{% for s in item.selections %}\n    <li class="tl-sel">{{ s }}</li>{% endfor %}\n  </ul>\n</li>');
}
return buf.join("");
}return timelineListItem});