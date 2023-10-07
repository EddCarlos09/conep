<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateComisionDatosContactosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comision_datos_contactos', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->smallInteger('dato_contacto_id')->nullable()->unsigned();
            $table->integer('comision_id')->nullable()->unsigned();
            $table->string('cuenta', 250)->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        Schema::table('comision_datos_contactos', function (Blueprint $table) {
            $table->foreign('dato_contacto_id')->references('id')->on('datos_contactos')->onDelete('cascade');
            $table->foreign('comision_id')->references('id')->on('comisions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('comision_datos_contactos');
    }
}