<template>
    <div class="page-microapp">
        <transition name="microapp-load" v-if="showSpin">
            <div class="microapp-load">
                <Loading/>
            </div>
        </transition>
        <micro-app
            v-if="url && !loading"
            :name='name'
            :url='url'
            inline
            :keep-alive="keepAlive"
            :data='appData'
            @created='handleCreate'
            @beforemount='handleBeforeMount'
            @mounted='handleMount'
            @unmount='handleUnmount'
            @error='handleError'
            @datachange='handleDataChange'
        />
    </div>
</template>

<script>
import Vue from 'vue'
import store from '../store/index'
import {mapState} from "vuex";
import {EventCenterForMicroApp, unmountAllApps} from '@micro-zoe/micro-app'
import DialogWrapper from '../pages/manage/components/DialogWrapper.vue'
import UserSelect from "./UserSelect.vue";
import {languageList, languageName} from "../language";
import {DatePicker} from 'view-design-hi';

export default {
    name: "MicroApps",
    props: {
        name: {
            type: String,
            default: "micro-app"
        },
        url: {
            type: String,
            default: ""
        },
        path: {
            type: String,
            default: ""
        },
        datas: {
            type: Object,
            default: () => {
            }
        },
        keepAlive: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            showSpin: false,
            loading: false,
            appData: {},
        }
    },
    mounted() {
        this.showSpin = true;
        this.appData = this.getAppData
    },
    watch: {
        loading(val) {
            if (val) {
                this.showSpin = true;
            }
        },
        path(val) {
            this.appData = {path: val}
        },
        datas: {
            handler(info) {
                this.appData = info
            },
            deep: true,
        },
        '$route': {
            handler(to) {
                if (to.name == 'manage-apps' || to.name == 'single-apps' || to.name == 'manage-store') {
                    this.appData = {
                        path: to.hash || to.fullPath
                    }
                }
            },
            immediate: true,
        },
        userToken(val) {
            this.appData = this.getAppData;
            if (!val) {
                unmountAllApps({destroy: true})
                this.loading = true;
            } else {
                this.loading = false;
            }
        },
    },
    computed: {
        ...mapState([
            'userInfo',
            'themeName',
        ]),
        getAppData() {
            return {
                type: 'init',
                url: this.url,
                vues: {
                    Vue,
                    store,
                    components: {
                        DialogWrapper,
                        UserSelect,
                        DatePicker
                    }
                },
                theme: this.themeName,
                languages: {
                    languageList,
                    languageName,
                    languageType: languageName,
                },
                userInfo: this.userInfo,
                path: this.path,
                electron: this.$Electron,

                openAppChildPage: (objects) => {
                    this.$store.dispatch('openAppChildPage', objects);
                },
                openChildWindow: (params) => {
                    this.$store.dispatch('openChildWindow', params);
                },
                openWebTabWindow: (url) => {
                    this.$store.dispatch('openWebTabWindow', url);
                },
            }
        }
    },
    methods: {
        handleCreate(e) {
            // 创建前
            window.eventCenterForAppNameVite = new EventCenterForMicroApp(e.detail.name)
            this.appData = this.getAppData
            this.showSpin = !window["eventCenterForAppNameViteLoad-" + e.detail.name]
        },
        handleBeforeMount(e) {
            window["eventCenterForAppNameViteLoad-" + e.detail.name] = 1;
        },
        handleMount(e) {
            // 加载完成
            if (this.datas) {
                this.appData = this.datas;
            }
            if (this.path) {
                this.appData.path = this.path
            }
            // 对"micro-store"进行代理
            if (this.name === "micro-store") {
                this.setupProxy();
            }
            this.showSpin = false;
        },
        handleUnmount(e) {
             // 卸载
            if (this.name === "micro-store") {
                this.removeProxy();
            }
            window.dispatchEvent(new Event('apps-unmount'));
        },
        handleError(e) { },
        handleDataChange(e) { },
        setupProxy() {
            // 添加代理逻辑
            Object.defineProperty(document, "body", {
                get() {
                    const microAppBody = document.querySelector("micro-app-body");
                    return microAppBody ? microAppBody : document.body;
                },
                configurable: true,
            });
        },
        removeProxy() {
            // 获取原始的 document.body 描述符
            const originalBodyDescriptor = Object.getOwnPropertyDescriptor(document, "body");

            // 如果存在 get 函数，恢复为原始的 document.body
            if (originalBodyDescriptor?.get) {
                console.log("Restoring original document.body");

                // 直接设置 document.body 为查询到的 body 元素
                Object.defineProperty(document, "body", {
                    get() {
                        return document.querySelector("body");
                    },
                    configurable: true
                });
            } else {
                console.log("No existing getter found for document.body, no need to restore");
            }

            // 确保没有多次定义 document.body
            const currentBody = document.querySelector("body");
            console.log("document.body", document.body, currentBody);
            
        }
    }
}
</script>
