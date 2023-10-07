<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class CreateTipoFechaProyectoLeysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tipo_fecha_proyecto_leys', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->smallInteger('id')->unsigned()->autoIncrement();
            $table->string('nombre', 100)->nullable();            
            // $table->smallInteger('corporacion_id')->nullable()->unsigned();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha publicación',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de aprobación del primer debate primera vuelta',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de aprobación del segundo debate primera vuelta',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de conciliación primera vuelta',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de radicación',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de aprobación del primer debate segunda vuelta',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de aprobación del segundo debate segunda vuelta',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de envío a comisión',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de conciliación segunda vuelta',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de publicación',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de aprobación del primer debate primera vuelta',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de aprobación del segundo debate primera vuelta',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de conciliación primera vuelta',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de radicación',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de envío a comisión',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de aprobación del primer debate primera vuelta',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de aprobación del segundo debate primera vuelta',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('tipo_fecha_proyecto_leys')->insert(
            array(
                'nombre' => 'Fecha de conciliación primera vuelta',
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
        Schema::dropIfExists('tipo_fecha_proyecto_leys');
    }
}
