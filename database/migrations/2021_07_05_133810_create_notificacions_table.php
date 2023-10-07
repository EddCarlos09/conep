<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificacionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notificacions', function (Blueprint $table) {
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->unsignedBigInteger('proyecto_ley_id');
            $table->string('titulo');
            $table->tinyInteger('tipo');
            $table->string('color');
            $table->string('icono');
            $table->string('mensaje');
            $table->string('usercreated', 250)->nullable();
            $table->timestamps();
        });
        Schema::table('notificacions', function (Blueprint $table) {
            $table->foreign('proyecto_ley_id')->references('id')->on('proyecto_leys')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notificacions');
    }
}
