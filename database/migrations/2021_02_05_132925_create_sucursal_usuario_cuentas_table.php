<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class CreateSucursalUsuarioCuentasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sucursal_usuario_cuentas', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->smallInteger('sucursal_id')->unsigned()->nullable();
            $table->bigInteger('usuario_cuenta_id')->unsigned()->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        Schema::table('sucursal_usuario_cuentas', function (Blueprint $table) {
            $table->foreign('sucursal_id')->references('id')->on('sucursals')->onDelete('cascade');
            $table->foreign('usuario_cuenta_id')->references('id')->on('usuario_cuentas')->onDelete('cascade');
        });

        $data = [
            ['sucursal_id' => 1,
             'usuario_cuenta_id' => 1,
             'activo' => true,
             'usercreated' => 'sys@admin.com',
             'created_at' => Carbon::now()
            ]
        ];

        DB::table('sucursal_usuario_cuentas')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sucursal_usuario_cuentas');
    }
}
