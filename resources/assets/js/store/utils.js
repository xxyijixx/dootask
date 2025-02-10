/**
 * @param key
 * @param requestData
 * @param state
 * @returns {$callData}
 */
function __callData(key, requestData, state) {
    if (!$A.isJson(requestData)) {
        requestData = {}
    }
    const callKey = key + "::" + encodeURIComponent(new URLSearchParams($A.sortObject(requestData, [
        'page',
        'pagesize',
        'timerange',
    ])).toString())
    const callData = state.callAt.find(item => item.key === callKey) || {}
    callData.__last = $A.dayjs().unix()
    if (typeof callData.key === "undefined") {
        callData.key = callKey
        callData.updated = 0
        callData.deleted = 0
        state.callAt.push(callData)
        $A.IDBSet("callAt", state.callAt).catch(_ => { })
    }

    /**
     * @returns {*}
     */
    this.get = () => {
        requestData.timerange = requestData.timerange || `${callData.updated || 0},${callData.deleted || 0}`
        return requestData
    }

    /**
     * @param total
     * @param current_page
     * @param deleted_id
     * @returns {Promise<unknown>}
     */
    this.save = ({total, current_page, deleted_id}) => {
        return new Promise(async resolve => {
            if (current_page !== 1) {
                return
            }
            let hasUpdate = false
            const time = callData.__last || $A.dayjs().unix()
            if (total > 0) {
                callData.updated = time
                hasUpdate = true
            }
            if ($A.isArray(deleted_id) && deleted_id.length > 0) {
                callData.deleted = time
                hasUpdate = true
            } else {
                deleted_id = []
            }
            if (hasUpdate) {
                await $A.IDBSet("callAt", state.callAt)
            }
            resolve(deleted_id)
        })
    }

    return this
}

export function $callData(key, requestData, state) {
    return new __callData(key, requestData, state)
}

export function $urlSafe(value, encode = true) {
    if (value) {
        if (encode) {
            value = String(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/\n/g, '$')
        } else {
            value = String(value).replace(/\-/g, "+").replace(/\_/g, "/").replace(/\$/g, '\n')
        }
    }
    return value
}

/**
 * EventSource
 */
const SSEDefaultOptions = {
    retry: 5,
    interval: 3 * 1000,
}

export class SSEClient {
    constructor(url, options = SSEDefaultOptions) {
        this.url = url;
        this.es = null;
        this.options = options;
        this.retry = options.retry;
        this.timer = null;
    }

    _onOpen() {
        if (window.systemInfo.debug === "yes") {
            console.log("SSE open: " + this.url);
        }
    }

    _onMessage(type, handler) {
        return (event) => {
            this.retry = this.options.retry;
            if (typeof handler === "function") {
                handler(type, event);
            }
        };
    }

    _onError(type, handler) {
        return () => {
            if (window.systemInfo.debug === "yes") {
                console.log("SSE retry: " + this.url);
            }
            if (this.es) {
                this._removeAllEvent(type, handler);
                this.unsunscribe();
            }

            if (this.retry > 0) {
                this.retry--;
                this.timer = setTimeout(() => {
                    this.subscribe(type, handler);
                }, this.options.interval);
            }
        };
    }

    _removeAllEvent(type, handler) {
        type = $A.isArray(type) ? type : [type]
        this.es.removeEventListener("open", this._onOpen);
        type.some(item => {
            this.es.removeEventListener(item, this._onMessage(item, handler));
        })
        this.es.removeEventListener("error", this._onError(type, handler));
    }

    subscribe(type, handler) {
        type = $A.isArray(type) ? type : [type]
        this.es = new EventSource(this.url);
        this.es.addEventListener("open", this._onOpen);
        type.some(item => {
            this.es.addEventListener(item, this._onMessage(item, handler));
        })
        this.es.addEventListener("error", this._onError(type, handler));
    }

    unsunscribe() {
        if (this.es) {
            this.es.close();
            this.es = null;
        }
        if (this.timer) {
            clearTimeout(this.timer);
        }
        if (window.systemInfo.debug === "yes") {
            console.log("SSE cancel: " + this.url);
        }
    }
}


