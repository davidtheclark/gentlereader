define("utils/ignore-articles",[],function(){var e;return e=function(e){return e.match(/^the /i)?e.substring(4):e.match(/^an /i)?e.substring(3):e.match(/^a /i)?e.substring(2):e}}),define("models/tag-set",["backbone","utils/ignore-articles"],function(e,i){var a;return a=e.Collection.extend({comparator:function(e){var a,t;return a=e.get("last_name")||"",t=a?a:e.get("name"),i(t.toLowerCase())}})}),require.config({paths:{jade:"/static/gentlereader/scripts/lib/jade-runtime"},shim:{jade:{exports:"jade"}}}),define("templates/pgSelectTempl",["jade"],function(jade){function pgSelectTempl(locals,attrs,escape,rethrow,merge){attrs=attrs||jade.attrs,escape=escape||jade.escape,rethrow=rethrow||jade.rethrow,merge=merge||jade.merge;var buf=[];with(locals||{}){var interp;buf.push('\n<div class="page-select-arrow u-left">&lt;</div>\n<div class="page-select-arrow u-right">&gt;</div>\n<label for="page-select" class="page-select-label">-- select a page --</label>\n<select id="page-select">\n  <option value="all">all '+escape(null==(interp=itemCount)?"":interp)+" "+escape(null==(interp=dataType)?"":interp)+"</option>"),function(){if("number"==typeof pages.length)for(var e=0,i=pages.length;i>e;e++){var a=pages[e];buf.push("\n  <option"),buf.push(attrs({value:""+a.num+a.sel},{value:!0})),buf.push(">"+escape(null==(interp=a.num)?"":interp)+". "+escape(null==(interp=a.fill)?"":interp)+"</option>")}else{var i=0;for(var e in pages){i++;var a=pages[e];buf.push("\n  <option"),buf.push(attrs({value:""+a.num+a.sel},{value:!0})),buf.push(">"+escape(null==(interp=a.num)?"":interp)+". "+escape(null==(interp=a.fill)?"":interp)+"</option>")}}}.call(this),buf.push("\n</select>")}return buf.join("")}return pgSelectTempl}),define("views/pg-select-view",["backbone","templates/pgSelectTempl"],function(e,i){var a;return a=e.View.extend({template:i,initialize:function(e){return _.extend(this,e),this.render()},getModelDisplay:function(e){if("selections"!==this.dataType)return"authors"===this.dataType?e.get("last_name").toUpperCase():e.get("name").toUpperCase();switch(this.sortField){case"date_entered":return e.get("date_entered_simple");case"author":return e.get("source").author.last_name.toUpperCase();case"pub_year":return e.get("source").date_display}},events:{change:"changePage","click .page-select-arrow":"flipPage"},changePage:function(){var e,i,a,t;return this.router?(i=$("#page-select").val(),this.sorted?(a=$("#sort-field").val(),e=$("#sort-direction").val(),t="page/"+a+e+"/"+i,this.router.navigate(t,{trigger:!0})):this.router.navigate("page/"+i,{trigger:!0}),this.changeSelectedPage()):console.log("No router found.")},changeSelectedPage:function(){return $("#selected-page").html($("#page-select option:selected").text())},flipPage:function(){var e,i,a,t,r,o;return e=$(event.target),t=e.hasClass("u-left")?"prev":"next",i=$("#page-select"),o=i.val(),"all"===o?r="prev"===t?this.pgParams.length:1:(a=parseInt(i.val()),r=e.hasClass("u-left")?a-1:a+1),i.val(r.toString()).trigger("change")},render:function(){var e,i,a,t,r,o,n,s,l,u,c,d;if(r=this.pgParams){for(e=this.container||$("#page-select-container"),n=r.length,t=r[n-1].endIndex+1,e.off().empty(),u={itemCount:t,dataType:this.dataType,pages:[]},a=c=0,d=r.length;d>c;a=++c)o=r[a],l=this.getModelDisplay(o.startModel),i=this.getModelDisplay(o.endModel),s={sel:1===this.startPage&&0===a?" selected":"",fill:l!==i?""+l+" to "+i:l,num:a+1},u.pages.push(s);this.$el.append(this.template(u)),e.append(this.el),this.changeSelectedPage()}else console.log("No page details found.");return this}})}),define("views/paginated-collection-view",["backbone"],function(e){var i;return i=e.View.extend({initialize:function(e){return _.extend(this,e),this.render()},render:function(){var e=this;return this.collection&&this.page?this.container.fadeOut("fast",function(){var i,a,t,r,o,n;for(e.container.off().empty(),"all"===e.page?(r=0,i=e.collection.length-1):(o=e.pgParams[e.page-1],r=o.startIndex,i=o.endIndex),a=n=r;i>=r?i>=n:n>=i;a=i>=r?++n:--n)t=new e.View({model:e.collection.models[a],index:a});return e.container.fadeIn("fast",function(){return e.callback?e.callback():void 0})}):console.log("Missing options: requires 'collection' and 'page'."),this}})}),define("views/br-tag-view",["backbone","views/paginated-collection-view"],function(e,i){var a,t;return a=e.View.extend({tagName:"li",initialize:function(){return this.render()},render:function(){var e,i,a,t;return i=this.model,a=i.get("name"),t=i.get("slug"),e="<a href='"+t+"' class='tag-list--a'><span class='tag-list--span'>"+a+"</span></a>",this.$el.append(e),$("#tag-list").append(this.el),this}}),t=function(e){return new i({collection:e.collection,page:e.page,container:e.container,pgParams:e.pgParams,View:a})}}),define("utils/globals",[],function(){var e;return e={},{getGlobals:function(){return e}}}),define("routers/br-tag-router",["backbone","utils/globals"],function(e,i){var a;return i=i.getGlobals(),a=e.Router.extend({initialize:function(i){return _.extend(this,i),e.history.start({silent:!0})},routes:{"page/:page":"changePage"},changePage:function(e){var a;return a=$("#page-select"),a.val()!==e&&a.val(e),i.app.pageChanger(e)}})}),define("utils/pagination-details",[],function(){var e;return e=function(e,i){var a,t,r,o,n,s,l,u;for(o=e.models,t=e.length,n=Math.ceil(t/i),s=[],a=function(){var e,a,n;return n=r*i,a=(r+1)*i-1,e=t-1,a>e&&(a=e),s[r]={startIndex:n,startModel:o[n],endIndex:a,endModel:o[a]}},r=l=0,u=n-1;u>=0?u>=l:l>=u;r=u>=0?++l:--l)a(r);return{startEndModels:s,pgCount:n}}}),define("apps/browse-app",["backbone","models/tag-set","views/pg-select-view","views/br-tag-view","routers/br-tag-router","utils/pagination-details","utils/globals"],function(e,i,a,t,r,o,n){var s;return n=n.getGlobals(),s=e.View.extend({settings:{itemsPerPage:10,container:$("#tag-list"),dataType:tagType,startPage:"all"},initialize:function(){return this.getTags()},getTags:function(){var e,a=this;return e=this.tagSet=new i,e.url="/api/"+this.settings.dataType,e.fetch({error:function(){return console.log("The tag set couldn't be fetched.")},success:function(){return a.setPagination(),a.pgCount>1?(a.router=new r({pageChanger:a.pageChanger}),a.router.navigate("page/all",{replace:!0}),a.getPageSelect()):void 0}})},setPagination:function(){var e;return e=o(this.tagSet,this.settings.itemsPerPage),this.pgParams=e.startEndModels,this.pgCount=e.pgCount},getPageSelect:function(){var e;return e=new a({pgParams:this.pgParams,router:this.router,dataType:this.settings.dataType,startPage:this.settings.startPage})},pageChanger:function(e){var i;return i={collection:this.tagSet,page:e,pgParams:this.pgParams,container:this.settings.container},t(i)}})}),function(){require(["apps/rand-quot-app","apps/browse-app","utils/globals"],function(e,i,a){var t,r;return r=new e,a=a.getGlobals(),t=a.app=new i})}.call(this),define("browse-main",function(){});