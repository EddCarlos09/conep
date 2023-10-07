<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class CreateSucursalUsuarioCuentaRolModuloPermisoRolsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sucursal_usuario_cuenta_rol_modulo_permiso_rols', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->bigInteger('modulo_permiso_rol_id')->unsigned()->nullable();
            $table->bigInteger('sucursal_usuario_cuenta_rol_id')->unsigned()->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        Schema::table('sucursal_usuario_cuenta_rol_modulo_permiso_rols', function (Blueprint $table) {
            $table->foreign('modulo_permiso_rol_id', 'sucrmpr_mpr_id_foreign')
                  ->references('id')
                  ->on('modulo_permiso_rols')
                  ->onDelete('cascade');

            $table->foreign('sucursal_usuario_cuenta_rol_id', 'sucrmpr_sucr_id_foreign')
                  ->references('id')
                  ->on('sucursal_usuario_cuenta_rols')
                  ->onDelete('cascade');
        });

        $data = [
            [
                'modulo_permiso_rol_id' => 1,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 2,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 3,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 4,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 5,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 6,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 7,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 8,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 9,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 10,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 11,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 12,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 13,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 14,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 15,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 16,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 17,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 18,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 19,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 20,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 21,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 22,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 23,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 24,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 25,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 26,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 27,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 28,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 29,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 30,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 31,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 32,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 33,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 34,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 35,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 36,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 37,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 38,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 39,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 40,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 41,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 42,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 43,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 44,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 45,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 46,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 47,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 48,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 49,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 50,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 51,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 52,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 53,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 54,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 55,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 56,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 57,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 58,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 59,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 60,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 61,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 62,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 63,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 64,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 65,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 66,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 67,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 68,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 69,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 70,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 71,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 72,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 73,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 74,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 75,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 76,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 77,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 78,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 79,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 80,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 81,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 82,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 83,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 84,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 85,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 86,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 87,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 88,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 89,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 90,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 91,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 92,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 93,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 94,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 95,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 96,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 97,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 98,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 99,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 100,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],

            [
                'modulo_permiso_rol_id' => 101,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 102,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 103,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 104,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 105,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 106,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 107,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 108,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 109,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 110,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 111,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 112,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 113,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 114,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 115,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 116,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 117,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 118,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 119,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 120,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 121,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 122,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 123,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 124,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 125,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 126,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 127,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 128,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 129,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 130,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 131,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 132,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 133,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 134,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 135,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 136,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 137,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 138,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 139,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 140,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 141,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 142,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 143,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 144,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 145,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 146,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 147,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 148,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 149,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 150,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 151,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 152,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 153,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 154,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 155,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 156,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 157,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 158,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 159,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 160,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 161,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 162,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 163,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 164,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 165,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 166,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 167,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 168,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 169,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 170,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 171,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 172,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 173,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 174,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 175,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 176,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 177,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 178,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 179,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 180,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 181,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 182,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 183,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 184,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 185,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 186,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 187,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 188,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 189,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 190,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 191,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 192,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 193,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 194,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 195,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 196,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 197,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 198,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 199,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 200,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 201,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 202,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 203,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 204,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 205,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 206,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 207,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 208,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 209,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 210,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 211,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 212,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 213,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 214,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 215,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 216,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 217,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 218,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 219,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 220,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 221,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 222,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 223,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 224,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 225,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 226,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 227,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 228,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 229,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 230,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 231,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 232,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 233,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 234,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 235,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 236,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 237,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 238,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 239,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 240,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 241,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 242,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 243,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 244,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 245,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 246,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 247,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 248,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 249,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 250,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 251,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 252,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 253,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 254,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 255,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 256,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 257,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 258,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 259,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 260,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 261,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 262,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 263,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 264,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 265,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 266,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 267,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 268,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 269,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 270,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 271,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 272,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 273,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 274,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 275,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 276,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 277,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 278,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 279,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 280,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 281,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 282,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 283,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 284,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 285,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 286,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 287,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 288,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 289,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 290,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 291,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 292,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 293,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 294,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 295,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 296,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 297,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 298,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 299,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 300,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 301,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 302,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 303,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 304,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 305,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 306,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 307,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 308,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 309,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 310,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 311,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 312,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 313,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 314,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 315,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 316,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 317,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 318,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 319,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 320,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 321,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 322,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 323,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 324,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 325,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 326,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 327,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 328,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 329,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 330,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 331,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 332,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 333,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 334,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 335,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 336,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 337,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 338,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 339,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 340,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 341,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 342,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 343,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 344,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 345,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 346,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 347,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 348,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 349,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 350,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 351,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 352,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 353,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 354,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 355,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 356,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 357,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 358,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 359,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 360,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 361,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 362,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 363,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 364,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 365,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 366,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 367,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 368,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 369,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_rol_id' => 370,
                'sucursal_usuario_cuenta_rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ]
        ];

        DB::table('sucursal_usuario_cuenta_rol_modulo_permiso_rols')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sucursal_usuario_cuenta_rol_modulo_permiso_rols');
    }
}