const __AIModelData = {
    openai: [
        {value: 'gpt-4', label: 'GPT-4'},
        {value: 'gpt-4-turbo', label: 'GPT-4 Turbo'},
        {value: 'gpt-4o', label: 'GPT-4o'},
        {value: 'gpt-4o-mini', label: 'GPT-4o Mini'},
        {value: 'o1', label: 'GPT-o1'},
        {value: 'o1-mini', label: 'GPT-o1 Mini'},
        {value: 'o3-mini', label: 'GPT-o3 Mini'},
        {value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo'},
        {value: 'gpt-3.5-turbo-16k', label: 'GPT-3.5 Turbo 16K'},
        {value: 'gpt-3.5-turbo-0125', label: 'GPT-3.5 Turbo 0125'},
        {value: 'gpt-3.5-turbo-1106', label: 'GPT-3.5 Turbo 1106'}
    ],
    claude: [
        {value: 'claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet'},
        {value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet 20241022'},
        {value: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku'},
        {value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku 20241022'},
        {value: 'claude-3-opus-latest', label: 'Claude 3 Opus'},
        {value: 'claude-3-opus-20240229', label: 'Claude 3 Opus 20240229'},
        {value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku 20240307'},
        {value: 'claude-2.1', label: 'Claude 2.1'},
        {value: 'claude-2.0', label: 'Claude 2.0'}
    ],
    deepseek: [
        {value: 'deepseek-chat', label: 'DeepSeek V3'},
        {value: 'deepseek-reasoner', label: 'DeepSeek R1'}
    ],
    wenxin: [
        {value: 'ernie-4.0-8k', label: 'Ernie 4.0 8K'},
        {value: 'ernie-4.0-8k-latest', label: 'Ernie 4.0 8K Latest'},
        {value: 'ernie-4.0-turbo-128k', label: 'Ernie 4.0 Turbo 128K'},
        {value: 'ernie-4.0-turbo-8k', label: 'Ernie 4.0 Turbo 8K'},
        {value: 'ernie-3.5-128k', label: 'Ernie 3.5 128K'},
        {value: 'ernie-3.5-8k', label: 'Ernie 3.5 8K'},
        {value: 'ernie-speed-128k', label: 'Ernie Speed 128K'},
        {value: 'ernie-speed-8k', label: 'Ernie Speed 8K'},
        {value: 'ernie-lite-8k', label: 'Ernie Lite 8K'},
        {value: 'ernie-tiny-8k', label: 'Ernie Tiny 8K'}
    ],
    qianwen: [
        {value: 'qwen-max', label: 'QWEN Max'},
        {value: 'qwen-max-latest', label: 'QWEN Max Latest'},
        {value: 'qwen-turbo', label: 'QWEN Turbo'},
        {value: 'qwen-turbo-latest', label: 'QWEN Turbo Latest'},
        {value: 'qwen-plus', label: 'QWEN Plus'},
        {value: 'qwen-plus-latest', label: 'QWEN Plus Latest'},
        {value: 'qwen-long', label: 'QWEN Long'}
    ],
    gemini: [
        {value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash'},
        {value: 'gemini-2.0-flash-lite-preview-02-05', label: 'Gemini 2.0 Flash-Lite Preview'},
        {value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash'},
        {value: 'gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash 8B'},
        {value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro'},
        {value: 'gemini-1.0-pro', label: 'Gemini 1.0 Pro'}
    ],
    zhipu: [
        {value: 'glm-4', label: 'GLM-4'},
        {value: 'glm-4-plus', label: 'GLM-4 Plus'},
        {value: 'glm-4-air', label: 'GLM-4 Air'},
        {value: 'glm-4-airx', label: 'GLM-4 AirX'},
        {value: 'glm-4-long', label: 'GLM-4 Long'},
        {value: 'glm-4-flash', label: 'GLM-4 Flash'},
        {value: 'glm-4v', label: 'GLM-4V'},
        {value: 'glm-4v-plus', label: 'GLM-4V Plus'},
        {value: 'glm-3-turbo', label: 'GLM-3 Turbo'}
    ]
}

const AIModelList = (email) => {
    const emailMap = {
        "ai-openai@bot.system": "openai",
        "ai-claude@bot.system": "claude",
        "ai-deepseek@bot.system": "deepseek",
        "ai-wenxin@bot.system": "wenxin",
        "ai-qianwen@bot.system": "qianwen",
        "ai-gemini@bot.system": "gemini",
        "ai-zhipu@bot.system": "zhipu"
    };
    email = emailMap[email] || email;
    return __AIModelData[email] || []
}

const AIModelLabel = (email, model) => {
    const item = AIModelList(email).find(item => item.value === model)
    return item ? item.label : model
}

export {AIModelList, AIModelLabel}
