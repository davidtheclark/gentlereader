require.config({paths:{jade:'/static/gentlereader/scripts/lib/jade-runtime'},shim:{jade:{exports:'jade'}}});
define(['jade'],function(jade){
function pgSelectTempl(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('\n<div data-adjustor="page" class="x-adjustor">&times;</div>\n<div class="adjustor-h">Pages</div>\n<ol start="0" id="pagelist">\n  <li data-page="all" class="page-all pagelist-i">all ' + escape((interp = itemCount) == null ? '' : interp) + ' ' + escape((interp = dataType) == null ? '' : interp) + '</li>');
// iterate pages
;(function(){
  if ('number' == typeof pages.length) {

    for (var $index = 0, $$l = pages.length; $index < $$l; $index++) {
      var p = pages[$index];

buf.push('\n  <li');
buf.push(attrs({ 'data-page':('' + (p.num) + ''), "class": ('pagelist-i') }, {"data-page":true}));
buf.push('>' + ((interp = p.fill) == null ? '' : interp) + '</li>');
    }

  } else {
    var $$l = 0;
    for (var $index in pages) {
      $$l++;      var p = pages[$index];

buf.push('\n  <li');
buf.push(attrs({ 'data-page':('' + (p.num) + ''), "class": ('pagelist-i') }, {"data-page":true}));
buf.push('>' + ((interp = p.fill) == null ? '' : interp) + '</li>');
    }

  }
}).call(this);

buf.push('\n</ol>');
}
return buf.join("");
}return pgSelectTempl});