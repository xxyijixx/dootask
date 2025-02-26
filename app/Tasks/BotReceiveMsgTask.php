<?php

namespace App\Tasks;

use App\Models\FileContent;
use App\Models\Project;
use App\Models\ProjectTask;
use App\Models\User;
use App\Models\UserBot;
use App\Models\UserDepartment;
use App\Models\WebSocketDialog;
use App\Models\WebSocketDialogConfig;
use App\Models\WebSocketDialogMsg;
use App\Module\Base;
use App\Module\Doo;
use App\Module\Ihttp;
use App\Module\TextExtractor;
use Carbon\Carbon;
use DB;

@error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);


/**
 * 推送会话消息
 * Class BotReceiveMsgTask
 * @package App\Tasks
 */
class BotReceiveMsgTask extends AbstractTask
{
    protected $userid;          // 机器人ID
    protected $msgId;           // 消息ID
    protected $mention;         // 是否提及
    protected $mentionOther;    // 是否提及其他人
    protected $client = [];     // 客户端信息（版本、语言、平台）

    public function __construct($userid, $msgId, $mentions, $client = [])
    {
        parent::__construct(...func_get_args());
        $this->userid = $userid;
        $this->msgId = $msgId;
        $this->mention = array_intersect([$userid], $mentions) ? 1 : 0;     // 是否提及（不含@所有人）
        $this->mentionOther = array_diff($mentions, [0, $userid]) ? 1 : 0;  // 是否提及其他人
        $this->client = is_array($client) ? $client : [];
    }

    public function start()
    {
        $botUser = User::whereUserid($this->userid)->whereBot(1)->first();
        if (empty($botUser)) {
            return;
        }
        $msg = WebSocketDialogMsg::with(['user'])->find($this->msgId);
        if (empty($msg)) {
            return;
        }
        $msg->readSuccess($botUser->userid);
        if (!$msg->user?->bot) {
            $this->botReceiveBusiness($msg, $botUser);
        }
    }

    public function end()
    {

    }

