import{M as o}from"./MicroApps.acfc5b9e.js";import{n as m}from"./app.f5216137.js";import"./vue.eaf71fac.js";import"./@traptitech.363dce05.js";import"./katex.0b94f27c.js";import"./vuex.cc7cb26e.js";import"./@micro-zoe.c2e1472d.js";import"./DialogWrapper.0a26bad5.js";import"./le5le-store.b40f9152.js";import"./longpress.5305f240.js";import"./index.b53a0a40.js";import"./quill-hi.c85eceed.js";import"./quill-delta.72524c38.js";import"./fast-diff.f17881f3.js";import"./lodash.clonedeep.91f4d524.js";import"./lodash.isequal.0dd437dc.js";import"./lodash-es.df04b444.js";import"./quill-mention-hi.beaa1617.js";import"./vue-jsonp.be27271b.js";import"./vue-virtual-scroll-list-hi.f3f58d09.js";import"./ImgUpload.5a38663e.js";import"./view-design-hi.76cbd75d.js";import"./details.f2ee94e3.js";import"./jquery.3ff1e387.js";import"./localforage.a4e7e543.js";import"./markdown-it.f3afa976.js";import"./entities.797c3e49.js";import"./uc.micro.39573202.js";import"./mdurl.2f66c031.js";import"./linkify-it.3ecfda1e.js";import"./punycode.87a5269f.js";import"./highlight.js.24fdca15.js";import"./markdown-it-link-attributes.e1d5d151.js";import"./axios.6ec123f8.js";import"./openpgp_hi.15f91b1d.js";import"./vue-router.2d566cd7.js";import"./vue-clipboard2.4402036c.js";import"./clipboard.d74ec60d.js";import"./default-passive-events.a3d698c9.js";import"./vuedraggable.c8fae132.js";import"./sortablejs.8b819437.js";import"./vue-resize-observer.5fb00380.js";import"./element-sea.b954f5d6.js";import"./deepmerge.cecf392e.js";import"./resize-observer-polyfill.e60103ad.js";import"./throttle-debounce.7c3948b2.js";import"./babel-helper-vue-jsx-merge-props.5ed215c3.js";import"./normalize-wheel.2a034b9f.js";import"./async-validator.289edf0d.js";import"./babel-runtime.4773988a.js";import"./core-js.314b4a1d.js";import"./tip.2dadac5a.js";var a=function(){var t=this,r=t.$createElement,i=t._self._c||r;return!t.loading&&t.$route.name=="manage-apps"?i("MicroApps",{attrs:{url:t.appUrl,path:t.path}}):t._e()},e=[];const n={components:{MicroApps:o},data(){return{loading:!1,appUrl:"",path:""}},deactivated(){this.loading=!0},watch:{$route:{handler(t){this.loading=!0,t.name=="manage-apps"?this.$nextTick(()=>{this.loading=!1,this.appUrl={}.VITE_OKR_WEB_URL||$A.apiUrl("../apps/okr"),this.path=this.$route.query.path||""}):this.appUrl=""},immediate:!0}}},p={};var s=m(n,a,e,!1,l,null,null,null);function l(t){for(let r in p)this[r]=p[r]}var st=function(){return s.exports}();export{st as default};
