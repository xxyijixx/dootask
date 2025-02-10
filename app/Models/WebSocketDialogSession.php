<?php

namespace App\Models;

use App\Module\Base;
use App\Module\Extranet;
use Swoole\Coroutine;
use Cache;

/**
 * App\Models\WebSocketDialogSession
 *
 * @property int $id
 * @property int $dialog_id 对话ID
 * @property string $title 会话标题
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\WebSocketDialog|null $dialog
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel cancelAppend()
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel cancelHidden()
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel change($array)
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel getKeyValue()
 * @method static \Illuminate\Database\Eloquent\Builder|WebSocketDialogSession newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WebSocketDialogSession newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WebSocketDialogSession query()
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel remove()
 * @method static \Illuminate\Database\Eloquent\Builder|AbstractModel saveOrIgnore()
 * @method static \Illuminate\Database\Eloquent\Builder|WebSocketDialogSession whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WebSocketDialogSession whereDialogId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WebSocketDialogSession whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WebSocketDialogSession whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WebSocketDialogSession whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class WebSocketDialogSession extends AbstractModel
{
    /**
     * 可以批量赋值的属性
     *
     * @var array
     */
    protected $fillable = [
        'dialog_id',
        'userid',
        'title',
    ];

    /**
     * 获取关联的对话
     */
    public function dialog()
    {
        return $this->belongsTo(WebSocketDialog::class, 'dialog_id');
    }

    /**
     * @param $sessionId
     * @param WebSocketDialogMsg $dialogMsg
     * @return void
     */
    public static function updateTitle($sessionId, $dialogMsg)
    {
        if (!$sessionId) {
            return;
        }
        if ($dialogMsg->type != 'text') {
            return;
        }
        $cacheKey = 'dialog_session_title_' . $sessionId;
        if (Cache::has($cacheKey)) {
            return;
        }
        $originalTitle = $dialogMsg->key ?: $dialogMsg->msg['text'] ?: 'Untitled';
        $title = Base::cutStr($originalTitle, 100);
        if ($title == '...') {
            return;
        }
        $session = self::whereId($sessionId)->first();
        if (!$session) {
            return;
        }
        $session->title = $title;
        $session->save();
        Cache::forever($cacheKey, true);
        // 通过AI接口更新对话标题
        go(function () use ($session, $title, $originalTitle) {
            Coroutine::sleep(0.1);
            $res = Extranet::openAIGenerateTitle($originalTitle);
            if (Base::isError($res)) {
                return;
            }
            $newTitle = $res['data'];
            if ($newTitle && $newTitle != $title) {
                $session->title = Base::cutStr($newTitle, 100);
                $session->save();
            }
        });
    }
}
