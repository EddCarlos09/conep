<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CreatePartidoDatosContactosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('partido_datos_contactos', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->smallInteger('dato_contacto_id')->nullable()->unsigned();
            $table->integer('partido_id')->nullable()->unsigned();
            $table->string('cuenta', 250)->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        Schema::table('partido_datos_contactos', function (Blueprint $table) {
            $table->foreign('dato_contacto_id')->references('id')->on('datos_contactos')->onDelete('cascade');
            $table->foreign('partido_id')->references('id')->on('partidos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('partido_datos_contactos');
    }
}