    /**
     * 机器人处理消息
     * @param WebSocketDialogMsg $msg
     * @param User $botUser
     * @return void
     */
    private function botReceiveBusiness(WebSocketDialogMsg $msg, User $botUser)
    {
        // 位置消息（仅支持签到机器人）
        if ($msg->type === 'location') {
            if ($botUser->email === 'check-in@bot.system') {
                $content = UserBot::checkinBotQuickMsg('locat-checkin', $msg->userid, $msg->msg);
                if ($content) {
                    WebSocketDialogMsg::sendMsg(null, $msg->dialog_id, 'template', [
                        'type' => 'content',
                        'content' => $content,
                    ], $botUser->userid, false, false, true);    // todo 未能在任务end事件来发送任务
                }
            }
            return;
        }

        // 提取指令
        $command = $this->extractCommand($msg, $botUser->isAiBot(), $this->mention);
        if (empty($command)) {
            return;
        }

        // 查询会话
        $dialog = WebSocketDialog::find($msg->dialog_id);
        if (empty($dialog)) {
            return;
        }

        // 如果是群聊，未提及丹提及其他人
        if ($dialog->type === 'group' && !$this->mention && $this->mentionOther) {
            return;
        }

        // 推送Webhook
        $this->botWebhookBusiness($command, $msg, $botUser, $dialog);

        // 仅支持用户会话
        if ($dialog->type !== 'user') {
            return;
        }

        // 签到机器人
        if ($botUser->email === 'check-in@bot.system') {
            $content = UserBot::checkinBotQuickMsg($command, $msg->userid);
            if ($content) {
                WebSocketDialogMsg::sendMsg(null, $msg->dialog_id, 'template', [
                    'type' => 'content',
                    'content' => $content,
                ], $botUser->userid, false, false, true);    // todo 未能在任务end事件来发送任务
            }
        }

        // 隐私机器人
        if ($botUser->email === 'anon-msg@bot.system') {
            $array = UserBot::anonBotQuickMsg($command);
            if ($array) {
                WebSocketDialogMsg::sendMsg(null, $msg->dialog_id, 'template', [
                    'type' => 'content',
                    'title' => $array['title'],
                    'content' => $array['content'],
                ], $botUser->userid, false, false, true);    // todo 未能在任务end事件来发送任务
            }
        }

        // 管理机器人
        if (str_starts_with($command, '/')) {
            // 判断是否是机器人管理员
            if ($botUser->email === 'bot-manager@bot.system') {
                $isManager = true;
            } elseif (UserBot::whereBotId($botUser->userid)->whereUserid($msg->userid)->exists()) {
                $isManager = false;
            } else {
                WebSocketDialogMsg::sendMsg(null, $msg->dialog_id, 'template', [
                    'type' => 'content',
                    'content' => "非常抱歉，我不是你的机器人，无法完成你的指令。",
                ], $botUser->userid, false, false, true);    // todo 未能在任务end事件来发送任务
                return;
            }

            // 指令处理
            $array = Base::newTrim(explode(" ", "{$command}    "));
            $type = $array[0];
            $data = [];
            $content = "";
            if (!$isManager && in_array($type, ['/list', '/newbot'])) {
                return; // 这些操作仅支持【机器人管理】机器人
            }
            switch ($type) {
                /**
                 * 列表
                 */
                case '/list':
                    $data = User::select([
                        'users.*',
                        'user_bots.clear_day',
                        'user_bots.clear_at',
                        'user_bots.webhook_url',
                        'user_bots.webhook_num'
                    ])
                        ->join('user_bots', 'users.userid', '=', 'user_bots.bot_id')
                        ->where('users.bot', 1)
                        ->where('user_bots.userid', $msg->userid)
                        ->take(50)
                        ->orderByDesc('id')
                        ->get();
                    if ($data->isEmpty()) {
                        $content = "您没有创建机器人。";
                    }
                    break;

                /**
                 * 详情
                 */
                case '/hello':
                case '/info':
                    $botId = $isManager ? $array[1] : $botUser->userid;
                    $data = $this->botOne($botId, $msg->userid);
                    if (!$data) {
                        $content = "机器人不存在。";
                    }
                    break;

                /**
                 * 创建
                 */
                case '/newbot':
                    if (User::select(['users.*'])
                            ->join('user_bots', 'users.userid', '=', 'user_bots.bot_id')
                            ->where('users.bot', 1)
                            ->where('user_bots.userid', $msg->userid)
                            ->count() >= 50) {
                        $content = "超过最大创建数量。";
                        break;
                    }
                    if (strlen($array[1]) < 2 || strlen($array[1]) > 20) {
                        $content = "机器人名称由2-20个字符组成。";
                        break;
                    }
                    $data = User::botGetOrCreate("user-" . Base::generatePassword(), [
                        'nickname' => $array[1]
                    ], $msg->userid);
                    if (empty($data)) {
                        $content = "创建失败。";
                        break;
                    }
                    $dialog = WebSocketDialog::checkUserDialog($data, $msg->userid);
                    if ($dialog) {
                        WebSocketDialogMsg::sendMsg(null, $dialog->id, 'template', [
                            'type' => '/hello',
                            'title' => '创建成功。',
                            'data' => $data,
                        ], $data->userid);    // todo 未能在任务end事件来发送任务
                    }
                    break;

                /**
                 * 修改名字
                 */
                case '/setname':
                    $botId = $isManager ? $array[1] : $botUser->userid;
                    $nameString = $isManager ? $array[2] : $array[1];
                    if (strlen($nameString) < 2 || strlen($nameString) > 20) {
                        $content = "机器人名称由2-20个字符组成。";
                        break;
                    }
                    $data = $this->botOne($botId, $msg->userid);
                    if ($data) {
                        $data->nickname = $nameString;
                        $data->az = Base::getFirstCharter($nameString);
                        $data->pinyin = Base::cn2pinyin($nameString);
                        $data->save();
                    } else {
                        $content = "机器人不存在。";
                    }
                    break;


                /**
                 * 删除
                 */
                case '/deletebot':
                    $botId = $isManager ? $array[1] : $botUser->userid;
                    $data = $this->botOne($botId, $msg->userid);
                    if ($data) {
                        $data->deleteUser('delete bot');
                    } else {
                        $content = "机器人不存在。";
                    }
                    break;

                /**
                 * 获取Token
                 */
                case '/token':
                    $botId = $isManager ? $array[1] : $botUser->userid;
                    $data = $this->botOne($botId, $msg->userid);
                    if ($data) {
                        User::generateToken($data);
                    } else {
                        $content = "机器人不存在。";
                    }
                    break;

                /**
                 * 更新Token
                 */
                case '/revoke':
                    $botId = $isManager ? $array[1] : $botUser->userid;
                    $data = $this->botOne($botId, $msg->userid);
                    if ($data) {
                        $data->encrypt = Base::generatePassword(6);
                        $data->password = Doo::md5s(Base::generatePassword(32), $data->encrypt);
                        $data->save();
                    } else {
                        $content = "机器人不存在。";
                    }
                    break;

                /**
                 * 设置保留消息时间
                 */
                case '/clearday':
                    $botId = $isManager ? $array[1] : $botUser->userid;
                    $clearDay = $isManager ? $array[2] : $array[1];
                    $data = $this->botOne($botId, $msg->userid);
                    if ($data) {
                        $userBot = UserBot::whereBotId($botId)->whereUserid($msg->userid)->first();
                        if ($userBot) {
                            $userBot->clear_day = min(intval($clearDay) ?: 30, 999);
                            $userBot->clear_at = Carbon::now()->addDays($userBot->clear_day);
                            $userBot->save();
                        }
                        $data->clear_day = $userBot->clear_day;
                        $data->clear_at = $userBot->clear_at;   // 这两个参数只是作为输出，所以不保存
                    } else {
                        $content = "机器人不存在。";
                    }
                    break;

                /**
                 * 设置webhook
                 */
                case '/webhook':
                    $botId = $isManager ? $array[1] : $botUser->userid;
                    $webhookUrl = $isManager ? $array[2] : $array[1];
                    $data = $this->botOne($botId, $msg->userid);
                    if (strlen($webhookUrl) > 255) {
                        $content = "webhook地址最长仅支持255个字符。";
                    } elseif ($data) {
                        $userBot = UserBot::whereBotId($botId)->whereUserid($msg->userid)->first();
                        if ($userBot) {
                            $userBot->webhook_url = $webhookUrl ?: "";
                            $userBot->webhook_num = 0;
                            $userBot->save();
                        }
                        $data->webhook_url = $userBot->webhook_url ?: '-';
                        $data->webhook_num = $userBot->webhook_num;   // 这两个参数只是作为输出，所以不保存
                    } else {
                        $content = "机器人不存在。";
                    }
                    break;

                /**
                 * 会话搜索
                 */
                case '/dialog':
                    $botId = $isManager ? $array[1] : $botUser->userid;
                    $nameKey = $isManager ? $array[2] : $array[1];
                    $data = $this->botOne($botId, $msg->userid);
                    if ($data) {
                        $list = DB::table('web_socket_dialog_users as u')
                            ->select(['d.*', 'u.top_at', 'u.last_at', 'u.mark_unread', 'u.silence', 'u.hide', 'u.color', 'u.updated_at as user_at'])
                            ->join('web_socket_dialogs as d', 'u.dialog_id', '=', 'd.id')
                            ->where('u.userid', $data->userid)
                            ->where('d.name', 'LIKE', "%{$nameKey}%")
                            ->whereNull('d.deleted_at')
                            ->orderByDesc('u.top_at')
                            ->orderByDesc('u.last_at')
                            ->take(20)
                            ->get()
                            ->map(function($item) use ($data) {
                                return WebSocketDialog::synthesizeData($item, $data->userid);
                            })
                            ->all();
                        if (empty($list)) {
                            $content = "没有搜索到相关会话。";
                        } else {
                            $data->list = $list;   // 这个参数只是作为输出，所以不保存
                        }
                    } else {
                        $content = "机器人不存在。";
                    }
                    break;
            }

            // 回复消息
            if ($content) {
                $msgData = [
                    'type' => 'content',
                    'content' => $content,
                ];
            } else {
                $msgData = [
                    'type' => $type,
                    'data' => $data,
                ];
                $msgData['title'] = match ($type) {
                    '/hello' => '您好',
                    '/help' => '帮助指令',
                    '/list' => '我的机器人',
                    '/info' => '机器人信息',
                    '/newbot' => '新建机器人',
                    '/setname' => '设置名称',
                    '/deletebot' => '删除机器人',
                    '/token' => '机器人Token',
                    '/revoke' => '更新Token',
                    '/webhook' => '设置Webhook',
                    '/clearday' => '设置保留消息时间',
                    '/dialog' => '对话列表',
                    '/api' => 'API接口文档',
                    default => '不支持的指令',
                };
                if ($type == '/api') {
                    $msgData['version'] = Base::getVersion();
                } elseif ($type == '/help') {
                    $msgData['manager'] = $isManager;
                }
            }
            WebSocketDialogMsg::sendMsg(null, $msg->dialog_id, 'template', $msgData, $botUser->userid, false, false, true);    // todo 未能在任务end事件来发送任务
        }
    }

