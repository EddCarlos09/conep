<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CreateComisionTipoCongresistasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comision_tipo_congresistas', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->tinyInteger('id')->unsigned()->autoIncrement();
            $table->string('nombre', 20)->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        DB::table('comision_tipo_congresistas')->insert(
            array(
                'nombre' => 'Mesa directiva',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('comision_tipo_congresistas')->insert(
            array(
                'nombre' => 'Secretaría',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('comision_tipo_congresistas')->insert(
            array(
                'nombre' => 'Integrantes',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('comision_tipo_congresistas')->insert(
            array(
                'nombre' => 'Funcionarios',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            )
        );
        DB::table('comision_tipo_congresistas')->insert(
            array(
                'nombre' => 'Legislador',
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
        Schema::dropIfExists('comision_tipo_congresistas');
    }
}
