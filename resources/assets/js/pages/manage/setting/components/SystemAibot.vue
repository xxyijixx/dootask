<template>
    <div class="setting-component-item">
        <Form
            ref="formData"
            :model="formData"
            :rules="ruleData"
            v-bind="formOptions"
            @submit.native.prevent>
            <template v-for="field in fields">
                <FormItem :label="$L(field.label)" :prop="field.prop">
                    <template v-if="field.type === 'password'">
                        <Input
                            :maxlength="255"
                            v-model="formData[field.prop]"
                            type="password"
                            :placeholder="$L(field.placeholder)"/>
                    </template>
                    <template v-else-if="field.type === 'model'">
                        <Select v-model="formData[field.prop]" transfer>
                            <Option v-for="item in modelOption(field.prop)" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </template>
                    <template v-else-if="field.type === 'textarea'">
                        <Input
                            :maxlength="500"
                            type="textarea"
                            :autosize="{minRows:2,maxRows:6}"
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
                    <div v-if="field.functions" class="form-tip" style="margin-top:-5px">
                        <a href="javascript:void(0)" @click="functionClick(field.prop)">{{ $L(field.functions) }}</a>
                    </div>
                </FormItem>
            </template>
        </Form>
        <div class="setting-footer">
            <Button :loading="loadIng > 0" type="primary" @click="submitForm">{{ $L('提交') }}</Button>
            <Button :loading="loadIng > 0" @click="resetForm">{{ $L('重置') }}</Button>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";

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
                fields: [
                    {
                        label: "API Key",
                        prop: "key",
                        type: "password"
                    },
                    {
                        label: "模型列表",
                        prop: "models",
                        type: "textarea",
                        placeholder: "一行一个模型名称",
                        functions: "使用默认模型列表"
                    },
                    {
                        label: "默认模型",
                        prop: "model",
                        type: "model",
                        placeholder: "请选择默认模型",
                        tip: "可选数据来自模型列表"
                    },
                    {
                        label: "Base URL",
                        prop: "base_url",
                        placeholder: "Enter base URL...",
                        tip: "API请求的基础URL路径，如果没有请留空"
                    },
                    {
                        label: "使用代理",
                        prop: "agency",
                        placeholder: '支持 http 或 socks 代理',
                        tip: "例如：http://proxy.com 或 socks5://proxy.com"
                    },
                    {
                        label: "Temperature",
                        prop: "temperature",
                        placeholder: "模型温度，低则保守，高则多样",
                        tip: "例如：0.7，范围：0-1，默认：0.7"
                    },
                    {
                        label: "默认提示词",
                        prop: "system",
                        type: "textarea",
                        placeholder: "请输入默认提示词",
                        tip: "例如：你是一个人开发的AI助手"
                    }
                ],
                aiList: {
                    openai: {
                        extraFields: [
                            {
                                prop: "key",
                                placeholder: "OpenAI API Key",
                                link: "https://platform.openai.com/account/api-keys"
                            },
                            {
                                prop: "models",
                                link: "https://platform.openai.com/docs/models",
                            }
                        ]
                    },
                    claude: {
                        extraFields: [
                            {
                                prop: "key",
                                placeholder: "Claude API Key",
                                link: "https://docs.anthropic.com/en/api/getting-started"
                            },
                            {
                                prop: "models",
                                link: "https://docs.anthropic.com/en/docs/about-claude/models"
                            }
                        ]
                    },
                    deepseek: {
                        extraFields: [
                            {
                                prop: "key",
                                placeholder: "DeepSeek API Key",
                                link: "https://platform.deepseek.com/api_keys"
                            },
                            {
                                prop: "models",
                                link: "https://api-docs.deepseek.com/zh-cn/quick_start/pricing"
                            }
                        ]
                    },
                    gemini: {
                        extraFields: [
                            {
                                prop: "key",
                                placeholder: "Gemini API Key",
                                link: "https://makersuite.google.com/app/apikey"
                            },
                            {
                                prop: "models",
                                link: "https://ai.google.dev/models/gemini"
                            },
                            {
                                prop: "agency",
                                placeholder: "仅支持 http 代理",
                                tip: "例如：http://proxy.com"
                            }
                        ]
                    },
                    zhipu: {
                        extraFields: [
                            {
                                prop: "key",
                                placeholder: "Zhipu API Key",
                                link: "https://bigmodel.cn/usercenter/apikeys"
                            },
                            {
                                prop: "models",
                                link: "https://open.bigmodel.cn/dev/api"
                            }
                        ]
                    },
                    qianwen: {
                        extraFields: [
                            {
                                prop: "key",
                                placeholder: "Qianwen API Key",
                                link: "https://help.aliyun.com/zh/model-studio/developer-reference/get-api-key"
                            },
                            {
                                prop: "models",
                                link: "https://help.aliyun.com/zh/model-studio/getting-started/models"
                            }
                        ]
                    },
                    wenxin: {
                        extraFields: [
                            {
                                prop: "key",
                                placeholder: "Wenxin API Key",
                                link: "https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application/v1"
                            },
                            {
                                prop: "secret",
                                placeholder: "Wenxin Secret Key",
                                link: "https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application/v1",
                                type: "password",
                                label: "Secret Key",
                                after: "key"
                            },
                            {
                                prop: "models",
                                link: "https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Blfmc9dlf"
                            }
                        ]
                    }
                }
            },
        }
    },
    mounted() {
        this.systemSetting();
    },
    computed: {
        ...mapState(['formOptions']),

        fields({aiConfig, type}) {
            // 如果type不存在于aiList中，返回空数组
            if (!aiConfig.aiList?.[type]) {
                return [];
            }

            // 获取基础fields和当前type的extraFields
            const baseFields = JSON.parse(JSON.stringify(aiConfig.fields));
            const { extraFields = [] } = aiConfig.aiList[type];

            // 处理每个field，添加type前缀
            const prefixedFields = baseFields.map(field => ({
                ...field,
                prop: `${type}_${field.prop}`
            }));

            // 处理extraFields
            extraFields.forEach(extraField => {
                const newField = {
                    ...extraField,
                    prop: `${type}_${extraField.prop}`
                };

                // 查找是否已存在相同prop的field
                const existingIndex = prefixedFields.findIndex(f =>
                    f.prop === newField.prop
                );

                if (existingIndex !== -1) {
                    // 如果存在，则覆盖原有的field
                    prefixedFields[existingIndex] = {
                        ...prefixedFields[existingIndex],
                        ...newField
                    };
                } else {
                    // 如果不存在，需要插入
                    if (extraField.after) {
                        // 如果指定了after，找到对应位置插入
                        const afterIndex = prefixedFields.findIndex(f =>
                            f.prop === `${type}_${extraField.after}`
                        );
                        if (afterIndex !== -1) {
                            prefixedFields.splice(afterIndex + 1, 0, newField);
                        } else {
                            prefixedFields.push(newField);
                        }
                    } else {
                        // 没有指定after，直接添加到末尾
                        prefixedFields.push(newField);
                    }
                }
            });

            return prefixedFields;
        },
    },
    methods: {
        modelOption(prop) {
            const value = this.formData[prop + 's'];
            if (value) {
                return value.split('\n').map(item => {
                    const [value, label] = `${item}:`.split(':');
                    return {value, label: label || value};
                }, []).filter(item => item.value);
            }
            return []
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
            const props = this.fields.map(item => item.prop);
            const data = Object.fromEntries(Object.entries(this.formData).filter(([key]) => props.includes(key)));
            this.loadIng++;
            this.$store.dispatch("call", {
                url: 'system/setting/aibot?type=' + (save ? 'save' : 'all'),
                data: save ? data : {},
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
        },

        functionClick(prop) {
            if (prop === `${this.type}_models`) {
                this.$store.dispatch("call", {
                    url: 'system/setting/aibot_defmodels?type=' + this.type,
                    spinner: 600,
                }).then(({data}) => {
                    this.formData[prop] = data.models.join('\n');
                }).catch(({msg}) => {
                    $A.modalError(msg || '获取失败');
                });
            } else {
                $A.messageError('未知操作');
            }
        }
    }
}
</script>