    /**
     * 机器人处理 Webhook
     * @param string $command
     * @param WebSocketDialogMsg $msg
     * @param User $botUser
     * @param WebSocketDialog $dialog
     * @return void
     */
    private function botWebhookBusiness(string $command, WebSocketDialogMsg $msg, User $botUser, WebSocketDialog $dialog)
    {
        $serverUrl = 'http://' . env('APP_IPPR') . '.3';
        $userBot = null;
        $extras = [];
        $errorContent = null;
        if ($botUser->isAiBot($type)) {
            // AI机器人
            $setting = Base::setting('aibotSetting');
            $extras = [
                'model_type' => match ($type) {
                    'qianwen' => 'qwen',
                    default => $type,
                },
                'model_name' => $setting[$type . '_model'],
                'system_message' => $setting[$type . '_system'],
                'api_key' => $setting[$type . '_key'],
                'base_url' => $setting[$type . '_base_url'],
                'agency' => $setting[$type . '_agency'],
                'server_url' => $serverUrl,
            ];
            if ($setting[$type . '_temperature']) {
                $extras['temperature'] = floatval($setting[$type . '_temperature']);
            }
            if ($msg->msg['model_name']) {
                $extras['model_name'] = $msg->msg['model_name'];
            }
            if ($dialog->session_id) {
                $extras['context_key'] = 'session_' . $dialog->session_id;
            }
            if ($type === 'wenxin') {
                $extras['api_key'] .= ':' . $setting['wenxin_secret'];
            }
            if ($type === 'ollama') {
                if (empty($extras['base_url'])) {
                    $errorContent = '机器人未启用。';
                }
                if (empty($extras['api_key'])) {
                    $extras['api_key'] = Base::strRandom(6);
                }
            }
            if (empty($extras['api_key'])) {
                $errorContent = '机器人未启用。';
            }
            if (in_array($this->client['platform'], ['win', 'mac', 'web']) && !Base::judgeClientVersion("0.41.11", $this->client['version'])) {
                $errorContent = '当前客户端版本低（所需版本≥v0.41.11）。';
            }

            if ($msg->reply_id > 0) {
                $replyMsg = WebSocketDialogMsg::find($msg->reply_id);
                $replyCommand = null;
                if ($replyMsg) {
                    switch ($replyMsg->type) {
                        case 'text':
                            $replyCommand = $this->extractCommand($replyMsg, true);
                            if ($replyCommand) {
                                $replyCommand = Base::cutStr($replyCommand, 20000);
                            }
                            break;
                        case 'file':
                            $msgData = Base::json2array($replyMsg->getRawOriginal('msg'));
                            $replyCommand = TextExtractor::getFileContent(public_path($msgData['path']));
                            break;
                    }
                }
                if ($replyCommand) {
                    $command = <<<EOF
                        <quoted_content>
                        {$replyCommand}
                        </quoted_content>

                        The content within the above quoted_content tags is a citation.

                        {$command}
                        EOF;
                }
            }
            $this->AIGenerateSystemMessage($msg->userid, $dialog, $extras);
            $webhookUrl = "{$serverUrl}/ai/chat";
        } else {
            // 用户机器人
            $userBot = UserBot::whereBotId($botUser->userid)->first();
            $webhookUrl = $userBot?->webhook_url;
        }
        if ($errorContent) {
            WebSocketDialogMsg::sendMsg(null, $msg->dialog_id, 'template', [
                'type' => 'content',
                'content' => $errorContent,
            ], $botUser->userid, false, false, true); // todo 未能在任务end事件来发送任务
            return;
        }
        if (!preg_match("/^https?:\/\//", $webhookUrl)) {
            return;
        }
        //
        try {
            $data = [
                'text' => $command,
                'token' => User::generateToken($botUser),
                'dialog_id' => $dialog->id,
                'dialog_type' => $dialog->type,
                'msg_id' => $msg->id,
                'msg_uid' => $msg->userid,
                'mention' => $this->mention ? 1 : 0,
                'bot_uid' => $botUser->userid,
                'version' => Base::getVersion(),
                'extras' => Base::array2json($extras)
            ];
            $res = Ihttp::ihttp_post($webhookUrl, $data, 30);
            if ($userBot) {
                $userBot->webhook_num++;
                $userBot->save();
            }
            if ($res['data'] && $data = Base::json2array($res['data'])) {
                if ($data['code'] != 200 && $data['message']) {
                    WebSocketDialogMsg::sendMsg(null, $msg->dialog_id, 'text', ['text' => $res['data']['message']], $botUser->userid, false, false, true);
                }
            }
        } catch (\Throwable $th) {
            info(Base::array2json([
                'bot_userid' => $botUser->userid,
                'dialog' => $dialog->id,
                'msg' => $msg->id,
                'webhook_url' => $webhookUrl,
                'error' => $th->getMessage(),
            ]));
        }
    }

