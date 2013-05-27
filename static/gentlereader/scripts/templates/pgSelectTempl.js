require.config({paths:{jade:'/static/gentlereader/scripts/lib/jade-runtime'},shim:{jade:{exports:'jade'}}});
define(['jade'],function(jade){
function pgSelectTempl(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('\n<div class="page-select-arrow u-left">&lt;</div>\n<div class="page-select-arrow u-right">&gt;</div>\n<label for="page-select" class="page-select-label">-- select a page --</label>\n<select id="page-select">\n  <option value="all">all ' + escape((interp = itemCount) == null ? '' : interp) + ' ' + escape((interp = dataType) == null ? '' : interp) + '</option>');
// iterate pages
;(function(){
  if ('number' == typeof pages.length) {

    for (var $index = 0, $$l = pages.length; $index < $$l; $index++) {
      var p = pages[$index];

buf.push('\n  <option');
buf.push(attrs({ 'value':('' + (p.num) + '' + (p.sel) + '') }, {"value":true}));
buf.push('>' + escape((interp = p.num) == null ? '' : interp) + '. ' + escape((interp = p.fill) == null ? '' : interp) + '</option>');
    }

  } else {
    var $$l = 0;
    for (var $index in pages) {
      $$l++;      var p = pages[$index];

buf.push('\n  <option');
buf.push(attrs({ 'value':('' + (p.num) + '' + (p.sel) + '') }, {"value":true}));
buf.push('>' + escape((interp = p.num) == null ? '' : interp) + '. ' + escape((interp = p.fill) == null ? '' : interp) + '</option>');
    }

  }
}).call(this);

buf.push('\n</select>');
}
return buf.join("");
}return pgSelectTempl});