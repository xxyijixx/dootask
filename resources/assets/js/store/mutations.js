export default {
    /**
     * 设置云存储状态
     * @param state
     * @param data {id, status}
     */
    SET_CLOUD_STORAGE(state, {id, status}) {
        state.cacheCloudStorage[id] = status;
    }
}