    /**
     * 获取机器人信息
     * @param $botId
     * @param $userid
     * @return User
     */
    private function botOne($botId, $userid)
    {
        $botId = intval($botId);
        $userid = intval($userid);
        if ($botId > 0) {
            return User::select([
                'users.*',
                'user_bots.clear_day',
                'user_bots.clear_at',
                'user_bots.webhook_url',
                'user_bots.webhook_num'
            ])
                ->join('user_bots', 'users.userid', '=', 'user_bots.bot_id')
                ->where('users.bot', 1)
                ->where('user_bots.bot_id', $botId)
                ->where('user_bots.userid', $userid)
                ->first();
        }
        return null;
    }

    /**
     * 提取消息指令（提取消息内容）
     * @param WebSocketDialogMsg $msg
     * @param bool $isAiBot
     * @param bool $mention
     * @return string
     */
    private function extractCommand(WebSocketDialogMsg $msg, bool $isAiBot = false, bool $mention = false)
    {
        if ($msg->type !== 'text') {
            return '';
        }
        $original = $msg->msg['text'];
        if ($mention) {
            $original = preg_replace("/<span class=\"mention user\" data-id=\"(\d+)\">(.*?)<\/span>/", "", $original);
        }
        if (preg_match("/<span[^>]*?data-quick-key=([\"'])([^\"']+?)\\1[^>]*?>(.*?)<\/span>/is", $original, $match)) {
            $command = $match[2];
            if (str_starts_with($command, '%3A.')) {
                $command = ":" . substr($command, 4);
            }
            return $command;
        }
        $aiContents = [];
        if ($isAiBot) {
            if (preg_match_all("/<span class=\"mention task\" data-id=\"(\d+)\">(.*?)<\/span>/", $original, $match)) {
                $taskIds = Base::newIntval($match[1]);
                foreach ($taskIds as $index => $taskId) {
                    $taskName = addslashes($match[2][$index]) . " (ID:{$taskId})";
                    $taskContext = "任务状态：不存在或已删除";
                    $taskInfo = ProjectTask::with(['content'])->whereId($taskId)->first();
                    if ($taskInfo) {
                        $taskName = addslashes($taskInfo->name) . " (ID:{$taskId})";
                        $taskContext = implode("\n", $taskInfo->AIContext());
                    }
                    $aiContents[] = "<task_content path=\"{$taskName}\">\n{$taskContext}\n</task_content>";
                    $original = str_replace($match[0][$index], "'{$taskName}' (see below for task_content tag)", $original);
                }
            }
            if (preg_match_all("/<a class=\"mention file\" href=\"([^\"']+?)\"[^>]*?>(.*?)<\/a>/", $original, $match)) {
                $filePaths = $match[1];
                foreach ($filePaths as $index => $filePath) {
                    if (preg_match("/single\/file\/(.*?)$/", $filePath, $fileMatch)) {
                        $fileName = addslashes($match[2][$index]);
                        $fileContent = "文件状态：不存在或已删除";
                        $fileInfo = FileContent::idOrCodeToContent($fileMatch[1]);
                        if ($fileInfo && isset($fileInfo->content['url'])) {
                            $filePath = public_path($fileInfo->content['url']);
                            if (file_exists($filePath)) {
                                $fileName .= " (ID:{$fileInfo->id})";
                                $fileContent = TextExtractor::getFileContent($filePath);
                            }
                        }
                        $aiContents[] = "<file_content path=\"{$fileName}\">\n{$fileContent}\n</file_content>";
                        $original = str_replace($match[0][$index], "'{$fileName}' (see below for file_content tag)", $original);
                    }
                }
            }
        }
        $command = trim(strip_tags($original));
        if ($aiContents) {
            $command .= "\n\n" . implode("\n\n", $aiContents);
        }
        return $command ?: '';
    }

