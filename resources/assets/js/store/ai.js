const AIModelNames = (str) => {
    const lines = str.split('\n').filter(line => line.trim());

    return lines.map(line => {
        const [value, label] = line.split('|').map(s => s.trim());

        return {
            value,
            label: label || value
        };
    }, []).filter(item => item.value);
}

const AIBotList = [
    {
        value: "openai",
        label: "ChatGPT",
        tags: [],
        src: $A.mainUrl('images/avatar/default_openai.png'),
        desc: $A.L('我是一个人工智能助手，为用户提供问题解答和指导。我没有具体的身份，只是一个程序。您有什么问题可以问我哦？')
    },
    {
        value: "claude",
        label: "Claude",
        tags: [],
        src: $A.mainUrl('images/avatar/default_claude.png'),
        desc: $A.L('我是Claude,一个由Anthropic公司创造出来的AI助手机器人。我的工作是帮助人类,与人对话并给出解答。')
    },
    {
        value: "deepseek",
        label: "DeepSeek",
        tags: [],
        src: $A.mainUrl('images/avatar/default_deepseek.png'),
        desc: $A.L('DeepSeek大语言模型算法是北京深度求索人工智能基础技术研究有限公司推出的深度合成服务算法。')
    },
    {
        value: "gemini",
        label: "Gemini",
        tags: [],
        src: $A.mainUrl('images/avatar/default_gemini.png'),
        desc: `${$A.L('我是由Google开发的生成式人工智能聊天机器人。')}${$A.L('它基于同名的Gemini系列大型语言模型。')}${$A.L('是应对OpenAI公司开发的ChatGPT聊天机器人的崛起而开发的。')}`
    },
    {
        value: "grok",
        label: "Grok",
        tags: [],
        src: $A.mainUrl('images/avatar/default_grok.png'),
        desc: $A.L('Grok是由xAI开发的生成式人工智能聊天机器人，旨在通过实时回答用户问题来提供帮助。')
    },
    {
        value: "ollama",
        label: "Ollama",
        tags: [],
        src: $A.mainUrl('images/avatar/default_ollama.png'),
        desc: $A.L('Ollama 是一个轻量级、可扩展的框架，旨在让用户能够在本地机器上构建和运行大型语言模型。')
    },
    {
        value: "zhipu",
        label: "智谱清言",
        tags: [],
        src: $A.mainUrl('images/avatar/default_zhipu.png'),
        desc: `${$A.L('我是智谱清言，是智谱 AI 公司于2023训练的语言模型。')}${$A.L('我的任务是针对用户的问题和要求提供适当的答复和支持。')}`
    },
    {
        value: "qianwen",
        label: "通义千问",
        tags: [],
        src: $A.mainUrl('avatar/%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE.png'),
        desc: $A.L('我是达摩院自主研发的超大规模语言模型，能够回答问题、创作文字，还能表达观点、撰写代码。')
    },
    {
        value: "wenxin",
        label: "文心一言",
        tags: [],
        src: $A.mainUrl('avatar/%E6%96%87%E5%BF%83.png'),
        desc: $A.L('我是文心一言，英文名是ERNIE Bot。我能够与人对话互动，回答问题，协助创作，高效便捷地帮助人们获取信息、知识和灵感。')
    },
]

const AISystemConfig = {
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
        grok: {
            extraFields: [
                {
                    prop: "key",
                    placeholder: "Grok API Key",
                    link: "https://docs.x.ai/docs/tutorial"
                },
                {
                    prop: "models",
                    link: "https://docs.x.ai/docs/models"
                }
            ]
        },
        ollama: {
            extraFields: [
                {
                    prop: "key",
                    placeholder: "Ollama API Key",
                    tip: "如果没有请留空",
                },
                {
                    prop: "models",
                    link: "https://ollama.com/models",
                    functions: "获取本地模型列表",
                },
                {
                    prop: "base_url",
                    placeholder: "Enter base URL...",
                    tip: "API请求的URL路径",
                    sort: 1,
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
}


export {AIModelNames, AIBotList, AISystemConfig}
