import{M as o}from"./MicroApps.e1068ed1.js";import{n as m}from"./app.08b2dd8e.js";import"./vue.b71582de.js";import"./@traptitech.b72bbaf2.js";import"./katex.3c1bf5d3.js";import"./vuex.cc7cb26e.js";import"./@micro-zoe.c2e1472d.js";import"./DialogWrapper.2ee7583b.js";import"./le5le-store.bd86c9e9.js";import"./longpress.c69d0833.js";import"./index.3f7f0349.js";import"./quill.3119dd88.js";import"./quill-mention-hi.28a68c12.js";import"./vue-jsonp.be27271b.js";import"./vue-virtual-scroll-list-hi.599412ba.js";import"./ImgUpload.11cb7b39.js";import"./view-design-hi.da5871a0.js";import"./details.754f74c8.js";import"./jquery.fef136e8.js";import"./localforage.a8803b20.js";import"./markdown-it.6d8b0284.js";import"./entities.797c3e49.js";import"./uc.micro.3245408e.js";import"./mdurl.ddaf799d.js";import"./linkify-it.43898b73.js";import"./punycode.e2700674.js";import"./highlight.js.b91af88c.js";import"./markdown-it-link-attributes.e1d5d151.js";import"./axios.6ec123f8.js";import"./openpgp_hi.15f91b1d.js";import"./vue-router.2d566cd7.js";import"./vue-clipboard2.5bf49d78.js";import"./clipboard.152d4248.js";import"./vuedraggable.6a7e382b.js";import"./sortablejs.36894852.js";import"./vue-resize-observer.e5bfd86a.js";import"./element-sea.e8c47496.js";import"./deepmerge.cecf392e.js";import"./resize-observer-polyfill.c9b3d7aa.js";import"./throttle-debounce.7c3948b2.js";import"./babel-helper-vue-jsx-merge-props.5ed215c3.js";import"./normalize-wheel.2a034b9f.js";import"./async-validator.7d64741a.js";import"./babel-runtime.4773988a.js";import"./core-js.314b4a1d.js";import"./tip.e1d4ce9f.js";var e=function(){var t=this,r=t.$createElement,i=t._self._c||r;return i("div",{staticClass:"electron-single-micro-apps"},[!t.loading&&t.$route.name=="single-apps"?i("MicroApps",{attrs:{url:t.appUrl,path:t.path}}):t._e()],1)},a=[];const s={components:{MicroApps:o},data(){return{loading:!1,appUrl:"",path:""}},deactivated(){this.loading=!0},watch:{$route:{handler(t){this.loading=!0,t.name=="single-apps"?this.$nextTick(()=>{this.loading=!1,this.appUrl={}.VITE_OKR_WEB_URL||$A.apiUrl("../apps/okr"),this.path=this.$route.query.path||""}):this.appUrl=""},immediate:!0}}},p={};var n=m(s,e,a,!1,l,null,null,null);function l(t){for(let r in p)this[r]=p[r]}var pt=function(){return n.exports}();export{pt as default};
