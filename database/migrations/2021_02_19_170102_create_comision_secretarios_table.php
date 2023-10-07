<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateComisionSecretariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comision_secretarios', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->integer('id')->unsigned()->autoIncrement();
            $table->bigInteger('persona_id')->nullable()->unsigned();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_final')->nullable();
            $table->integer('comision_id')->unsigned()->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        Schema::table('comision_secretarios', function (Blueprint $table) {
            $table->foreign('comision_id')->references('id')->on('comisions')->onDelete('cascade');
            $table->foreign('persona_id')->references('id')->on('personas')->onDelete('cascade');
        });
    
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('comision_secretarios');
    }
}
