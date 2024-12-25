<?php

namespace App\Models;


use App\Module\Base;
use App\Module\Timer;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\FileContent
 *
 * @property int $id
 * @property int|null $fid 文件ID
 * @property string|null $content 内容
 * @property string|null $text 内容（主要用于文档类型搜索）
 * @property int|null $size 大小(B)
 * @property int|null $userid 会员ID
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel cancelAppend()
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel cancelHidden()
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel change($array)
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel getKeyValue()
 * @method static \Illuminate\Database\Eloquent\Builder|FileContent newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FileContent newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FileContent onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FileContent query()
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel remove()
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel saveOrIgnore()
 * @method static \Illuminate\Database\Eloquent\Builder|FileContent whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FileContent whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FileContent whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FileContent whereFid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FileContent whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FileContent whereSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FileContent whereText($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FileContent whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FileContent whereUserid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|FileContent withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|FileContent withoutTrashed()
 * @mixin \Eloquent
 */
class FileContent extends AbstractModel
{
    use SoftDeletes;

    /**
     * 强制删除文件内容
     * @return void
     */
    public function forceDeleteContent()
    {
        $this->forceDelete();
        $content = Base::json2array($this->content ?: []);
        if (str_starts_with($content['url'], 'uploads/')) {
            $path = public_path($content['url']);
            if (file_exists($path)) {
                @unlink($path);
            }
        }
    }

    /**
     * 转预览地址
     * @param array $array
     * @return string
     */
    public static function toPreviewUrl($array)
    {
        $fileExt = $array['ext'];
        $fileName = $array['name'];
        $filePath = $array['path'];
        $name = Base::rightDelete($fileName, ".{$fileExt}") . ".{$fileExt}";
        $key = urlencode(Base::urlAddparameter($filePath, [
            'name' => $name,
            'ext' => $fileExt
        ]));
        return Base::fillUrl("online/preview/{$name}?key={$key}&version=" . Base::getVersion() . "&__=" . Timer::msecTime());
    }

    /**
     * 转预览地址
     * @param File $file
     * @param $content
     * @return string
     */
    public static function formatPreview($file, $content)
    {
        $content = Base::json2array($content ?: []);
        // 优先使用 cloud_url
        if (!empty($content['cloud_url'])) {
            // 对于云文件，直接返回预览 URL
            return Base::fillUrl("fileview/onlinePreview?url=" . urlencode(base64_encode($content['cloud_url'])));
        }
        
        // 本地文件的处理
        $filePath = $content['url'] ?? '';
        if (in_array($file->type, ['word', 'excel', 'ppt'])) {
            if (empty($content)) {
                $filePath = 'assets/office/empty.' . str_replace(['word', 'excel', 'ppt'], ['docx', 'xlsx', 'pptx'], $file->type);
            }
        }

        // 检查是否是压缩包或视频文件
        $compressExts = ['zip', 'rar', '7z', 'tar', 'gz'];
        $videoExts = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'mkv'];
        
        if (in_array($file->ext, array_merge($compressExts, $videoExts))) {
            // 对于压缩包和视频文件，也直接返回预览 URL
            $url = Base::fillUrl($filePath);
            return Base::fillUrl("fileview/onlinePreview?url=" . urlencode(base64_encode($url)));
        }

        // 其他文件类型使用原有的预览方式
        return self::toPreviewUrl([
            'ext' => $file->ext,
            'name' => $file->name,
            'path' => $filePath,
        ]);
    }

    /**
     * 获取文件的最新内容
     * @param int $fid 文件ID
     * @return array|null
     */
    public static function getLatestContent($fid)
    {
        $content = self::where('fid', $fid)
            ->orderBy('updated_at', 'desc')
            ->first();
            
        return $content ? Base::json2array($content->content ?: []) : null;
    }

    /**
     * 获取临时文件目录
     * @return string
     */
    private static function getTempDir()
    {
        $tempDir = env('OFFICE_TEMP_DIR', 'storage/app/temp/office');
        $fullPath = base_path($tempDir);
        if (!file_exists($fullPath)) {
            mkdir($fullPath, 0777, true);
        }
        return $fullPath;
    }

    /**
     * 清理旧的临时文件
     * @param int $fid 文件ID
     * @param string $currentFile 当前文件路径（这个文件不会被删除）
     */
    private static function cleanOldTempFiles($fid, $currentFile = null)
    {
        $tempDir = self::getTempDir();
        $pattern = $tempDir . '/' . md5((string)$fid) . '_*';
        
        foreach (glob($pattern) as $file) {
            if ($currentFile !== $file) {
                @unlink($file);
            }
        }
    }

    /**
     * 获取格式内容（或下载）
     * @param File $file
     * @param $content
     * @param $download
     * @return array|\Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public static function formatContent($file, $content, $download = false)
    {
        $name = $file->ext ? "{$file->name}.{$file->ext}" : null;
        $content = Base::json2array($content ?: []);
        if (in_array($file->type, ['word', 'excel', 'ppt'])) {
            // 检查是否有更新的版本包含cloud_url
            $latestContent = self::where('fid', $file->id)
                ->orderBy('updated_at', 'desc')
                ->first();
            if ($latestContent) {
                $latestData = Base::json2array($latestContent->content ?: []);
                if (!empty($latestData['cloud_url'])) {
                    try {
                        // 获取临时目录
                        $tempDir = self::getTempDir();
                        
                        // 生成临时文件路径（加入文件ID以便后续清理）
                        $tempFile = $tempDir . '/' . md5((string)$file->id) . '_' . md5($latestData['cloud_url']) . '.' . $file->ext;
                        
                        // 如果临时文件不存在，从云端下载
                        if (!file_exists($tempFile)) {
                            $ch = curl_init($latestData['cloud_url']);
                            $fp = fopen($tempFile, 'wb');
                            curl_setopt($ch, CURLOPT_FILE, $fp);
                            curl_setopt($ch, CURLOPT_HEADER, 0);
                            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                            curl_exec($ch);
                            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                            curl_close($ch);
                            fclose($fp);
                            
                            if ($httpCode !== 200 || !file_exists($tempFile)) {
                                @unlink($tempFile);
                                throw new \Exception('下载文件失败');
                            }
                        }

                        // 检查是否有更新的版本，如果有则清理旧文件
                        $newerContent = self::where('fid', $file->id)
                            ->where('updated_at', '>', $latestContent->updated_at)
                            ->exists();
                        if ($newerContent) {
                            self::cleanOldTempFiles($file->id, $tempFile);
                        }
                        
                        return Base::BinaryFileResponse($tempFile, $name);
                    } catch (\Exception $e) {
                        // 下载失败时继续使用原始内容
                    }
                }
            }
            
            // 使用原始内容
            if (empty($content)) {
                $filePath = public_path('assets/office/empty.' . str_replace(['word', 'excel', 'ppt'], ['docx', 'xlsx', 'pptx'], $file->type));
            } else {
                $filePath = public_path($content['url']);
            }
            return Base::BinaryFileResponse($filePath, $name);
        } elseif (in_array($file->type, ['document', 'drawio', 'mind'])) {
            // 检查是否有更新的版本包含cloud_url
            $latestContent = self::where('fid', $file->id)
                ->orderBy('updated_at', 'desc')
                ->first();
            if ($latestContent) {
                $latestData = Base::json2array($latestContent->content ?: []);
                if (!empty($latestData['cloud_url'])) {
                    try {
                        // 获取临时目录
                        $tempDir = self::getTempDir();
                        
                        // 生成临时文件路径（加入文件ID以便后续清理）
                        $tempFile = $tempDir . '/' . md5((string)$file->id) . '_' . md5($latestData['cloud_url']) . '.' . $file->ext;
                        
                        // 如果临时文件不存在，从云端下载
                        if (!file_exists($tempFile)) {
                            $ch = curl_init($latestData['cloud_url']);
                            $fp = fopen($tempFile, 'wb');
                            curl_setopt($ch, CURLOPT_FILE, $fp);
                            curl_setopt($ch, CURLOPT_HEADER, 0);
                            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                            curl_exec($ch);
                            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                            curl_close($ch);
                            fclose($fp);
                            
                            if ($httpCode !== 200 || !file_exists($tempFile)) {
                                @unlink($tempFile);
                                throw new \Exception('下载文件失败');
                            }
                        }

                        // 检查是否有更新的版本，如果有则清理旧文件
                        $newerContent = self::where('fid', $file->id)
                            ->where('updated_at', '>', $latestContent->updated_at)
                            ->exists();
                        if ($newerContent) {
                            self::cleanOldTempFiles($file->id, $tempFile);
                        }
                        
                        // 读取文件内容
                        $fileContent = file_get_contents($tempFile);
                        
                        $response = [
                            'ret' => 1,
                            'msg' => 'success',
                            'data' => [
                                'content' => []
                            ]
                        ];
                        
                        if ($file->type === 'document') {
                            // document类型根据扩展名区分为md和text
                            $contentType = strtolower($file->ext) === 'md' ? 'md' : 'text';
                            $response['data']['content'] = [
                                'type' => $contentType,
                                'content' => $fileContent
                            ];
                        } elseif ($file->type === 'drawio') {
                            $response['data']['content'] = [
                                'xml' => $fileContent
                            ];
                        } elseif ($file->type === 'mind') {
                            // mind类型直接将文件内容解析为json放入content中
                            $response['data']['content'] = json_decode($fileContent, true);
                        }
                        
                        // 返回响应
                        return response()->json($response);
                    } catch (\Exception $e) {
                        // 下载失败时继续使用原始内容
                    }
                }
            }
        } elseif (in_array($file->ext, ['zip', 'rar', '7z', 'tar', 'gz']) || in_array($file->ext, ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'mkv'])) {
            // 检查是否有更新的版本包含cloud_url
            $latestContent = self::where('fid', $file->id)
                ->orderBy('updated_at', 'desc')
                ->first();
            if ($latestContent) {
                $latestData = Base::json2array($latestContent->content ?: []);
                if (!empty($latestData['cloud_url'])) {
                    try {
                        // 获取临时目录
                        $tempDir = self::getTempDir();
                        
                        // 生成临时文件路径（加入文件ID以便后续清理）
                        $tempFile = $tempDir . '/' . md5((string)$file->id) . '_' . md5($latestData['cloud_url']) . '.' . $file->ext;
                        
                        // 如果临时文件不存在，从云端下载
                        if (!file_exists($tempFile)) {
                            $ch = curl_init($latestData['cloud_url']);
                            $fp = fopen($tempFile, 'wb');
                            curl_setopt($ch, CURLOPT_FILE, $fp);
                            curl_setopt($ch, CURLOPT_HEADER, 0);
                            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                            curl_exec($ch);
                            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                            curl_close($ch);
                            fclose($fp);
                            
                            if ($httpCode !== 200 || !file_exists($tempFile)) {
                                @unlink($tempFile);
                                throw new \Exception('下载文件失败');
                            }
                        }

                        // 检查是否有更新的版本，如果有则清理旧文件
                        $newerContent = self::where('fid', $file->id)
                            ->where('updated_at', '>', $latestContent->updated_at)
                            ->exists();
                        if ($newerContent) {
                            self::cleanOldTempFiles($file->id, $tempFile);
                        }

                        // 将临时文件复制到 public 目录
                        $publicDir = public_path('temp');
                        if (!file_exists($publicDir)) {
                            mkdir($publicDir, 0777, true);
                        }
                        $publicFile = $publicDir . '/' . md5((string)$file->id) . '_' . md5($latestData['cloud_url']) . '.' . $file->ext;
                        copy($tempFile, $publicFile);

                        // 返回预览信息
                        $relativePath = 'temp/' . basename($publicFile);
                        $name = Base::rightDelete($file->name, ".{$file->ext}") . ".{$file->ext}";
                        $key = urlencode(Base::urlAddparameter($relativePath, [
                            'name' => $name,
                            'ext' => $file->ext
                        ]));
                        return Base::retSuccess('success', [
                            'content' => [
                                'preview' => true,
                                'name' => $name,
                                'key' => $key
                            ]
                        ]);
                    } catch (\Exception $e) {
                        // 下载失败时继续使用原始内容
                    }
                }
            }
            
            // 使用原始内容
            if (!empty($content['url'])) {
                $name = Base::rightDelete($file->name, ".{$file->ext}") . ".{$file->ext}";
                $key = urlencode(Base::urlAddparameter($content['url'], [
                    'name' => $name,
                    'ext' => $file->ext
                ]));
                return Base::retSuccess('success', [
                    'content' => [
                        'preview' => true,
                        'name' => $name,
                        'key' => $key
                    ]
                ]);
            }
        }
        
        if (empty($content)) {
            $content = match ($file->type) {
                'document' => [
                    "type" => $file->ext,
                    "content" => "",
                ],
                default => json_decode('{}'),
            };
            if ($download) {
                abort(403, "This file is empty.");
            }
        } else {
            $path = $content['url'];
            if ($file->ext) {
                $res = File::formatFileData([
                    'path' => $path,
                    'ext' => $file->ext,
                    'size' => $file->size,
                    'name' => $file->name,
                ]);
                $content = $res['content'];
            } else {
                $content['preview'] = false;
            }
            if ($download) {
                $filePath = public_path($path);
                if (isset($filePath)) {
                    return Base::BinaryFileResponse($filePath, $name);
                } else {
                    abort(403, "This file not support download.");
                }
            }
        }
        return Base::retSuccess('success', [ 'content' => $content ]);
    }
}
