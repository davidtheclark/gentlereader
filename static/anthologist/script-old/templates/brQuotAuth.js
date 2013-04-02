require.config({paths:{jade:'/static/anthologist/js/libraries/jade-runtime'},shim:{jade:{exports:'jade'}}});
define(['jade'],function(jade){
function brQuotAuth(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('<a');
buf.push(attrs({ 'href':("#author/" + (id) + ""), "class": ('author-link') }, {"href":true}));
buf.push('> <span class="author-last">' + escape((interp = last_name) == null ? '' : interp) + '</span>');
if ( first_name)
{
buf.push(', ' + escape((interp = first_name) == null ? '' : interp) + '');
}
buf.push('<span class="author-dates"> (' + ((interp = dates) == null ? '' : interp) + ')</span></a>');
}
return buf.join("");
}return brQuotAuth});