    /**
     * 生成AI系统提示词
     * @param int|null $userid
     * @param WebSocketDialog $dialog
     * @param array $extras
     * @return void
     */
    private function AIGenerateSystemMessage(int|null $userid, WebSocketDialog $dialog, array &$extras)
    {
        $system_messages = [];
        switch ($dialog->type) {
            case "user":
                $aiPrompt = WebSocketDialogConfig::where([
                    'dialog_id' => $dialog->id,
                    'userid' => $userid,
                    'type' => 'ai_prompt',
                ])->value('value');
                if ($aiPrompt) {
                    $extras['system_message'] = $aiPrompt;
                }
                break;
            case "group":
                switch ($dialog->group_type) {
                    case 'user':
                        break;
                    case 'project':
                        $projectInfo = Project::whereDialogId($dialog->id)->first();
                        if ($projectInfo) {
                            $projectDesc = $projectInfo->desc ?: "-";
                            $projectStatus = $projectInfo->archived_at ? '已归档' : '正在进行中';
                            $system_messages[] = <<<EOF
                                当前我在项目【{$projectInfo->name}】中
                                项目描述：{$projectDesc}
                                项目状态：{$projectStatus}

                                如果你判断我想要或需要添加任务，请按照以下格式回复：

                                ::: create-task-list
                                title: 任务标题1
                                desc: 任务描述1

                                title: 任务标题2
                                desc: 任务描述2
                                :::
                                EOF;
                        }
                        break;
                    case 'task':
                        $taskInfo = ProjectTask::with(['content'])->whereDialogId($dialog->id)->first();
                        if ($taskInfo) {
                            $taskContext = implode("\n", $taskInfo->AIContext());
                            $system_messages[] = <<<EOF
                                当前我在任务【{$taskInfo->name}】中
                                当前时间：{$taskInfo->updated_at}
                                任务ID：{$taskInfo->id}
                                {$taskContext}

                                如果你判断我想要或需要添加子任务，请按照以下格式回复：

                                ::: create-subtask-list
                                title: 子任务标题1
                                title: 子任务标题2
                                :::
                                EOF;
                        }
                        break;
                    case 'department':
                        $userDepartment = UserDepartment::whereDialogId($dialog->id)->first();
                        if ($userDepartment) {
                            $system_messages[] = "当前我在【{$userDepartment->name}】的部门群聊中";
                        }
                        break;
                    case 'all':
                        $system_messages[] = "当前我在【全体成员】的群聊中";
                        break;
                }
                break;
        }
        if ($extras['system_message']) {
            array_unshift($system_messages, $extras['system_message']);
        }
        if ($system_messages) {
            $extras['system_message'] = implode("\n\n====\n\n", Base::newTrim($system_messages));
        }
    }
}
