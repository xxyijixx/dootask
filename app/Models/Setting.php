<?php

namespace App\Models;

use App\Module\Base;
use App\Module\Timer;

/**
 * App\Models\Setting
 *
 * @property int $id
 * @property string|null $name
 * @property string|null $desc 参数描述、备注
 * @property array $setting
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel cancelAppend()
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel cancelHidden()
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel change($array)
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel getKeyValue()
 * @method static \Illuminate\Database\Eloquent\Builder|Setting newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Setting newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Setting query()
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel remove()
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel saveOrIgnore()
 * @method static \Illuminate\Database\Eloquent\Builder|Setting whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Setting whereDesc($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Setting whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Setting whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Setting whereSetting($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Setting whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Setting extends AbstractModel
{
    /**
     * 格式化设置参数
     * @param $value
     * @return array
     */
    public function getSettingAttribute($value)
    {
        if (is_array($value)) {
            return $value;
        }
        $value = Base::json2array($value);
        switch ($this->name) {
            case 'system':
                $value['system_alias'] = $value['system_alias'] ?: env('APP_NAME');
                $value['image_compress'] = $value['image_compress'] ?: 'open';
                $value['image_quality'] = min(100, max(0, intval($value['image_quality']) ?: 90));
                $value['image_save_local'] = $value['image_save_local'] ?: 'open';
                if (!is_array($value['task_default_time']) || count($value['task_default_time']) != 2 || !Timer::isTime($value['task_default_time'][0]) || !Timer::isTime($value['task_default_time'][1])) {
                    $value['task_default_time'] = ['09:00', '18:00'];
                }
                break;

            case 'fileSetting':
                $value['permission_pack_type'] = $value['permission_pack_type'] ?: 'all';
                $value['permission_pack_userids'] = is_array($value['permission_pack_userids']) ? $value['permission_pack_userids'] : [];
                break;

            case 'aibotSetting':
                if ($value['claude_token'] && empty($value['claude_key'])) {
                    $value['claude_key'] = $value['claude_token'];
                }
                $array = [];
                $aiList = ['openai', 'claude', 'deepseek', 'gemini', 'grok', 'ollama', 'zhipu', 'qianwen', 'wenxin'];
                $fieldList = ['key', 'models', 'model', 'base_url', 'agency', 'temperature', 'system', 'secret'];
                foreach ($aiList as $aiName) {
                    foreach ($fieldList as $fieldName) {
                        $key = $aiName . '_' . $fieldName;
                        $content = $value[$key] ? trim($value[$key]) : '';
                        switch ($fieldName) {
                            case 'models':
                                if ($content) {
                                    $content = explode("\n", $content);
                                    $content = array_filter($content);
                                }
                                if (empty($content)) {
                                    $content = self::AIDefaultModels($aiName);
                                }
                                $content = implode("\n", $content);
                                break;
                            case 'model':
                                $models = Setting::AIModels2Array($array[$key . 's'], true);
                                $content = in_array($content, $models) ? $content : ($models[0] ?? '');
                                break;
                            case 'temperature':
                                if ($content) {
                                    $content = floatval(min(1, max(0, floatval($content) ?: 0.7)));
                                }
                                break;
                        }
                        $array[$key] = $content;
                    }
                }
                $value = $array;
                break;
        }
        return $value;
    }

    /**
     * 是否开启AI
     * @param $ai
     * @return bool
     */
    public static function AIOpen($ai = 'openai')
    {
        $array = Base::setting('aibotSetting');
        return !!$array[$ai . '_key'];
    }

    /**
     * AI默认模型
     * @param string $ai
     * @return array
     */
    public static function AIDefaultModels($ai = 'openai')
    {
        return match ($ai) {
            'openai' => [
                'gpt-4 | GPT-4',
                'gpt-4-turbo | GPT-4 Turbo',
                'gpt-4o | GPT-4o',
                'gpt-4o-mini | GPT-4o Mini',
                'o1 | GPT-o1',
                'o1-mini | GPT-o1 Mini',
                'o3-mini | GPT-o3 Mini',
                'gpt-3.5-turbo | GPT-3.5 Turbo',
                'gpt-3.5-turbo-16k | GPT-3.5 Turbo 16K',
                'gpt-3.5-turbo-0125 | GPT-3.5 Turbo 0125',
                'gpt-3.5-turbo-1106 | GPT-3.5 Turbo 1106'
            ],
            'claude' => [
                'claude-3-5-sonnet-latest | Claude 3.5 Sonnet',
                'claude-3-5-sonnet-20241022 | Claude 3.5 Sonnet 20241022',
                'claude-3-5-haiku-latest | Claude 3.5 Haiku',
                'claude-3-5-haiku-20241022 | Claude 3.5 Haiku 20241022',
                'claude-3-opus-latest | Claude 3 Opus',
                'claude-3-opus-20240229 | Claude 3 Opus 20240229',
                'claude-3-haiku-20240307 | Claude 3 Haiku 20240307',
                'claude-2.1 | Claude 2.1',
                'claude-2.0 | Claude 2.0'
            ],
            'deepseek' => [
                'deepseek-chat | DeepSeek V3',
                'deepseek-reasoner | DeepSeek R1'
            ],
            'gemini' => [
                'gemini-2.0-flash | Gemini 2.0 Flash',
                'gemini-2.0-flash-lite-preview-02-05 | Gemini 2.0 Flash-Lite Preview',
                'gemini-1.5-flash | Gemini 1.5 Flash',
                'gemini-1.5-flash-8b | Gemini 1.5 Flash 8B',
                'gemini-1.5-pro | Gemini 1.5 Pro',
                'gemini-1.0-pro | Gemini 1.0 Pro'
            ],
            'grok' => [
                'grok-2-vision-1212 | Grok 2 Vision 1212',
                'grok-2-vision | Grok 2 Vision',
                'grok-2-vision-latest | Grok 2 Vision Latest',
                'grok-2-1212 | Grok 2 1212',
                'grok-2 | Grok 2',
                'grok-2-latest | Grok 2 Latest',
                'grok-vision-beta | Grok Vision Beta',
                'grok-beta | Grok Beta',
            ],
            'zhipu' => [
                'glm-4 | GLM-4',
                'glm-4-plus | GLM-4 Plus',
                'glm-4-air | GLM-4 Air',
                'glm-4-airx | GLM-4 AirX',
                'glm-4-long | GLM-4 Long',
                'glm-4-flash | GLM-4 Flash',
                'glm-4v | GLM-4V',
                'glm-4v-plus | GLM-4V Plus',
                'glm-3-turbo | GLM-3 Turbo'
            ],
            'qianwen' => [
                'qwen-max | QWEN Max',
                'qwen-max-latest | QWEN Max Latest',
                'qwen-turbo | QWEN Turbo',
                'qwen-turbo-latest | QWEN Turbo Latest',
                'qwen-plus | QWEN Plus',
                'qwen-plus-latest | QWEN Plus Latest',
                'qwen-long | QWEN Long'
            ],
            'wenxin' => [
                'ernie-4.0-8k | Ernie 4.0 8K',
                'ernie-4.0-8k-latest | Ernie 4.0 8K Latest',
                'ernie-4.0-turbo-128k | Ernie 4.0 Turbo 128K',
                'ernie-4.0-turbo-8k | Ernie 4.0 Turbo 8K',
                'ernie-3.5-128k | Ernie 3.5 128K',
                'ernie-3.5-8k | Ernie 3.5 8K',
                'ernie-speed-128k | Ernie Speed 128K',
                'ernie-speed-8k | Ernie Speed 8K',
                'ernie-lite-8k | Ernie Lite 8K',
                'ernie-tiny-8k | Ernie Tiny 8K'
            ],
            default => [],
        };
    }

    /**
     * AI模型转数组
     * @param $models
     * @param bool $retValue
     * @return array
     */
    public static function AIModels2Array($models, $retValue = false)
    {
        $list = is_array($models) ? $models : explode("\n", $models);
        $array = [];
        foreach ($list as $item) {
            $arr = Base::newTrim(explode('|', $item . '|'));
            if ($arr[0]) {
                $array[] = [
                    'value' => $arr[0],
                    'label' => $arr[1] ?: $arr[0]
                ];
            }
        }
        if ($retValue) {
            return array_column($array, 'value');
        }
        return $array;
    }

    /**
     * 验证邮箱地址（过滤忽略地址）
     * @param $array
     * @param \Closure $resultClosure
     * @param \Closure|null $emptyClosure
     * @return array|mixed
     */
    public static function validateAddr($array, $resultClosure, $emptyClosure = null)
    {
        if (!is_array($array)) {
            $array = [$array];
        }
        $ignoreAddr = Base::settingFind('emailSetting', 'ignore_addr');
        $ignoreAddr = explode("\n", $ignoreAddr);
        $ignoreArray = ['admin@dootask.com', 'test@dootask.com'];
        foreach ($ignoreAddr as $item) {
            if (Base::isEmail($item)) {
                $ignoreArray[] = trim($item);
            }
        }
        if ($ignoreArray) {
            $array = array_diff($array, $ignoreArray);
        }
        if ($array) {
            if ($resultClosure instanceof \Closure) {
                foreach ($array as $value) {
                    $resultClosure($value);
                }
            }
        } else {
            if ($emptyClosure instanceof \Closure) {
                $emptyClosure();
            }
        }
        return $array;
    }
}
