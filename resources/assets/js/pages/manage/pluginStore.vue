<template>
    <MicroApps :url="appUrl" :path="path" name="micro-store" :keepAlive="false" v-if="!loading && $route.name == 'manage-store'" />
</template>

<script>
import MicroApps from "../../components/MicroApps.vue";

export default {
    components: { MicroApps },
    data() {
        return {
            loading: false,
            appUrl: '',
            path: '',
        }
    },

    deactivated() {
        this.loading = true;
    },

    watch: {
        '$route': {
            handler(to) {
                this.loading = true;
                if (to.name == 'manage-store') {
                    this.$nextTick(() => {
                        this.loading = false;
                        this.appUrl = import.meta.env.VITE_PLUGIN_STORE_URL || $A.mainUrl("store")
                        this.path = this.$route.query.path || '';
                    })
                }else{
                    this.appUrl = '';
                }
            },
            immediate: true
        }
    }
}
</script>
