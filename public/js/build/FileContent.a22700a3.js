import{_ as s}from"./openpgp_hi.15f91b1d.js";import{m as d}from"./vuex.cc7cb26e.js";import{n as c}from"./app.d6405832.js";import{I as h}from"./IFrame.24aa89ac.js";import"./@micro-zoe.c2e1472d.js";import"./jquery.3c667c6c.js";import"./@babel.49d8906a.js";import"./dayjs.57a29501.js";import"./localforage.1cc50bfb.js";import"./markdown-it.f48c10fc.js";import"./entities.797c3e49.js";import"./uc.micro.39573202.js";import"./mdurl.2f66c031.js";import"./linkify-it.3ecfda1e.js";import"./punycode.c1b51344.js";import"./highlight.js.24fdca15.js";import"./markdown-it-link-attributes.e1d5d151.js";import"./@traptitech.b5c819e2.js";import"./vue.c448ed56.js";import"./axios.6ec123f8.js";import"./le5le-store.b40f9152.js";import"./vue-router.2d566cd7.js";import"./vue-clipboard2.6e355525.js";import"./clipboard.7eddb2ef.js";import"./view-design-hi.d2045547.js";import"./vuedraggable.dbf1607a.js";import"./sortablejs.20b8ddfe.js";import"./vue-resize-observer.452c7636.js";import"./element-sea.e89b014c.js";import"./deepmerge.cecf392e.js";import"./resize-observer-polyfill.9f685ce8.js";import"./throttle-debounce.7c3948b2.js";import"./babel-helper-vue-jsx-merge-props.5ed215c3.js";import"./normalize-wheel.2a034b9f.js";import"./async-validator.5f40db32.js";import"./babel-runtime.4773988a.js";import"./core-js.314b4a1d.js";var u=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"file-history"},[e("Table",{attrs:{width:t.windowWidth-40>480?480:t.windowWidth-40,"max-height":t.windowHeight-180,columns:t.columns,data:t.list,loading:t.loadIng>0,"no-data-text":t.$L(t.noText),"highlight-row":"",stripe:""}}),t.total>t.pageSize?e("Page",{attrs:{total:t.total,current:t.page,"page-size":t.pageSize,disabled:t.loadIng>0,simple:!0},on:{"on-change":t.setPage,"on-page-size-change":t.setPageSize}}):t._e()],1)},p=[];const f={name:"FileHistory",props:{value:{type:Boolean,default:!1},file:{type:Object,default:()=>({})}},data(){return{loadIng:0,columns:[{title:this.$L("\u65E5\u671F"),key:"created_at",width:168},{title:this.$L("\u521B\u5EFA\u4EBA"),width:120,render:(t,{row:n})=>t("UserAvatar",{props:{showName:!0,size:22,userid:n.userid}})},{title:this.$L("\u5927\u5C0F"),key:"size",width:90,render:(t,{row:n})=>t("AutoTip",$A.bytesToSize(n.size))},{title:this.$L("\u64CD\u4F5C"),align:"center",width:100,render:(t,{index:n,row:e,column:i})=>n===0&&this.page===1?t("div","-"):t("TableAction",{props:{column:i,menu:[{label:this.$L("\u67E5\u770B"),action:"preview"},{label:this.$L("\u8FD8\u539F"),action:"restore"}]},on:{action:a=>{this.onAction(a,e)}}})}],list:[],page:1,pageSize:10,total:0,noText:""}},mounted(){},watch:{value:{handler(t){t&&this.setPage(1)},immediate:!0}},computed:{fileId(){return this.file.id||0}},methods:{getLists(){this.fileId!==0&&(this.loadIng++,this.$store.dispatch("call",{url:"file/content/history",data:{id:this.fileId,page:Math.max(this.page,1),pagesize:Math.max($A.runNum(this.pageSize),10)}}).then(({data:t})=>{this.page=t.current_page,this.total=t.total,this.list=t.data,this.noText="\u6CA1\u6709\u76F8\u5173\u7684\u6570\u636E"}).catch(()=>{this.noText="\u6570\u636E\u52A0\u8F7D\u5931\u8D25"}).finally(t=>{this.loadIng--}))},setPage(t){this.page=t,this.getLists()},setPageSize(t){this.page=1,this.pageSize=t,this.getLists()},onAction(t,n){switch(t){case"restore":this.$emit("on-restore",n);break;case"preview":const e=$A.getFileName(this.file)+` [${n.created_at}]`,i=`/single/file/${this.fileId}?history_id=${n.id}&history_title=${e}`;this.$Electron?this.$store.dispatch("openChildWindow",{name:`file-${this.fileId}-${n.id}`,path:i,userAgent:"/hideenOfficeTitle/",force:!1,config:{title:e,titleFixed:!0,parent:null,width:Math.min(window.screen.availWidth,1440),height:Math.min(window.screen.availHeight,900)}}):this.$isEEUiApp?this.$store.dispatch("openAppChildPage",{pageType:"app",pageTitle:e,url:"web.js",params:{titleFixed:!0,allowAccess:!0,url:$A.rightDelete(window.location.href,window.location.hash)+`#${i}`}}):window.open($A.mainUrl(i.substring(1)));break}}}},r={};var v=c(f,u,p,!1,m,"22ae08a3",null,null);function m(t){for(let n in r)this[n]=r[n]}var _=function(){return v.exports}(),y=function(){var t=this,n=t.$createElement,e=t._self._c||n;return t.ready?e("div",{staticClass:"file-content"},[t.isPreview?e("IFrame",{staticClass:"preview-iframe",attrs:{src:t.previewUrl},on:{"on-load":t.onFrameLoad}}):t.contentDetail?[["word","excel","ppt"].includes(t.file.type)?e("EPopover",{attrs:{trigger:"click"},model:{value:t.historyShow,callback:function(i){t.historyShow=i},expression:"historyShow"}},[e("div",{staticClass:"file-content-history"},[e("FileHistory",{attrs:{value:t.historyShow,file:t.file},on:{"on-restore":t.onRestoreHistory}})],1),e("div",{ref:"officeHeader",staticClass:"office-header",attrs:{slot:"reference"},slot:"reference"})]):e("div",{staticClass:"edit-header"},[e("div",{staticClass:"header-title"},[t.equalContent?t._e():e("EPopover",{staticClass:"file-unsave-tip",model:{value:t.unsaveTip,callback:function(i){t.unsaveTip=i},expression:"unsaveTip"}},[e("div",{staticClass:"confirm-popover"},[e("p",[t._v(t._s(t.$L("\u672A\u4FDD\u5B58\u5F53\u524D\u4FEE\u6539\u5185\u5BB9\uFF1F")))]),e("div",{staticClass:"buttons"},[e("Button",{attrs:{size:"small",type:"text"},on:{click:t.unSaveGive}},[t._v(t._s(t.$L("\u653E\u5F03")))]),e("Button",{attrs:{size:"small",type:"primary"},on:{click:t.onSaveSave}},[t._v(t._s(t.$L("\u4FDD\u5B58")))])],1)]),e("span",{attrs:{slot:"reference"},slot:"reference"},[t._v("["+t._s(t.$L("\u672A\u4FDD\u5B58"))+"*]")])]),t._v(" "+t._s(t.fileName)+" ")],1),e("div",{staticClass:"header-user"},[e("ul",[t._l(t.editUser,function(i,a){return a<=10?e("li",{key:a},[e("UserAvatar",{attrs:{userid:i,size:28,"border-witdh":2}})],1):t._e()}),t.editUser.length>10?e("li",{staticClass:"more",attrs:{title:t.editUser.length}},[t._v(t._s(t.editUser.length>999?"...":t.editUser.length))]):t._e()],2)]),t.file.type=="document"&&t.contentDetail&&!t.windowPortrait?e("div",{staticClass:"header-hint"},[e("ButtonGroup",{attrs:{size:"small",shape:"circle"}},[e("Button",{attrs:{type:`${t.contentDetail.type=="md"?"primary":"default"}`},on:{click:function(i){return t.setTextType("md")}}},[t._v(t._s(t.$L("MD\u7F16\u8F91\u5668")))]),e("Button",{attrs:{type:`${t.contentDetail.type!="md"?"primary":"default"}`},on:{click:function(i){return t.setTextType("text")}}},[t._v(t._s(t.$L("\u6587\u672C\u7F16\u8F91\u5668")))])],1)],1):t._e(),t.file.type=="mind"?e("div",{staticClass:"header-hint"},[t._v(" "+t._s(t.$L("\u9009\u4E2D\u8282\u70B9\uFF0C\u6309enter\u952E\u6DFB\u52A0\u540C\u7EA7\u8282\u70B9\uFF0Ctab\u952E\u6DFB\u52A0\u5B50\u8282\u70B9"))+" ")]):t._e(),t.file.type=="mind"?e("Dropdown",{staticClass:"header-hint",attrs:{trigger:"click",transfer:""},on:{"on-click":t.exportMenu}},[e("a",{attrs:{href:"javascript:void(0)"}},[t._v(t._s(t.$L("\u5BFC\u51FA"))),e("Icon",{attrs:{type:"ios-arrow-down"}})],1),e("DropdownMenu",{attrs:{slot:"list"},slot:"list"},[e("DropdownItem",{attrs:{name:"png"}},[t._v(t._s(t.$L("\u5BFC\u51FAPNG\u56FE\u7247")))]),e("DropdownItem",{attrs:{name:"pdf"}},[t._v(t._s(t.$L("\u5BFC\u51FAPDF\u6587\u4EF6")))])],1)],1):t._e(),t.file.only_view?t._e():[e("div",{staticClass:"header-icons"},[e("ETooltip",{attrs:{disabled:t.$isEEUiApp||t.windowTouch,content:t.$L("\u6587\u4EF6\u94FE\u63A5")}},[e("div",{staticClass:"header-icon",on:{click:function(i){return t.handleClick("link")}}},[e("i",{staticClass:"taskfont"},[t._v("\uE785")])])]),e("EPopover",{attrs:{trigger:"click"},model:{value:t.historyShow,callback:function(i){t.historyShow=i},expression:"historyShow"}},[e("div",{staticClass:"file-content-history"},[e("FileHistory",{attrs:{value:t.historyShow,file:t.file},on:{"on-restore":t.onRestoreHistory}})],1),e("ETooltip",{ref:"historyTip",attrs:{slot:"reference",disabled:t.$isEEUiApp||t.windowTouch||t.historyShow,content:t.$L("\u5386\u53F2\u7248\u672C")},slot:"reference"},[e("div",{staticClass:"header-icon"},[e("i",{staticClass:"taskfont"},[t._v("\uE71D")])])])],1)],1),t.windowPortrait&&t.file.type=="document"?[t.edit?t.edit&&t.equalContent?e("Button",{staticClass:"header-button",attrs:{size:"small"},on:{click:function(i){t.edit=!1}}},[t._v(t._s(t.$L("\u53D6\u6D88")))]):e("Button",{staticClass:"header-button",attrs:{disabled:t.equalContent,loading:t.loadSave>0,size:"small",type:"primary"},on:{click:function(i){return t.handleClick("save")}}},[t._v(t._s(t.$L("\u4FDD\u5B58")))]):e("Button",{staticClass:"header-button",attrs:{size:"small",type:"primary"},on:{click:function(i){t.edit=!0}}},[t._v(t._s(t.$L("\u7F16\u8F91")))])]:e("Button",{staticClass:"header-button",attrs:{disabled:t.equalContent,loading:t.loadSave>0,size:"small",type:"primary"},on:{click:function(i){return t.handleClick("save")}}},[t._v(t._s(t.$L("\u4FDD\u5B58")))])]],2),e("div",{staticClass:"content-body"},[t.historyShow?e("div",{staticClass:"content-mask"}):t._e(),t.file.type=="document"?[t.contentDetail.type=="md"?[t.edit?e("VMEditor",{model:{value:t.contentDetail.content,callback:function(i){t.$set(t.contentDetail,"content",i)},expression:"contentDetail.content"}}):e("VMPreview",{attrs:{value:t.contentDetail.content}})]:e("TEditor",{attrs:{readOnly:!t.edit,height:"100%"},on:{editorSave:function(i){return t.handleClick("saveBefore")}},model:{value:t.contentDetail.content,callback:function(i){t.$set(t.contentDetail,"content",i)},expression:"contentDetail.content"}})]:t.file.type=="drawio"?e("Drawio",{ref:"myFlow",attrs:{title:t.file.name},on:{saveData:function(i){return t.handleClick("saveBefore")}},model:{value:t.contentDetail,callback:function(i){t.contentDetail=i},expression:"contentDetail"}}):t.file.type=="mind"?e("Minder",{ref:"myMind",on:{saveData:function(i){return t.handleClick("saveBefore")}},model:{value:t.contentDetail,callback:function(i){t.contentDetail=i},expression:"contentDetail"}}):["code","txt"].includes(t.file.type)?e("AceEditor",{attrs:{ext:t.file.ext},on:{saveData:function(i){return t.handleClick("saveBefore")}},model:{value:t.contentDetail.content,callback:function(i){t.$set(t.contentDetail,"content",i)},expression:"contentDetail.content"}}):["word","excel","ppt"].includes(t.file.type)?e("OnlyOffice",{attrs:{documentKey:t.documentKey},on:{"on-document-ready":function(i){return t.handleClick("officeReady")}},model:{value:t.contentDetail,callback:function(i){t.contentDetail=i},expression:"contentDetail"}}):t._e()],2)]:t._e(),t.contentLoad?e("div",{staticClass:"content-load"},[e("Loading")],1):t._e(),e("Modal",{attrs:{title:t.$L("\u6587\u4EF6\u94FE\u63A5"),"mask-closable":!1},model:{value:t.linkShow,callback:function(i){t.linkShow=i},expression:"linkShow"}},[e("div",[e("div",{staticStyle:{margin:"-10px 0 8px"}},[t._v(t._s(t.$L("\u6587\u4EF6\u540D\u79F0"))+": "+t._s(t.linkData.name))]),e("Input",{ref:"linkInput",attrs:{type:"textarea",rows:3,readonly:""},on:{"on-focus":t.linkFocus},model:{value:t.linkData.url,callback:function(i){t.$set(t.linkData,"url",i)},expression:"linkData.url"}}),e("div",{staticClass:"form-tip",staticStyle:{"padding-top":"6px"}},[t._v(" "+t._s(t.$L("\u53EF\u901A\u8FC7\u6B64\u94FE\u63A5\u6D4F\u89C8\u6587\u4EF6\u3002"))+" "),e("Poptip",{attrs:{confirm:"",placement:"bottom","ok-text":t.$L("\u786E\u5B9A"),"cancel-text":t.$L("\u53D6\u6D88"),transfer:""},on:{"on-ok":function(i){return t.linkGet(!0)}}},[e("div",{attrs:{slot:"title"},slot:"title"},[e("p",[e("strong",[t._v(t._s(t.$L("\u6CE8\u610F\uFF1A\u5237\u65B0\u5C06\u5BFC\u81F4\u539F\u6765\u7684\u94FE\u63A5\u5931\u6548\uFF01")))])])]),e("a",{attrs:{href:"javascript:void(0)"}},[t._v(t._s(t.$L("\u5237\u65B0\u94FE\u63A5")))])])],1)],1),e("div",{staticClass:"adaption",attrs:{slot:"footer"},slot:"footer"},[e("Button",{attrs:{type:"default"},on:{click:function(i){t.linkShow=!1}}},[t._v(t._s(t.$L("\u53D6\u6D88")))]),e("Button",{attrs:{type:"primary",loading:t.linkLoad>0},on:{click:t.linkCopy}},[t._v(t._s(t.$L("\u590D\u5236")))])],1)])],2):t._e()},k=[];const $=()=>s(()=>import("./index.863b2bc5.js"),["js/build/index.863b2bc5.js","js/build/openpgp_hi.15f91b1d.js","js/build/index.40a8e116.js","js/build/app.d6405832.js","js/build/app.bfbe8f43.css","js/build/@micro-zoe.c2e1472d.js","js/build/jquery.3c667c6c.js","js/build/@babel.49d8906a.js","js/build/dayjs.57a29501.js","js/build/localforage.1cc50bfb.js","js/build/markdown-it.f48c10fc.js","js/build/entities.797c3e49.js","js/build/uc.micro.39573202.js","js/build/mdurl.2f66c031.js","js/build/linkify-it.3ecfda1e.js","js/build/punycode.c1b51344.js","js/build/highlight.js.24fdca15.js","js/build/markdown-it-link-attributes.e1d5d151.js","js/build/@traptitech.b5c819e2.js","js/build/vue.c448ed56.js","js/build/vuex.cc7cb26e.js","js/build/axios.6ec123f8.js","js/build/le5le-store.b40f9152.js","js/build/vue-router.2d566cd7.js","js/build/vue-clipboard2.6e355525.js","js/build/clipboard.7eddb2ef.js","js/build/view-design-hi.d2045547.js","js/build/vuedraggable.dbf1607a.js","js/build/sortablejs.20b8ddfe.js","js/build/vue-resize-observer.452c7636.js","js/build/element-sea.e89b014c.js","js/build/deepmerge.cecf392e.js","js/build/resize-observer-polyfill.9f685ce8.js","js/build/throttle-debounce.7c3948b2.js","js/build/babel-helper-vue-jsx-merge-props.5ed215c3.js","js/build/normalize-wheel.2a034b9f.js","js/build/async-validator.5f40db32.js","js/build/babel-runtime.4773988a.js","js/build/core-js.314b4a1d.js"]),w=()=>s(()=>import("./preview.f94b8f86.js"),["js/build/preview.f94b8f86.js","js/build/openpgp_hi.15f91b1d.js","js/build/index.40a8e116.js","js/build/app.d6405832.js","js/build/app.bfbe8f43.css","js/build/@micro-zoe.c2e1472d.js","js/build/jquery.3c667c6c.js","js/build/@babel.49d8906a.js","js/build/dayjs.57a29501.js","js/build/localforage.1cc50bfb.js","js/build/markdown-it.f48c10fc.js","js/build/entities.797c3e49.js","js/build/uc.micro.39573202.js","js/build/mdurl.2f66c031.js","js/build/linkify-it.3ecfda1e.js","js/build/punycode.c1b51344.js","js/build/highlight.js.24fdca15.js","js/build/markdown-it-link-attributes.e1d5d151.js","js/build/@traptitech.b5c819e2.js","js/build/vue.c448ed56.js","js/build/vuex.cc7cb26e.js","js/build/axios.6ec123f8.js","js/build/le5le-store.b40f9152.js","js/build/vue-router.2d566cd7.js","js/build/vue-clipboard2.6e355525.js","js/build/clipboard.7eddb2ef.js","js/build/view-design-hi.d2045547.js","js/build/vuedraggable.dbf1607a.js","js/build/sortablejs.20b8ddfe.js","js/build/vue-resize-observer.452c7636.js","js/build/element-sea.e89b014c.js","js/build/deepmerge.cecf392e.js","js/build/resize-observer-polyfill.9f685ce8.js","js/build/throttle-debounce.7c3948b2.js","js/build/babel-helper-vue-jsx-merge-props.5ed215c3.js","js/build/normalize-wheel.2a034b9f.js","js/build/async-validator.5f40db32.js","js/build/babel-runtime.4773988a.js","js/build/core-js.314b4a1d.js"]),g=()=>s(()=>import("./TEditor.6118be49.js"),["js/build/TEditor.6118be49.js","js/build/tinymce.46b8e261.js","js/build/@babel.49d8906a.js","js/build/ImgUpload.b0c4e0a8.js","js/build/app.d6405832.js","js/build/app.bfbe8f43.css","js/build/@micro-zoe.c2e1472d.js","js/build/jquery.3c667c6c.js","js/build/dayjs.57a29501.js","js/build/localforage.1cc50bfb.js","js/build/markdown-it.f48c10fc.js","js/build/entities.797c3e49.js","js/build/uc.micro.39573202.js","js/build/mdurl.2f66c031.js","js/build/linkify-it.3ecfda1e.js","js/build/punycode.c1b51344.js","js/build/highlight.js.24fdca15.js","js/build/markdown-it-link-attributes.e1d5d151.js","js/build/@traptitech.b5c819e2.js","js/build/vue.c448ed56.js","js/build/vuex.cc7cb26e.js","js/build/openpgp_hi.15f91b1d.js","js/build/axios.6ec123f8.js","js/build/le5le-store.b40f9152.js","js/build/vue-router.2d566cd7.js","js/build/vue-clipboard2.6e355525.js","js/build/clipboard.7eddb2ef.js","js/build/view-design-hi.d2045547.js","js/build/vuedraggable.dbf1607a.js","js/build/sortablejs.20b8ddfe.js","js/build/vue-resize-observer.452c7636.js","js/build/element-sea.e89b014c.js","js/build/deepmerge.cecf392e.js","js/build/resize-observer-polyfill.9f685ce8.js","js/build/throttle-debounce.7c3948b2.js","js/build/babel-helper-vue-jsx-merge-props.5ed215c3.js","js/build/normalize-wheel.2a034b9f.js","js/build/async-validator.5f40db32.js","js/build/babel-runtime.4773988a.js","js/build/core-js.314b4a1d.js"]),D=()=>s(()=>import("./AceEditor.66962697.js"),["js/build/AceEditor.66962697.js","js/build/vuex.cc7cb26e.js","js/build/app.d6405832.js","js/build/app.bfbe8f43.css","js/build/@micro-zoe.c2e1472d.js","js/build/jquery.3c667c6c.js","js/build/@babel.49d8906a.js","js/build/dayjs.57a29501.js","js/build/localforage.1cc50bfb.js","js/build/markdown-it.f48c10fc.js","js/build/entities.797c3e49.js","js/build/uc.micro.39573202.js","js/build/mdurl.2f66c031.js","js/build/linkify-it.3ecfda1e.js","js/build/punycode.c1b51344.js","js/build/highlight.js.24fdca15.js","js/build/markdown-it-link-attributes.e1d5d151.js","js/build/@traptitech.b5c819e2.js","js/build/vue.c448ed56.js","js/build/openpgp_hi.15f91b1d.js","js/build/axios.6ec123f8.js","js/build/le5le-store.b40f9152.js","js/build/vue-router.2d566cd7.js","js/build/vue-clipboard2.6e355525.js","js/build/clipboard.7eddb2ef.js","js/build/view-design-hi.d2045547.js","js/build/vuedraggable.dbf1607a.js","js/build/sortablejs.20b8ddfe.js","js/build/vue-resize-observer.452c7636.js","js/build/element-sea.e89b014c.js","js/build/deepmerge.cecf392e.js","js/build/resize-observer-polyfill.9f685ce8.js","js/build/throttle-debounce.7c3948b2.js","js/build/babel-helper-vue-jsx-merge-props.5ed215c3.js","js/build/normalize-wheel.2a034b9f.js","js/build/async-validator.5f40db32.js","js/build/babel-runtime.4773988a.js","js/build/core-js.314b4a1d.js"]),C=()=>s(()=>import("./OnlyOffice.b679b042.js"),["js/build/OnlyOffice.b679b042.js","js/build/OnlyOffice.5570973b.css","js/build/vuex.cc7cb26e.js","js/build/IFrame.24aa89ac.js","js/build/app.d6405832.js","js/build/app.bfbe8f43.css","js/build/@micro-zoe.c2e1472d.js","js/build/jquery.3c667c6c.js","js/build/@babel.49d8906a.js","js/build/dayjs.57a29501.js","js/build/localforage.1cc50bfb.js","js/build/markdown-it.f48c10fc.js","js/build/entities.797c3e49.js","js/build/uc.micro.39573202.js","js/build/mdurl.2f66c031.js","js/build/linkify-it.3ecfda1e.js","js/build/punycode.c1b51344.js","js/build/highlight.js.24fdca15.js","js/build/markdown-it-link-attributes.e1d5d151.js","js/build/@traptitech.b5c819e2.js","js/build/vue.c448ed56.js","js/build/openpgp_hi.15f91b1d.js","js/build/axios.6ec123f8.js","js/build/le5le-store.b40f9152.js","js/build/vue-router.2d566cd7.js","js/build/vue-clipboard2.6e355525.js","js/build/clipboard.7eddb2ef.js","js/build/view-design-hi.d2045547.js","js/build/vuedraggable.dbf1607a.js","js/build/sortablejs.20b8ddfe.js","js/build/vue-resize-observer.452c7636.js","js/build/element-sea.e89b014c.js","js/build/deepmerge.cecf392e.js","js/build/resize-observer-polyfill.9f685ce8.js","js/build/throttle-debounce.7c3948b2.js","js/build/babel-helper-vue-jsx-merge-props.5ed215c3.js","js/build/normalize-wheel.2a034b9f.js","js/build/async-validator.5f40db32.js","js/build/babel-runtime.4773988a.js","js/build/core-js.314b4a1d.js"]),x=()=>s(()=>import("./Drawio.2744e356.js"),["js/build/Drawio.2744e356.js","js/build/Drawio.6a04e353.css","js/build/vuex.cc7cb26e.js","js/build/IFrame.24aa89ac.js","js/build/app.d6405832.js","js/build/app.bfbe8f43.css","js/build/@micro-zoe.c2e1472d.js","js/build/jquery.3c667c6c.js","js/build/@babel.49d8906a.js","js/build/dayjs.57a29501.js","js/build/localforage.1cc50bfb.js","js/build/markdown-it.f48c10fc.js","js/build/entities.797c3e49.js","js/build/uc.micro.39573202.js","js/build/mdurl.2f66c031.js","js/build/linkify-it.3ecfda1e.js","js/build/punycode.c1b51344.js","js/build/highlight.js.24fdca15.js","js/build/markdown-it-link-attributes.e1d5d151.js","js/build/@traptitech.b5c819e2.js","js/build/vue.c448ed56.js","js/build/openpgp_hi.15f91b1d.js","js/build/axios.6ec123f8.js","js/build/le5le-store.b40f9152.js","js/build/vue-router.2d566cd7.js","js/build/vue-clipboard2.6e355525.js","js/build/clipboard.7eddb2ef.js","js/build/view-design-hi.d2045547.js","js/build/vuedraggable.dbf1607a.js","js/build/sortablejs.20b8ddfe.js","js/build/vue-resize-observer.452c7636.js","js/build/element-sea.e89b014c.js","js/build/deepmerge.cecf392e.js","js/build/resize-observer-polyfill.9f685ce8.js","js/build/throttle-debounce.7c3948b2.js","js/build/babel-helper-vue-jsx-merge-props.5ed215c3.js","js/build/normalize-wheel.2a034b9f.js","js/build/async-validator.5f40db32.js","js/build/babel-runtime.4773988a.js","js/build/core-js.314b4a1d.js"]),S=()=>s(()=>import("./Minder.c7643a13.js"),["js/build/Minder.c7643a13.js","js/build/Minder.1839e1ef.css","js/build/IFrame.24aa89ac.js","js/build/app.d6405832.js","js/build/app.bfbe8f43.css","js/build/@micro-zoe.c2e1472d.js","js/build/jquery.3c667c6c.js","js/build/@babel.49d8906a.js","js/build/dayjs.57a29501.js","js/build/localforage.1cc50bfb.js","js/build/markdown-it.f48c10fc.js","js/build/entities.797c3e49.js","js/build/uc.micro.39573202.js","js/build/mdurl.2f66c031.js","js/build/linkify-it.3ecfda1e.js","js/build/punycode.c1b51344.js","js/build/highlight.js.24fdca15.js","js/build/markdown-it-link-attributes.e1d5d151.js","js/build/@traptitech.b5c819e2.js","js/build/vue.c448ed56.js","js/build/vuex.cc7cb26e.js","js/build/openpgp_hi.15f91b1d.js","js/build/axios.6ec123f8.js","js/build/le5le-store.b40f9152.js","js/build/vue-router.2d566cd7.js","js/build/vue-clipboard2.6e355525.js","js/build/clipboard.7eddb2ef.js","js/build/view-design-hi.d2045547.js","js/build/vuedraggable.dbf1607a.js","js/build/sortablejs.20b8ddfe.js","js/build/vue-resize-observer.452c7636.js","js/build/element-sea.e89b014c.js","js/build/deepmerge.cecf392e.js","js/build/resize-observer-polyfill.9f685ce8.js","js/build/throttle-debounce.7c3948b2.js","js/build/babel-helper-vue-jsx-merge-props.5ed215c3.js","js/build/normalize-wheel.2a034b9f.js","js/build/async-validator.5f40db32.js","js/build/babel-runtime.4773988a.js","js/build/core-js.314b4a1d.js"]),L={name:"FileContent",components:{IFrame:h,FileHistory:_,AceEditor:D,TEditor:g,VMEditor:$,OnlyOffice:C,Drawio:x,Minder:S,VMPreview:w},props:{value:{type:Boolean,default:!1},file:{type:Object,default:()=>({})}},data(){return{ready:!1,loadSave:0,loadContent:0,unsaveTip:!1,fileExt:null,contentDetail:null,contentBak:{},editUser:[],loadPreview:!0,linkShow:!1,linkData:{},linkLoad:0,historyShow:!1,officeReady:!1,edit:!1}},mounted(){this.edit=!this.windowPortrait,document.addEventListener("keydown",this.keySave),window.addEventListener("message",this.handleOfficeMessage),this.$isSubElectron&&(window.__onBeforeUnload=()=>{if(!this.equalContent)return $A.modalConfirm({content:"\u4FEE\u6539\u7684\u5185\u5BB9\u5C1A\u672A\u4FDD\u5B58\uFF0C\u786E\u5B9A\u8981\u653E\u5F03\u4FEE\u6539\u5417\uFF1F",cancelText:"\u53D6\u6D88",okText:"\u653E\u5F03",onOk:()=>{this.$Electron.sendMessage("windowDestroy")}}),!0})},beforeDestroy(){document.removeEventListener("keydown",this.keySave),window.removeEventListener("message",this.handleOfficeMessage)},watch:{value:{handler(t){t?(this.ready=!0,this.editUser=[this.userId],this.getContent()):(this.linkShow=!1,this.historyShow=!1,this.officeReady=!1,this.fileExt=null)},immediate:!0},historyShow(t){!t&&this.$refs.historyTip&&this.$refs.historyTip.updatePopper()},wsMsg:{handler(t){const{type:n,action:e,data:i}=t;switch(n){case"path":i.path=="/single/file/"+this.fileId&&(this.editUser=i.userids);break;case"file":if(e=="content"&&this.value&&i.id==this.fileId){const a=["\u56E2\u961F\u6210\u5458\u300C"+t.nickname+"\u300D\u66F4\u65B0\u4E86\u5185\u5BB9\uFF0C","\u66F4\u65B0\u65F6\u95F4\uFF1A"+$A.dayjs(t.time).format("YYYY-MM-DD HH:mm:ss")+"\u3002","","\u70B9\u51FB\u3010\u786E\u5B9A\u3011\u52A0\u8F7D\u6700\u65B0\u5185\u5BB9\u3002"];$A.modalConfirm({language:!1,title:this.$L("\u66F4\u65B0\u63D0\u793A"),content:a.map(o=>`<p>${o?this.$L(o):"&nbsp;"}</p>`).join(""),onOk:()=>{this.getContent()}})}break}},deep:!0}},computed:{...d(["wsMsg"]),fileId(){return this.file.id||0},fileName(){return this.fileExt?$A.getFileName(Object.assign(this.file,{ext:this.fileExt})):$A.getFileName(this.file)},equalContent(){return this.contentBak==$A.jsonStringify(this.contentDetail)},contentLoad(){return this.loadContent>0||this.previewLoad},isPreview(){return this.contentDetail&&this.contentDetail.preview===!0},previewLoad(){return this.isPreview&&this.loadPreview===!0},previewUrl(){if(this.isPreview){const{name:t,key:n}=this.contentDetail;return $A.onlinePreviewUrl(t,n)}return""}},methods:{handleOfficeMessage({data:t,source:n}){if(t.source==="onlyoffice")switch(t.action){case"ready":n.postMessage("createMenu","*");break;case"link":this.handleClick("link");break;case"history":const e=this.$refs.officeHeader;e&&(e.style.top=`${t.rect.top}px`,e.style.left=`${t.rect.left}px`,e.style.width=`${t.rect.width}px`,e.style.height=`${t.rect.height}px`,e.click());break}},onFrameLoad(){this.loadPreview=!1},keySave(t){this.value&&t.keyCode===83&&(t.metaKey||t.ctrlKey)&&(t.preventDefault(),this.onSaveSave())},getContent(){if(this.fileId===0){this.contentDetail={},this.updateBak();return}if(["word","excel","ppt"].includes(this.file.type)){this.contentDetail=$A.cloneJSON(this.file),this.updateBak();return}this.loadSave++,setTimeout(t=>{this.loadContent++},600),this.$store.dispatch("call",{url:"file/content",data:{id:this.fileId}}).then(({data:t})=>{this.contentDetail=t.content,this.updateBak()}).catch(({msg:t})=>{$A.modalError(t)}).finally(t=>{this.loadSave--,this.loadContent--})},updateBak(){this.contentBak=$A.jsonStringify(this.contentDetail)},handleClick(t){switch(t){case"link":this.linkData={id:this.fileId,name:this.file.name},this.linkShow=!0,this.linkGet();break;case"saveBefore":!this.equalContent&&this.loadSave==0?this.handleClick("save"):$A.messageWarning("\u6CA1\u6709\u4EFB\u4F55\u4FEE\u6539\uFF01");break;case"save":if(this.file.only_view)return;this.updateBak(),this.loadSave++,this.$store.dispatch("call",{url:"file/content/save",method:"post",data:{id:this.fileId,content:this.contentBak}}).then(({data:n,msg:e})=>{$A.messageSuccess(e);const i={id:this.fileId,size:n.size};this.fileExt&&(i.ext=this.fileExt,this.fileExt=null),this.edit=!this.windowPortrait,this.$store.dispatch("saveFile",i)}).catch(({msg:n})=>{$A.modalError(n),this.getContent()}).finally(n=>{this.loadSave--});break;case"officeReady":this.officeReady=!0;break}},onRestoreHistory(t){this.historyShow=!1,$A.modalConfirm({content:`\u4F60\u786E\u5B9A\u6587\u4EF6\u8FD8\u539F\u81F3\u3010${t.created_at}\u3011\u5417\uFF1F`,cancelText:"\u53D6\u6D88",okText:"\u786E\u5B9A",loading:!0,onOk:()=>new Promise((n,e)=>{this.$store.dispatch("call",{url:"file/content/restore",data:{id:this.fileId,history_id:t.id}}).then(({msg:i})=>{n(i),this.contentDetail=null,this.getContent()}).catch(({msg:i})=>{e(i)})})})},linkGet(t){this.linkLoad++,this.$store.dispatch("call",{url:"file/link",data:{id:this.linkData.id,refresh:t===!0?"yes":"no"}}).then(({data:n})=>{this.linkData=Object.assign(n,{id:this.linkData.id,name:this.linkData.name}),this.linkCopy()}).catch(({msg:n})=>{this.linkShow=!1,$A.modalError(n)}).finally(n=>{this.linkLoad--})},linkCopy(){!this.linkData.url||(this.linkFocus(),this.copyText(this.linkData.url))},linkFocus(){this.$nextTick(t=>{this.$refs.linkInput.focus({cursor:"all"})})},exportMenu(t){switch(this.file.type){case"mind":this.$refs.myMind.exportHandle(t,this.file.name);break}},unSaveGive(){this.getContent(),this.unsaveTip=!1},onSaveSave(){this.handleClick("save"),this.unsaveTip=!1},setTextType(t){this.fileExt=t,this.$set(this.contentDetail,"type",t)},documentKey(){return new Promise((t,n)=>{this.$store.dispatch("call",{url:"file/content",data:{id:this.fileId,only_update_at:"yes"}}).then(({data:e})=>{t(`${e.id}-${$A.dayjs(e.update_at).unix()}`)}).catch(e=>{n(e)})})}}},l={};var b=c(L,y,k,!1,E,null,null,null);function E(t){for(let n in l)this[n]=l[n]}var pt=function(){return b.exports}();export{pt as default};
