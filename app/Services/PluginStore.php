<?php

namespace App\Services;

use App\Module\Ihttp;
use Cache;
use Carbon\Carbon;

class PluginStore
{
    private static function getStoreUrl(): string
    {
        return 'http://' . env('APP_IPPR') . '.18:8080';
    }

    /**
     * 获取正在运行的插件列表
     * @return array 插件列表
     */
    public static function getRunningPlugin(): array
    {
        try {
            $cacheKey = 'PluginStore::app-running';
            $cache = Cache::get($cacheKey);
            if ($cache) {
                return json_decode($cache, true);
            }

            $ret = Ihttp::ihttp_get(self::getStoreUrl() . '/api/v1/apps/running');
            if (!$ret || $ret['ret'] == 0) {
                return [];
            }
            $data = json_decode($ret['data'], true);
            $result = $data['data']['list'] ?? [];

            Cache::put($cacheKey, json_encode($result), Carbon::now()->addSeconds(15));
            return $result;
        } catch (\Throwable $e) {
            info('获取插件列表失败: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * 检查指定插件是否在运行
     * @param string $key 插件标识
     * @return bool 是否运行中
     */
    public static function includes(string $key): bool
    {
        $runningPlugins = self::getRunningPlugin();
        return in_array($key, $runningPlugins);
    }
}
