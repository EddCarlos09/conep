<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;
class CreateTipoPublicacionProyectoLeysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tipo_publicacion_proyecto_leys', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->smallInteger('id')->unsigned()->autoIncrement();
            $table->string('nombre', 200)->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });
        DB::table('tipo_publicacion_proyecto_leys')->insert(
            array(
                'nombre' => 'Primer debate',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_publicacion_proyecto_leys')->insert(
            array(
                'nombre' => 'Segundo debate',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_publicacion_proyecto_leys')->insert(
            array(
                'nombre' => 'Conciliación',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_publicacion_proyecto_leys')->insert(
            array(
                'nombre' => 'Objeciones presidenciales',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tipo_publicacion_proyecto_leys');
    }
}
