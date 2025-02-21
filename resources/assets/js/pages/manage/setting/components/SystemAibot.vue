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
import {AIModelNames, AISystemConfig} from "../../../../store/ai";

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
            aiConfig: AISystemConfig,
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
                return AIModelNames(value)
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
                    $A.messageSuccess('获取成功');
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
