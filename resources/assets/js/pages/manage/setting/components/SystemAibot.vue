<template>
    <div class="setting-component-item">
        <Form
            ref="formData"
            :model="formData"
            :rules="ruleData"
            v-bind="formOptions"
            @submit.native.prevent>
            <div class="block-setting-box" v-if="aiConfig[type]">
                <h3>{{ type }}</h3>
                <div class="form-box">
                    <template v-for="field in aiConfig[type].fields">
                        <FormItem :label="$L(field.label)" :prop="field.prop">
                            <template v-if="field.type === 'password'">
                                <Input
                                    :maxlength="255"
                                    v-model="formData[field.prop]"
                                    type="password"
                                    :placeholder="$L(field.placeholder)"/>
                            </template>
                            <template v-else-if="field.type === 'model'">
                                <Select
                                    v-model="formData[field.prop]"
                                    @on-create="modelCreate($event, field.options)"
                                    filterable
                                    allow-create
                                    transfer>
                                    <Option v-for="item in modelOption(formData[field.prop], field.options)" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </template>
                            <template v-else-if="field.type === 'textarea'">
                                <Input
                                    :maxlength="500"
                                    type="textarea"
                                    :autosize="{minRows:2,maxRows:5}"
                                    v-model="formData[field.prop]"
                                    :placeholder="$L(field.placeholder)"/>
                            </template>
                            <template v-else>
                                <Input
                                    :maxlength="500"
                                    v-model="formData[field.prop]"
                                    :placeholder="$L(field.placeholder)"/>
                            </template>
                            <div v-if="field.link || field.tip" class="form-tip">
                                <template v-if="field.link">
                                    {{$L(field.tipPrefix || '获取方式')}} <a :href="field.link" target="_blank">{{ field.link }}</a>
                                </template>
                                <template v-else-if="field.tip">
                                    {{$L(field.tip)}}
                                </template>
                            </div>
                        </FormItem>
                    </template>
                </div>
            </div>
        </Form>
        <div class="setting-footer">
            <Button :loading="loadIng > 0" type="primary" @click="submitForm">{{ $L('提交') }}</Button>
            <Button :loading="loadIng > 0" @click="resetForm">{{ $L('重置') }}</Button>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";
import {AIModelList} from "../../../../store/utils";

