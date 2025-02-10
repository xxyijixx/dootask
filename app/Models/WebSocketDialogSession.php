<?php

namespace App\Models;

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
}
