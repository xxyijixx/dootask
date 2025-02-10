<template>
    <div class="dialog-session-history">
        <div class="session-history-title">{{$L('与 (*) 会话历史', sessionData.name)}}</div>
        <Scrollbar
            ref="list"
            class="session-history-list"
            @on-scroll="listScroll">
            <ul>
                <li v-for="(item, index) in listData" :key="index" @click="onOpen(item)">
                    <div class="history-title">
                        <em v-if="item.is_open">{{$L('当前')}}</em>{{item.title || $L('新会话')}}
                    </div>
                    <div class="history-time" :title="item.created_at">
                        {{$A.timeFormat(item.created_at)}}
                    </div>
                </li>
            </ul>
            <div v-if="listLoad > 0" class="session-history-load">
                <Loading/>
            </div>
        </Scrollbar>
    </div>
</template>

<script>
export default {
    name: "DialogSessionHistory",
    props: {
        sessionData: {
            type: Object,
            default: () => {
                return {};
            }
        },
    },

    data() {
        return {
            openIng: false,

            listData: [],
            listLoad: 0,
            listCurrentPage: 1,
            listHasMorePages: false,
        }
    },

    mounted() {
        this.getListData(1)
    },

    methods: {
        scrollE() {
            if (!this.$refs.list) {
                return 0
            }
            const scrollInfo = this.$refs.list.scrollInfo()
            return scrollInfo.scrollE
        },

        getListData(page) {
            this.listLoad++;
            this.$store.dispatch("call", {
                url: "dialog/session/list",
                data: {
                    dialog_id: this.sessionData.dialog_id,
                    page: page,
                    pagesize: 50
                }
            }).then(({data}) => {
                if (data.current_page === 1) {
                    this.listData = data.data
                } else {
                    this.listData = this.listData.concat(data.data)
                }
                this.listCurrentPage = data.current_page;
                this.listHasMorePages = data.current_page < data.last_page;
                this.$nextTick(this.getListNextPage);
            }).catch(({msg}) => {
                $A.modalError(msg)
            }).finally(_ => {
                this.listLoad--;
            });
        },

        listScroll() {
            if (this.scrollE() < 10) {
                this.getListNextPage()
            }
        },

        getListNextPage() {
            if (this.scrollE() < 10
                && this.listLoad === 0
                && this.listHasMorePages) {
                this.getListData(this.listCurrentPage + 1);
            }
        },

        onOpen(item) {
            if (item.is_open) {
                this.$emit("on-close")
                return
            }
            //
            if (this.openIng) {
                return
            }
            this.openIng = true
            //
            this.$store.dispatch("call", {
                url: "dialog/session/open",
                data: {
                    session_id: item.id,
                }
            }).then(() => {
                this.$emit("on-submit")
            }).catch(({msg}) => {
                $A.modalError(msg)
            }).finally(_ => {
                this.openIng = false;
            });
        }
    }
}
</script>