export default {
    name: "SystemAibot",
    props: {
        type: {
            default: ''
        }
    },
    data() {
        return {
            loadIng: 0,
            formData: {},
            ruleData: {},
            aiConfig: {
                ChatGPT: {
                    fields: [
                        {
                            label: 'API Key',
                            prop: 'openai_key',
                            type: 'password',
                            placeholder: 'OpenAI API Key',
                            tipPrefix: '访问OpenAI网站查看',
                            link: 'https://platform.openai.com/account/api-keys'
                        },
                        {
                            label: '默认模型',
                            prop: 'openai_model',
                            type: 'model',
                            options: AIModelList('openai'),
                            placeholder: '请输入模型名称',
                            tipPrefix: '查看说明',
                            link: 'https://platform.openai.com/docs/models'
                        },
                        {
                            label: 'Base URL',
                            prop: 'openai_base_url',
                            placeholder: 'Enter base URL...',
                            tip: 'API请求的基础URL路径，如果没有请留空'
                        },
                        {
                            label: '使用代理',
                            prop: 'openai_agency',
                            placeholder: '支持 http 或 socks 代理',
                            tip: '例如：http://proxy.com 或 socks5://proxy.com'
                        },
                        {
                            label: 'Temperature',
                            prop: 'openai_temperature',
                            placeholder: '模型温度，低则保守，高则多样',
                            tip: '例如：0.7，范围：0-1，默认：0.7'
                        },
                        {
                            label: '默认提示词',
                            prop: 'openai_system',
                            type: 'textarea',
                            placeholder: '请输入默认提示词',
                            tip: '例如：你是一个人开发的AI助手'
                        }
                    ]
                },
                Claude: {
                    fields: [
                        {
                            label: 'API Key',
                            prop: 'claude_key',
                            type: 'password',
                            placeholder: 'Claude API Key',
                            link: 'https://docs.anthropic.com/en/api/getting-started'
                        },
                        {
                            label: '默认模型',
                            prop: 'claude_model',
                            type: 'model',
                            options: AIModelList('claude'),
                            placeholder: '请输入模型名称',
                            tipPrefix: '查看说明',
                            link: 'https://docs.anthropic.com/en/docs/about-claude/models'
                        },
                        {
                            label: '使用代理',
                            prop: 'claude_agency',
                            placeholder: '支持 http 或 socks 代理',
                            tip: '例如：http://proxy.com 或 socks5://proxy.com'
                        },
                        {
                            label: 'Temperature',
                            prop: 'claude_temperature',
                            placeholder: '模型温度，低则保守，高则多样',
                            tip: '例如：0.7，范围：0-1，默认：0.7'
                        },
                        {
                            label: '默认提示词',
                            prop: 'claude_system',
                            type: 'textarea',
                            placeholder: '请输入默认提示词',
                            tip: '例如：你是一个人开发的AI助手'
                        }
                    ]
                },
                DeepSeek: {
                    fields: [
                        {
                            label: 'API Key',
                            prop: 'deepseek_key',
                            type: 'password',
                            placeholder: 'DeepSeek API Key',
                            tipPrefix: '访问DeepSeek网站查看',
                            link: 'https://platform.deepseek.com/api_keys'
                        },
                        {
                            label: '默认模型',
                            prop: 'deepseek_model',
                            type: 'model',
                            options: AIModelList('deepseek'),
                            placeholder: '请输入模型名称',
                            tipPrefix: '查看说明',
                            link: 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing'
                        },
                        {
                            label: 'Base URL',
                            prop: 'deepseek_base_url',
                            type: 'input',
                            placeholder: 'Enter base URL...',
                            tip: 'API请求的基础URL路径，如果没有请留空'
                        },
                        {
                            label: '使用代理',
                            prop: 'deepseek_agency',
                            placeholder: '支持 http 或 socks 代理',
                            tip: '例如：http://proxy.com 或 socks5://proxy.com'
                        },
                        {
                            label: 'Temperature',
                            prop: 'deepseek_temperature',
                            placeholder: '模型温度，低则保守，高则多样',
                            tip: '例如：0.7，范围：0-1，默认：0.7'
                        },
                        {
                            label: '默认提示词',
                            prop: 'deepseek_system',
                            type: 'textarea',
                            placeholder: '请输入默认提示词',
                            tip: '例如：你是一个人开发的AI助手'
                        }
                    ]
                },
                Gemini: {
                    fields: [
                        {
                            label: 'API Key',
                            prop: 'gemini_key',
                            type: 'password',
                            placeholder: 'Gemini API Key',
                            link: 'https://makersuite.google.com/app/apikey'
                        },
                        {
                            label: '默认模型',
                            prop: 'gemini_model',
                            type: 'model',
                            options: AIModelList('gemini'),
                            placeholder: '请输入模型名称',
                            tipPrefix: '查看说明',
                            link: 'https://ai.google.dev/models/gemini'
                        },
                        {
                            label: '使用代理',
                            prop: 'gemini_agency',
                            placeholder: '仅支持 http 代理',
                            tip: '例如：http://proxy.com 或 https://proxy.com'
                        },
                        {
                            label: 'Temperature',
                            prop: 'gemini_temperature',
                            placeholder: '模型温度，低则保守，高则多样',
                            tip: '例如：0.7，范围：0-1，默认：0.7'
                        },
                        {
                            label: '默认提示词',
                            prop: 'gemini_system',
                            type: 'textarea',
                            placeholder: '请输入默认提示词',
                            tip: '例如：你是一个人开发的AI助手'
                        }
                    ]
                },
                Zhipu: {
                    fields: [
                        {
                            label: 'API Key',
                            prop: 'zhipu_key',
                            type: 'password',
                            placeholder: 'Zhipu API Key',
                            link: 'https://bigmodel.cn/usercenter/apikeys'
                        },
                        {
                            label: '默认模型',
                            prop: 'zhipu_model',
                            type: 'model',
                            options: AIModelList('zhipu'),
                            placeholder: '请输入模型名称',
                            tipPrefix: '查看说明',
                            link: 'https://open.bigmodel.cn/dev/api'
                        },
                        {
                            label: '使用代理',
                            prop: 'zhipu_agency',
                            placeholder: '支持 http 或 socks 代理',
                            tip: '例如：http://proxy.com 或 socks5://proxy.com'
                        },
                        {
                            label: 'Temperature',
                            prop: 'zhipu_temperature',
                            placeholder: '模型温度，低则保守，高则多样',
                            tip: '例如：0.7，范围：0-1，默认：0.7'
                        },
                        {
                            label: '默认提示词',
                            prop: 'zhipu_system',
                            type: 'textarea',
                            placeholder: '请输入默认提示词',
                            tip: '例如：你是一个人开发的AI助手'
                        }
                    ]
                },
                Qianwen: {
                    fields: [
                        {
                            label: 'API Key',
                            prop: 'qianwen_key',
                            type: 'password',
                            placeholder: 'Qianwen API Key',
                            link: 'https://help.aliyun.com/zh/model-studio/developer-reference/get-api-key'
                        },
                        {
                            label: '默认模型',
                            prop: 'qianwen_model',
                            type: 'model',
                            options: AIModelList('qianwen'),
                            placeholder: '请输入模型名称',
                            tipPrefix: '查看说明',
                            link: 'https://help.aliyun.com/zh/model-studio/getting-started/models'
                        },
                        {
                            label: '使用代理',
                            prop: 'qianwen_agency',
                            placeholder: '支持 http 或 socks 代理',
                            tip: '例如：http://proxy.com 或 socks5://proxy.com'
                        },
                        {
                            label: 'Temperature',
                            prop: 'qianwen_temperature',
                            placeholder: '模型温度，低则保守，高则多样',
                            tip: '例如：0.7，范围：0-1，默认：0.7'
                        },
                        {
                            label: '默认提示词',
                            prop: 'qianwen_system',
                            type: 'textarea',
                            placeholder: '请输入默认提示词',
                            tip: '例如：你是一个人开发的AI助手'
                        }
                    ]
                },
                Wenxin: {
                    fields: [
                        {
                            label: 'API Key',
                            prop: 'wenxin_key',
                            type: 'password',
                            placeholder: 'Wenxin API Key',
                            link: 'https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application/v1'
                        },
                        {
                            label: 'Secret Key',
                            prop: 'wenxin_secret',
                            type: 'password',
                            placeholder: 'Wenxin Secret Key',
                            link: 'https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application/v1'
                        },
                        {
                            label: '默认模型',
                            prop: 'wenxin_model',
                            type: 'model',
                            options: AIModelList('wenxin'),
                            placeholder: '请输入模型名称',
                            tipPrefix: '查看说明',
                            link: 'https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Blfmc9dlf'
                        },
                        {
                            label: '使用代理',
                            prop: 'wenxin_agency',
                            placeholder: '支持 http 或 socks 代理',
                            tip: '例如：http://proxy.com 或 socks5://proxy.com'
                        },
                        {
                            label: 'Temperature',
                            prop: 'wenxin_temperature',
                            placeholder: '模型温度，低则保守，高则多样',
                            tip: '例如：0.7，范围：0-1，默认：0.7'
                        },
                        {
                            label: '默认提示词',
                            prop: 'wenxin_system',
                            type: 'textarea',
                            placeholder: '请输入默认提示词',
                            tip: '例如：你是一个人开发的AI助手'
                        }
                    ]
                }
            }
        }
    },
    mounted() {
        this.systemSetting();
    },
    computed: {
        ...mapState(['formOptions']),
    },
    methods: {
        modelCreate(value, options) {
            options.push({value, label: value});
        },
        modelOption(value, options) {
            if (value && !options.find(item => item.value === value)) {
                options.unshift({value, label: value});
            }
            return options;
        },
        submitForm() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.systemSetting(true);
                }
            })
        },
        resetForm() {
            this.formData = $A.cloneJSON(this.formDatum_bak);
        },
        systemSetting(save) {
            const props = this.aiConfig[this.type].fields.map(item => item.prop);
            const data = Object.fromEntries(Object.entries(this.formData).filter(([key]) => props.includes(key)));
            this.loadIng++;
            this.$store.dispatch("call", {
                url: 'system/setting/aibot?type=' + (save ? 'save' : 'all'),
                data,
            }).then(({data}) => {
                if (save) {
                    $A.messageSuccess('修改成功');
                }
                this.formData = data;
                this.formDatum_bak = $A.cloneJSON(this.formData);
            }).catch(({msg}) => {
                if (save) {
                    $A.modalError(msg);
                }
            }).finally(_ => {
                this.loadIng--;
            });
        }
    }
}
</script>
