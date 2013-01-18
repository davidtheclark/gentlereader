require.config({paths:{jade:'/Users/stumpman/Documents/eclipse-workspace/miniProject/anthologist/static/anthologist/js/libraries/jade-runtime.js'},shim:{jade:{exports:'jade'}}});
define(['jade'],function(jade){
function browse-item(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
var __indent = [];
buf.push('\n<li>');
if ( tagType == 'authors')
{
buf.push('<span itemprop="itemListElement" itemscope="itemscope" itemtype="http://www.schema.org/Person"> \n    <meta');
buf.push(attrs({ 'itemprop':("familyName"), 'content':("" + (last_name) + "") }, {"itemprop":true,"content":true}));
buf.push('/>\n    <meta');
buf.push(attrs({ 'itemprop':("givenName"), 'content':("" + (first_name) + "") }, {"itemprop":true,"content":true}));
buf.push('/>\n    <meta');
buf.push(attrs({ 'itemprop':("birthDate"), 'content':("" + (birth_year) + "") }, {"itemprop":true,"content":true}));
buf.push('/>\n    <meta');
buf.push(attrs({ 'itemprop':("deathDate"), 'content':("" + (death_year) + "") }, {"itemprop":true,"content":true}));
buf.push('/>' + ((interp = full_name) == null ? '' : interp) + ' (' + ((interp = dates) == null ? '' : interp) + ')</span>');
}
else
{
buf.push('<span itemprop="itemListElement">');
var __val__ = name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
}
buf.push('\n</li>');
}
return buf.join("");
}return browse-item});