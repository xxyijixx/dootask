<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWebSocketDialogSessionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('web_socket_dialog_sessions')) {
            Schema::create('web_socket_dialog_sessions', function (Blueprint $table) {
                $table->id();
                $table->bigInteger('dialog_id')->unsigned()->index()->comment('对话ID');
                $table->bigInteger('userid')->unsigned()->index()->comment('用户ID');
                $table->string('title', 255)->default('')->comment('会话标题');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('web_socket_dialog_sessions');
    }
}
