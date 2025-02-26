<template>
    <div class="electron-task">
        <PageTitle :title="taskInfo.name"/>
        <Loading v-if="loadIng > 0"/>
        <TaskDetail v-else ref="taskDetail" :task-id="taskInfo.id" :open-task="taskInfo" :can-update-blur="canUpdateBlur"/>
    </div>
</template>

<style lang="scss" scoped>
.electron-task {
    height: 100%;
    display: flex;
    flex-direction: column;
    .task-detail {
        flex: 1;
        margin: 0;
        padding: 18px 22px;
        border-radius: 0;
        overflow: auto;
    }
}
</style>
<style lang="scss">
.electron-task {
    .task-detail {
        .task-info {
            .head {
                .function {
                    margin-right: 0;
                    .open {
                        display: none;
                    }
                }
            }
        }
    }
}
</style>
<script>
import TaskDetail from "../manage/components/TaskDetail";
import {mapState} from "vuex";

export default {
    components: {TaskDetail},
    data() {
        return {
            loadIng: 0,
            canUpdateBlur: true
        }
    },
    mounted() {
        document.addEventListener('keydown', this.shortcutEvent);
        //
        if (this.$isSubElectron) {
            window.__onBeforeUnload = () => {
                this.$store.dispatch("onBeforeUnload");
                if (this.$refs.taskDetail.checkUpdate()) {
                    this.canUpdateBlur = false;
                    $A.modalConfirm({
                        content: '修改的内容尚未保存，真的要放弃修改吗？',
                        cancelText: '取消',
                        okText: '放弃',
                        onOk: () => {
                            this.$Electron.sendMessage('windowDestroy');
                        },
                        onCancel: () => {
                            this.$refs.taskDetail.checkUpdate(false);
                            this.canUpdateBlur = true;
                        }
                    });
                    return true
                }
            }
        }
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.shortcutEvent);
    },
    computed: {
        ...mapState(['cacheTasks']),

        taskId() {
            const {taskId} = this.$route.params;
            return parseInt(/^\d+$/.test(taskId) ? taskId : 0);
        },

        taskInfo() {
            return this.cacheTasks.find(({id}) => id === this.taskId) || {}
        }
    },
    watch: {
        taskId: {
            handler() {
                this.getInfo();
            },
            immediate: true
        },
    },
    methods: {
        getInfo() {
            if (this.taskId <= 0) {
                return;
            }
            this.loadIng++;
            this.$store.dispatch("getTaskOne", {
                task_id: this.taskId,
                archived: 'all'
            }).then(() => {
                this.$store.dispatch("getTaskContent", this.taskId);
                this.$store.dispatch("getTaskFiles", this.taskId);
                this.$store.dispatch("getTaskForParent", this.taskId).catch(() => {})
                this.$store.dispatch("getTaskPriority", 1000)
            }).catch(({msg}) => {
                $A.modalError({
                    content: msg,
                    onOk: () => {
                        if (this.$Electron) {
                            window.close();
                        }
                    }
                });
            }).finally(_ => {
                this.loadIng--;
            });
        },
        shortcutEvent(e) {
            if (e.metaKey || e.ctrlKey) {
                if (e.keyCode === 83) {
                    e.preventDefault();
                    this.$refs.taskDetail.checkUpdate(true)
                }
            }
        },
    }
}
</script>
