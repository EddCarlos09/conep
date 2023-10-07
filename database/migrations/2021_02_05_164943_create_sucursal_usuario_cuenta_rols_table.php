<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class CreateSucursalUsuarioCuentaRolsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sucursal_usuario_cuenta_rols', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->smallInteger('rol_id')->unsigned()->nullable();
            $table->bigInteger('sucursal_usuario_cuenta_id')->unsigned()->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        Schema::table('sucursal_usuario_cuenta_rols', function (Blueprint $table) {
            $table->foreign('rol_id')->references('id')->on('rols')->onDelete('cascade');
            $table->foreign('sucursal_usuario_cuenta_id')->references('id')->on('sucursal_usuario_cuentas')->onDelete('cascade');
        });

        $data = [
            [
                'rol_id' => 1,
                'sucursal_usuario_cuenta_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ]
        ];

        DB::table('sucursal_usuario_cuenta_rols')->insert($data);
    }

    /**
     *
     *
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sucursal_usuario_cuenta_rols');
    }
}
