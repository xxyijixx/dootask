import{_ as o}from"./openpgp_hi.15f91b1d.js";import{I as l}from"./IFrame.9f15d397.js";import{n as a}from"./app.08b2dd8e.js";import"./@micro-zoe.c2e1472d.js";import"./jquery.fef136e8.js";import"./@traptitech.b72bbaf2.js";import"./katex.3c1bf5d3.js";import"./localforage.a8803b20.js";import"./markdown-it.6d8b0284.js";import"./entities.797c3e49.js";import"./uc.micro.3245408e.js";import"./mdurl.ddaf799d.js";import"./linkify-it.43898b73.js";import"./punycode.e2700674.js";import"./highlight.js.b91af88c.js";import"./markdown-it-link-attributes.e1d5d151.js";import"./vue.b71582de.js";import"./vuex.cc7cb26e.js";import"./axios.6ec123f8.js";import"./le5le-store.bd86c9e9.js";import"./vue-router.2d566cd7.js";import"./vue-clipboard2.5bf49d78.js";import"./clipboard.152d4248.js";import"./view-design-hi.da5871a0.js";import"./vuedraggable.6a7e382b.js";import"./sortablejs.36894852.js";import"./vue-resize-observer.e5bfd86a.js";import"./element-sea.e8c47496.js";import"./deepmerge.cecf392e.js";import"./resize-observer-polyfill.c9b3d7aa.js";import"./throttle-debounce.7c3948b2.js";import"./babel-helper-vue-jsx-merge-props.5ed215c3.js";import"./normalize-wheel.2a034b9f.js";import"./async-validator.7d64741a.js";import"./babel-runtime.4773988a.js";import"./core-js.314b4a1d.js";var s=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"single-file-task"},[e("PageTitle",{attrs:{title:t.title}}),t.loadIng>0?e("Loading"):t.isWait?t._e():[t.isType("md")?e("MDPreview",{attrs:{initialValue:t.fileDetail.content.content}}):t.isType("text")?e("TEditor",{attrs:{value:t.fileDetail.content.content,height:"100%",readOnly:""}}):t.isType("drawio")?e("Drawio",{attrs:{title:t.fileDetail.name,readOnly:""},model:{value:t.fileDetail.content,callback:function(r){t.$set(t.fileDetail,"content",r)},expression:"fileDetail.content"}}):t.isType("mind")?e("Minder",{attrs:{value:t.fileDetail.content,readOnly:""}}):t.isType("code")?e("AceEditor",{staticClass:"view-editor",attrs:{ext:t.fileDetail.ext,readOnly:""},model:{value:t.fileDetail.content.content,callback:function(r){t.$set(t.fileDetail.content,"content",r)},expression:"fileDetail.content.content"}}):t.isType("office")?e("OnlyOffice",{attrs:{code:t.officeCode,documentKey:t.documentKey,readOnly:""},model:{value:t.officeContent,callback:function(r){t.officeContent=r},expression:"officeContent"}}):t.isType("preview")?e("IFrame",{staticClass:"preview-iframe",attrs:{src:t.previewUrl}}):e("div",{staticClass:"no-support"},[t._v(t._s(t.$L("\u4E0D\u652F\u6301\u5355\u72EC\u67E5\u770B\u6B64\u6D88\u606F")))])]],2)},c=[];const p=()=>o(()=>import("./preview.e0ae0c10.js"),["js/build/preview.e0ae0c10.js","js/build/app.08b2dd8e.js","js/build/app.15c0b841.css","js/build/@micro-zoe.c2e1472d.js","js/build/jquery.fef136e8.js","js/build/@traptitech.b72bbaf2.js","js/build/katex.3c1bf5d3.js","js/build/localforage.a8803b20.js","js/build/markdown-it.6d8b0284.js","js/build/entities.797c3e49.js","js/build/uc.micro.3245408e.js","js/build/mdurl.ddaf799d.js","js/build/linkify-it.43898b73.js","js/build/punycode.e2700674.js","js/build/highlight.js.b91af88c.js","js/build/markdown-it-link-attributes.e1d5d151.js","js/build/vue.b71582de.js","js/build/vuex.cc7cb26e.js","js/build/axios.6ec123f8.js","js/build/le5le-store.bd86c9e9.js","js/build/openpgp_hi.15f91b1d.js","js/build/vue-router.2d566cd7.js","js/build/vue-clipboard2.5bf49d78.js","js/build/clipboard.152d4248.js","js/build/view-design-hi.da5871a0.js","js/build/vuedraggable.6a7e382b.js","js/build/sortablejs.36894852.js","js/build/vue-resize-observer.e5bfd86a.js","js/build/element-sea.e8c47496.js","js/build/deepmerge.cecf392e.js","js/build/resize-observer-polyfill.c9b3d7aa.js","js/build/throttle-debounce.7c3948b2.js","js/build/babel-helper-vue-jsx-merge-props.5ed215c3.js","js/build/normalize-wheel.2a034b9f.js","js/build/async-validator.7d64741a.js","js/build/babel-runtime.4773988a.js","js/build/core-js.314b4a1d.js"]),m=()=>o(()=>import("./TEditor.34169dd0.js"),["js/build/TEditor.34169dd0.js","js/build/tinymce.cd1f2de5.js","js/build/@traptitech.b72bbaf2.js","js/build/katex.3c1bf5d3.js","js/build/ImgUpload.11cb7b39.js","js/build/app.08b2dd8e.js","js/build/app.15c0b841.css","js/build/@micro-zoe.c2e1472d.js","js/build/jquery.fef136e8.js","js/build/localforage.a8803b20.js","js/build/markdown-it.6d8b0284.js","js/build/entities.797c3e49.js","js/build/uc.micro.3245408e.js","js/build/mdurl.ddaf799d.js","js/build/linkify-it.43898b73.js","js/build/punycode.e2700674.js","js/build/highlight.js.b91af88c.js","js/build/markdown-it-link-attributes.e1d5d151.js","js/build/vue.b71582de.js","js/build/vuex.cc7cb26e.js","js/build/axios.6ec123f8.js","js/build/le5le-store.bd86c9e9.js","js/build/openpgp_hi.15f91b1d.js","js/build/vue-router.2d566cd7.js","js/build/vue-clipboard2.5bf49d78.js","js/build/clipboard.152d4248.js","js/build/view-design-hi.da5871a0.js","js/build/vuedraggable.6a7e382b.js","js/build/sortablejs.36894852.js","js/build/vue-resize-observer.e5bfd86a.js","js/build/element-sea.e8c47496.js","js/build/deepmerge.cecf392e.js","js/build/resize-observer-polyfill.c9b3d7aa.js","js/build/throttle-debounce.7c3948b2.js","js/build/babel-helper-vue-jsx-merge-props.5ed215c3.js","js/build/normalize-wheel.2a034b9f.js","js/build/async-validator.7d64741a.js","js/build/babel-runtime.4773988a.js","js/build/core-js.314b4a1d.js"]),d=()=>o(()=>import("./AceEditor.2059ed8d.js"),["js/build/AceEditor.2059ed8d.js","js/build/vuex.cc7cb26e.js","js/build/app.08b2dd8e.js","js/build/app.15c0b841.css","js/build/@micro-zoe.c2e1472d.js","js/build/jquery.fef136e8.js","js/build/@traptitech.b72bbaf2.js","js/build/katex.3c1bf5d3.js","js/build/localforage.a8803b20.js","js/build/markdown-it.6d8b0284.js","js/build/entities.797c3e49.js","js/build/uc.micro.3245408e.js","js/build/mdurl.ddaf799d.js","js/build/linkify-it.43898b73.js","js/build/punycode.e2700674.js","js/build/highlight.js.b91af88c.js","js/build/markdown-it-link-attributes.e1d5d151.js","js/build/vue.b71582de.js","js/build/axios.6ec123f8.js","js/build/le5le-store.bd86c9e9.js","js/build/openpgp_hi.15f91b1d.js","js/build/vue-router.2d566cd7.js","js/build/vue-clipboard2.5bf49d78.js","js/build/clipboard.152d4248.js","js/build/view-design-hi.da5871a0.js","js/build/vuedraggable.6a7e382b.js","js/build/sortablejs.36894852.js","js/build/vue-resize-observer.e5bfd86a.js","js/build/element-sea.e8c47496.js","js/build/deepmerge.cecf392e.js","js/build/resize-observer-polyfill.c9b3d7aa.js","js/build/throttle-debounce.7c3948b2.js","js/build/babel-helper-vue-jsx-merge-props.5ed215c3.js","js/build/normalize-wheel.2a034b9f.js","js/build/async-validator.7d64741a.js","js/build/babel-runtime.4773988a.js","js/build/core-js.314b4a1d.js"]),f=()=>o(()=>import("./OnlyOffice.a61e3815.js"),["js/build/OnlyOffice.a61e3815.js","js/build/OnlyOffice.08442fe6.css","js/build/vuex.cc7cb26e.js","js/build/IFrame.9f15d397.js","js/build/app.08b2dd8e.js","js/build/app.15c0b841.css","js/build/@micro-zoe.c2e1472d.js","js/build/jquery.fef136e8.js","js/build/@traptitech.b72bbaf2.js","js/build/katex.3c1bf5d3.js","js/build/localforage.a8803b20.js","js/build/markdown-it.6d8b0284.js","js/build/entities.797c3e49.js","js/build/uc.micro.3245408e.js","js/build/mdurl.ddaf799d.js","js/build/linkify-it.43898b73.js","js/build/punycode.e2700674.js","js/build/highlight.js.b91af88c.js","js/build/markdown-it-link-attributes.e1d5d151.js","js/build/vue.b71582de.js","js/build/axios.6ec123f8.js","js/build/le5le-store.bd86c9e9.js","js/build/openpgp_hi.15f91b1d.js","js/build/vue-router.2d566cd7.js","js/build/vue-clipboard2.5bf49d78.js","js/build/clipboard.152d4248.js","js/build/view-design-hi.da5871a0.js","js/build/vuedraggable.6a7e382b.js","js/build/sortablejs.36894852.js","js/build/vue-resize-observer.e5bfd86a.js","js/build/element-sea.e8c47496.js","js/build/deepmerge.cecf392e.js","js/build/resize-observer-polyfill.c9b3d7aa.js","js/build/throttle-debounce.7c3948b2.js","js/build/babel-helper-vue-jsx-merge-props.5ed215c3.js","js/build/normalize-wheel.2a034b9f.js","js/build/async-validator.7d64741a.js","js/build/babel-runtime.4773988a.js","js/build/core-js.314b4a1d.js"]),_=()=>o(()=>import("./Drawio.741d4b57.js"),["js/build/Drawio.741d4b57.js","js/build/Drawio.fc5c6326.css","js/build/vuex.cc7cb26e.js","js/build/IFrame.9f15d397.js","js/build/app.08b2dd8e.js","js/build/app.15c0b841.css","js/build/@micro-zoe.c2e1472d.js","js/build/jquery.fef136e8.js","js/build/@traptitech.b72bbaf2.js","js/build/katex.3c1bf5d3.js","js/build/localforage.a8803b20.js","js/build/markdown-it.6d8b0284.js","js/build/entities.797c3e49.js","js/build/uc.micro.3245408e.js","js/build/mdurl.ddaf799d.js","js/build/linkify-it.43898b73.js","js/build/punycode.e2700674.js","js/build/highlight.js.b91af88c.js","js/build/markdown-it-link-attributes.e1d5d151.js","js/build/vue.b71582de.js","js/build/axios.6ec123f8.js","js/build/le5le-store.bd86c9e9.js","js/build/openpgp_hi.15f91b1d.js","js/build/vue-router.2d566cd7.js","js/build/vue-clipboard2.5bf49d78.js","js/build/clipboard.152d4248.js","js/build/view-design-hi.da5871a0.js","js/build/vuedraggable.6a7e382b.js","js/build/sortablejs.36894852.js","js/build/vue-resize-observer.e5bfd86a.js","js/build/element-sea.e8c47496.js","js/build/deepmerge.cecf392e.js","js/build/resize-observer-polyfill.c9b3d7aa.js","js/build/throttle-debounce.7c3948b2.js","js/build/babel-helper-vue-jsx-merge-props.5ed215c3.js","js/build/normalize-wheel.2a034b9f.js","js/build/async-validator.7d64741a.js","js/build/babel-runtime.4773988a.js","js/build/core-js.314b4a1d.js"]),u=()=>o(()=>import("./Minder.4490faf9.js"),["js/build/Minder.4490faf9.js","js/build/Minder.3ba64342.css","js/build/IFrame.9f15d397.js","js/build/app.08b2dd8e.js","js/build/app.15c0b841.css","js/build/@micro-zoe.c2e1472d.js","js/build/jquery.fef136e8.js","js/build/@traptitech.b72bbaf2.js","js/build/katex.3c1bf5d3.js","js/build/localforage.a8803b20.js","js/build/markdown-it.6d8b0284.js","js/build/entities.797c3e49.js","js/build/uc.micro.3245408e.js","js/build/mdurl.ddaf799d.js","js/build/linkify-it.43898b73.js","js/build/punycode.e2700674.js","js/build/highlight.js.b91af88c.js","js/build/markdown-it-link-attributes.e1d5d151.js","js/build/vue.b71582de.js","js/build/vuex.cc7cb26e.js","js/build/axios.6ec123f8.js","js/build/le5le-store.bd86c9e9.js","js/build/openpgp_hi.15f91b1d.js","js/build/vue-router.2d566cd7.js","js/build/vue-clipboard2.5bf49d78.js","js/build/clipboard.152d4248.js","js/build/view-design-hi.da5871a0.js","js/build/vuedraggable.6a7e382b.js","js/build/sortablejs.36894852.js","js/build/vue-resize-observer.e5bfd86a.js","js/build/element-sea.e8c47496.js","js/build/deepmerge.cecf392e.js","js/build/resize-observer-polyfill.c9b3d7aa.js","js/build/throttle-debounce.7c3948b2.js","js/build/babel-helper-vue-jsx-merge-props.5ed215c3.js","js/build/normalize-wheel.2a034b9f.js","js/build/async-validator.7d64741a.js","js/build/babel-runtime.4773988a.js","js/build/core-js.314b4a1d.js"]),v={components:{IFrame:l,AceEditor:d,TEditor:m,MDPreview:p,OnlyOffice:f,Drawio:_,Minder:u},data(){return{loadIng:0,isWait:!1,fileDetail:{}}},mounted(){},watch:{$route:{handler(){this.getInfo()},immediate:!0}},computed:{fileId(){const{fileId:t}=this.$route.params;return parseInt(/^\d+$/.test(t)?t:0)},title(){const{name:t}=this.fileDetail;return t||"Loading..."},isType(){const{fileDetail:t}=this;return function(i){return t.file_mode==i}},officeContent(){return{id:this.fileDetail.id||0,type:this.fileDetail.ext,name:this.title}},officeCode(){return"taskFile_"+this.fileDetail.id},previewUrl(){const{name:t,key:i}=this.fileDetail.content;return $A.apiUrl(`../online/preview/${t}?key=${i}`)}},methods:{getInfo(){this.fileId<=0||(setTimeout(t=>{this.loadIng++},600),this.isWait=!0,this.$store.dispatch("call",{url:"project/task/filedetail",data:{file_id:this.fileId}}).then(({data:t})=>{this.fileDetail=t}).catch(({msg:t})=>{$A.modalError({content:t,onOk:()=>{this.$Electron&&window.close()}})}).finally(t=>{this.loadIng--,this.isWait=!1}))},documentKey(){return new Promise((t,i)=>{this.$store.dispatch("call",{url:"project/task/filedetail",data:{file_id:this.fileId,only_update_at:"yes"}}).then(({data:e})=>{t(`${e.id}-${$A.Time(e.update_at)}`)}).catch(e=>{i(e)})})}}},n={};var h=a(v,s,c,!1,D,null,null,null);function D(t){for(let i in n)this[i]=n[i]}var et=function(){return h.exports}();export{et as default};
