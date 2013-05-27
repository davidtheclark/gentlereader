//     Underscore.js 1.4.4
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

!function(){var e=this,t=e._,i={},n=Array.prototype,a=Object.prototype,r=Function.prototype,o=n.push,s=n.slice,l=n.concat,u=a.toString,c=a.hasOwnProperty,d=n.forEach,p=n.map,h=n.reduce,m=n.reduceRight,g=n.filter,f=n.every,b=n.some,v=n.indexOf,y=n.lastIndexOf,_=Array.isArray,w=Object.keys,k=r.bind,x=function(e){return e instanceof x?e:this instanceof x?(this._wrapped=e,void 0):new x(e)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=x),exports._=x):e._=x,x.VERSION="1.4.4";var z=x.each=x.forEach=function(e,t,n){if(null!=e)if(d&&e.forEach===d)e.forEach(t,n);else if(e.length===+e.length){for(var a=0,r=e.length;r>a;a++)if(t.call(n,e[a],a,e)===i)return}else for(var o in e)if(x.has(e,o)&&t.call(n,e[o],o,e)===i)return};x.map=x.collect=function(e,t,i){var n=[];return null==e?n:p&&e.map===p?e.map(t,i):(z(e,function(e,a,r){n[n.length]=t.call(i,e,a,r)}),n)};var j="Reduce of empty array with no initial value";x.reduce=x.foldl=x.inject=function(e,t,i,n){var a=arguments.length>2;if(null==e&&(e=[]),h&&e.reduce===h)return n&&(t=x.bind(t,n)),a?e.reduce(t,i):e.reduce(t);if(z(e,function(e,r,o){a?i=t.call(n,i,e,r,o):(i=e,a=!0)}),!a)throw new TypeError(j);return i},x.reduceRight=x.foldr=function(e,t,i,n){var a=arguments.length>2;if(null==e&&(e=[]),m&&e.reduceRight===m)return n&&(t=x.bind(t,n)),a?e.reduceRight(t,i):e.reduceRight(t);var r=e.length;if(r!==+r){var o=x.keys(e);r=o.length}if(z(e,function(s,l,u){l=o?o[--r]:--r,a?i=t.call(n,i,e[l],l,u):(i=e[l],a=!0)}),!a)throw new TypeError(j);return i},x.find=x.detect=function(e,t,i){var n;return C(e,function(e,a,r){return t.call(i,e,a,r)?(n=e,!0):void 0}),n},x.filter=x.select=function(e,t,i){var n=[];return null==e?n:g&&e.filter===g?e.filter(t,i):(z(e,function(e,a,r){t.call(i,e,a,r)&&(n[n.length]=e)}),n)},x.reject=function(e,t,i){return x.filter(e,function(e,n,a){return!t.call(i,e,n,a)},i)},x.every=x.all=function(e,t,n){t||(t=x.identity);var a=!0;return null==e?a:f&&e.every===f?e.every(t,n):(z(e,function(e,r,o){return(a=a&&t.call(n,e,r,o))?void 0:i}),!!a)};var C=x.some=x.any=function(e,t,n){t||(t=x.identity);var a=!1;return null==e?a:b&&e.some===b?e.some(t,n):(z(e,function(e,r,o){return a||(a=t.call(n,e,r,o))?i:void 0}),!!a)};x.contains=x.include=function(e,t){return null==e?!1:v&&e.indexOf===v?-1!=e.indexOf(t):C(e,function(e){return e===t})},x.invoke=function(e,t){var i=s.call(arguments,2),n=x.isFunction(t);return x.map(e,function(e){return(n?t:e[t]).apply(e,i)})},x.pluck=function(e,t){return x.map(e,function(e){return e[t]})},x.where=function(e,t,i){return x.isEmpty(t)?i?null:[]:x[i?"find":"filter"](e,function(e){for(var i in t)if(t[i]!==e[i])return!1;return!0})},x.findWhere=function(e,t){return x.where(e,t,!0)},x.max=function(e,t,i){if(!t&&x.isArray(e)&&e[0]===+e[0]&&e.length<65535)return Math.max.apply(Math,e);if(!t&&x.isEmpty(e))return-1/0;var n={computed:-1/0,value:-1/0};return z(e,function(e,a,r){var o=t?t.call(i,e,a,r):e;o>=n.computed&&(n={value:e,computed:o})}),n.value},x.min=function(e,t,i){if(!t&&x.isArray(e)&&e[0]===+e[0]&&e.length<65535)return Math.min.apply(Math,e);if(!t&&x.isEmpty(e))return 1/0;var n={computed:1/0,value:1/0};return z(e,function(e,a,r){var o=t?t.call(i,e,a,r):e;o<n.computed&&(n={value:e,computed:o})}),n.value},x.shuffle=function(e){var t,i=0,n=[];return z(e,function(e){t=x.random(i++),n[i-1]=n[t],n[t]=e}),n};var q=function(e){return x.isFunction(e)?e:function(t){return t[e]}};x.sortBy=function(e,t,i){var n=q(t);return x.pluck(x.map(e,function(e,t,a){return{value:e,index:t,criteria:n.call(i,e,t,a)}}).sort(function(e,t){var i=e.criteria,n=t.criteria;if(i!==n){if(i>n||void 0===i)return 1;if(n>i||void 0===n)return-1}return e.index<t.index?-1:1}),"value")};var T=function(e,t,i,n){var a={},r=q(t||x.identity);return z(e,function(t,o){var s=r.call(i,t,o,e);n(a,s,t)}),a};x.groupBy=function(e,t,i){return T(e,t,i,function(e,t,i){(x.has(e,t)?e[t]:e[t]=[]).push(i)})},x.countBy=function(e,t,i){return T(e,t,i,function(e,t){x.has(e,t)||(e[t]=0),e[t]++})},x.sortedIndex=function(e,t,i,n){i=null==i?x.identity:q(i);for(var a=i.call(n,t),r=0,o=e.length;o>r;){var s=r+o>>>1;i.call(n,e[s])<a?r=s+1:o=s}return r},x.toArray=function(e){return e?x.isArray(e)?s.call(e):e.length===+e.length?x.map(e,x.identity):x.values(e):[]},x.size=function(e){return null==e?0:e.length===+e.length?e.length:x.keys(e).length},x.first=x.head=x.take=function(e,t,i){return null==e?void 0:null==t||i?e[0]:s.call(e,0,t)},x.initial=function(e,t,i){return s.call(e,0,e.length-(null==t||i?1:t))},x.last=function(e,t,i){return null==e?void 0:null==t||i?e[e.length-1]:s.call(e,Math.max(e.length-t,0))},x.rest=x.tail=x.drop=function(e,t,i){return s.call(e,null==t||i?1:t)},x.compact=function(e){return x.filter(e,x.identity)};var E=function(e,t,i){return z(e,function(e){x.isArray(e)?t?o.apply(i,e):E(e,t,i):i.push(e)}),i};x.flatten=function(e,t){return E(e,t,[])},x.without=function(e){return x.difference(e,s.call(arguments,1))},x.uniq=x.unique=function(e,t,i,n){x.isFunction(t)&&(n=i,i=t,t=!1);var a=i?x.map(e,i,n):e,r=[],o=[];return z(a,function(i,n){(t?n&&o[o.length-1]===i:x.contains(o,i))||(o.push(i),r.push(e[n]))}),r},x.union=function(){return x.uniq(l.apply(n,arguments))},x.intersection=function(e){var t=s.call(arguments,1);return x.filter(x.uniq(e),function(e){return x.every(t,function(t){return x.indexOf(t,e)>=0})})},x.difference=function(e){var t=l.apply(n,s.call(arguments,1));return x.filter(e,function(e){return!x.contains(t,e)})},x.zip=function(){for(var e=s.call(arguments),t=x.max(x.pluck(e,"length")),i=new Array(t),n=0;t>n;n++)i[n]=x.pluck(e,""+n);return i},x.object=function(e,t){if(null==e)return{};for(var i={},n=0,a=e.length;a>n;n++)t?i[e[n]]=t[n]:i[e[n][0]]=e[n][1];return i},x.indexOf=function(e,t,i){if(null==e)return-1;var n=0,a=e.length;if(i){if("number"!=typeof i)return n=x.sortedIndex(e,t),e[n]===t?n:-1;n=0>i?Math.max(0,a+i):i}if(v&&e.indexOf===v)return e.indexOf(t,i);for(;a>n;n++)if(e[n]===t)return n;return-1},x.lastIndexOf=function(e,t,i){if(null==e)return-1;var n=null!=i;if(y&&e.lastIndexOf===y)return n?e.lastIndexOf(t,i):e.lastIndexOf(t);for(var a=n?i:e.length;a--;)if(e[a]===t)return a;return-1},x.range=function(e,t,i){arguments.length<=1&&(t=e||0,e=0),i=arguments[2]||1;for(var n=Math.max(Math.ceil((t-e)/i),0),a=0,r=new Array(n);n>a;)r[a++]=e,e+=i;return r},x.bind=function(e,t){if(e.bind===k&&k)return k.apply(e,s.call(arguments,1));var i=s.call(arguments,2);return function(){return e.apply(t,i.concat(s.call(arguments)))}},x.partial=function(e){var t=s.call(arguments,1);return function(){return e.apply(this,t.concat(s.call(arguments)))}},x.bindAll=function(e){var t=s.call(arguments,1);return 0===t.length&&(t=x.functions(e)),z(t,function(t){e[t]=x.bind(e[t],e)}),e},x.memoize=function(e,t){var i={};return t||(t=x.identity),function(){var n=t.apply(this,arguments);return x.has(i,n)?i[n]:i[n]=e.apply(this,arguments)}},x.delay=function(e,t){var i=s.call(arguments,2);return setTimeout(function(){return e.apply(null,i)},t)},x.defer=function(e){return x.delay.apply(x,[e,1].concat(s.call(arguments,1)))},x.throttle=function(e,t){var i,n,a,r,o=0,s=function(){o=new Date,a=null,r=e.apply(i,n)};return function(){var l=new Date,u=t-(l-o);return i=this,n=arguments,0>=u?(clearTimeout(a),a=null,o=l,r=e.apply(i,n)):a||(a=setTimeout(s,u)),r}},x.debounce=function(e,t,i){var n,a;return function(){var r=this,o=arguments,s=function(){n=null,i||(a=e.apply(r,o))},l=i&&!n;return clearTimeout(n),n=setTimeout(s,t),l&&(a=e.apply(r,o)),a}},x.once=function(e){var t,i=!1;return function(){return i?t:(i=!0,t=e.apply(this,arguments),e=null,t)}},x.wrap=function(e,t){return function(){var i=[e];return o.apply(i,arguments),t.apply(this,i)}},x.compose=function(){var e=arguments;return function(){for(var t=arguments,i=e.length-1;i>=0;i--)t=[e[i].apply(this,t)];return t[0]}},x.after=function(e,t){return 0>=e?t():function(){return--e<1?t.apply(this,arguments):void 0}},x.keys=w||function(e){if(e!==Object(e))throw new TypeError("Invalid object");var t=[];for(var i in e)x.has(e,i)&&(t[t.length]=i);return t},x.values=function(e){var t=[];for(var i in e)x.has(e,i)&&t.push(e[i]);return t},x.pairs=function(e){var t=[];for(var i in e)x.has(e,i)&&t.push([i,e[i]]);return t},x.invert=function(e){var t={};for(var i in e)x.has(e,i)&&(t[e[i]]=i);return t},x.functions=x.methods=function(e){var t=[];for(var i in e)x.isFunction(e[i])&&t.push(i);return t.sort()},x.extend=function(e){return z(s.call(arguments,1),function(t){if(t)for(var i in t)e[i]=t[i]}),e},x.pick=function(e){var t={},i=l.apply(n,s.call(arguments,1));return z(i,function(i){i in e&&(t[i]=e[i])}),t},x.omit=function(e){var t={},i=l.apply(n,s.call(arguments,1));for(var a in e)x.contains(i,a)||(t[a]=e[a]);return t},x.defaults=function(e){return z(s.call(arguments,1),function(t){if(t)for(var i in t)null==e[i]&&(e[i]=t[i])}),e},x.clone=function(e){return x.isObject(e)?x.isArray(e)?e.slice():x.extend({},e):e},x.tap=function(e,t){return t(e),e};var S=function(e,t,i,n){if(e===t)return 0!==e||1/e==1/t;if(null==e||null==t)return e===t;e instanceof x&&(e=e._wrapped),t instanceof x&&(t=t._wrapped);var a=u.call(e);if(a!=u.call(t))return!1;switch(a){case"[object String]":return e==String(t);case"[object Number]":return e!=+e?t!=+t:0==e?1/e==1/t:e==+t;case"[object Date]":case"[object Boolean]":return+e==+t;case"[object RegExp]":return e.source==t.source&&e.global==t.global&&e.multiline==t.multiline&&e.ignoreCase==t.ignoreCase}if("object"!=typeof e||"object"!=typeof t)return!1;for(var r=i.length;r--;)if(i[r]==e)return n[r]==t;i.push(e),n.push(t);var o=0,s=!0;if("[object Array]"==a){if(o=e.length,s=o==t.length)for(;o--&&(s=S(e[o],t[o],i,n)););}else{var l=e.constructor,c=t.constructor;if(l!==c&&!(x.isFunction(l)&&l instanceof l&&x.isFunction(c)&&c instanceof c))return!1;for(var d in e)if(x.has(e,d)&&(o++,!(s=x.has(t,d)&&S(e[d],t[d],i,n))))break;if(s){for(d in t)if(x.has(t,d)&&!o--)break;s=!o}}return i.pop(),n.pop(),s};x.isEqual=function(e,t){return S(e,t,[],[])},x.isEmpty=function(e){if(null==e)return!0;if(x.isArray(e)||x.isString(e))return 0===e.length;for(var t in e)if(x.has(e,t))return!1;return!0},x.isElement=function(e){return!(!e||1!==e.nodeType)},x.isArray=_||function(e){return"[object Array]"==u.call(e)},x.isObject=function(e){return e===Object(e)},z(["Arguments","Function","String","Number","Date","RegExp"],function(e){x["is"+e]=function(t){return u.call(t)=="[object "+e+"]"}}),x.isArguments(arguments)||(x.isArguments=function(e){return!(!e||!x.has(e,"callee"))}),"function"!=typeof/./&&(x.isFunction=function(e){return"function"==typeof e}),x.isFinite=function(e){return isFinite(e)&&!isNaN(parseFloat(e))},x.isNaN=function(e){return x.isNumber(e)&&e!=+e},x.isBoolean=function(e){return e===!0||e===!1||"[object Boolean]"==u.call(e)},x.isNull=function(e){return null===e},x.isUndefined=function(e){return void 0===e},x.has=function(e,t){return c.call(e,t)},x.noConflict=function(){return e._=t,this},x.identity=function(e){return e},x.times=function(e,t,i){for(var n=Array(e),a=0;e>a;a++)n[a]=t.call(i,a);return n},x.random=function(e,t){return null==t&&(t=e,e=0),e+Math.floor(Math.random()*(t-e+1))};var N={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};N.unescape=x.invert(N.escape);var A={escape:new RegExp("["+x.keys(N.escape).join("")+"]","g"),unescape:new RegExp("("+x.keys(N.unescape).join("|")+")","g")};x.each(["escape","unescape"],function(e){x[e]=function(t){return null==t?"":(""+t).replace(A[e],function(t){return N[e][t]})}}),x.result=function(e,t){if(null==e)return null;var i=e[t];return x.isFunction(i)?i.call(e):i},x.mixin=function(e){z(x.functions(e),function(t){var i=x[t]=e[t];x.prototype[t]=function(){var e=[this._wrapped];return o.apply(e,arguments),P.call(this,i.apply(x,e))}})};var O=0;x.uniqueId=function(e){var t=++O+"";return e?e+t:t},x.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var L=/(.)^/,H={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\t|\u2028|\u2029/g;x.template=function(e,t,i){var n;i=x.defaults({},i,x.templateSettings);var a=new RegExp([(i.escape||L).source,(i.interpolate||L).source,(i.evaluate||L).source].join("|")+"|$","g"),r=0,o="__p+='";e.replace(a,function(t,i,n,a,s){return o+=e.slice(r,s).replace(D,function(e){return"\\"+H[e]}),i&&(o+="'+\n((__t=("+i+"))==null?'':_.escape(__t))+\n'"),n&&(o+="'+\n((__t=("+n+"))==null?'':__t)+\n'"),a&&(o+="';\n"+a+"\n__p+='"),r=s+t.length,t}),o+="';\n",i.variable||(o="with(obj||{}){\n"+o+"}\n"),o="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+o+"return __p;\n";try{n=new Function(i.variable||"obj","_",o)}catch(s){throw s.source=o,s}if(t)return n(t,x);var l=function(e){return n.call(this,e,x)};return l.source="function("+(i.variable||"obj")+"){\n"+o+"}",l},x.chain=function(e){return x(e).chain()};var P=function(e){return this._chain?x(e).chain():e};x.mixin(x),z(["pop","push","reverse","shift","sort","splice","unshift"],function(e){var t=n[e];x.prototype[e]=function(){var i=this._wrapped;return t.apply(i,arguments),"shift"!=e&&"splice"!=e||0!==i.length||delete i[0],P.call(this,i)}}),z(["concat","join","slice"],function(e){var t=n[e];x.prototype[e]=function(){return P.call(this,t.apply(this._wrapped,arguments))}}),x.extend(x.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}.call(this);