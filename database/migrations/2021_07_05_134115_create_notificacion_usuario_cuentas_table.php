<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificacionUsuarioCuentasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notificacion_usuario_cuentas', function (Blueprint $table) {
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->unsignedBigInteger('notificacion_id');
            $table->unsignedBigInteger('usuario_cuenta_id');
            $table->timestamps();
        });

        Schema::table('notificacion_usuario_cuentas', function (Blueprint $table) {
            $table->foreign('notificacion_id')->references('id')->on('notificacions')->onDelete('cascade');
            $table->foreign('usuario_cuenta_id')->references('id')->on('usuario_cuentas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notificacion_usuario_cuentas');
    }
}
