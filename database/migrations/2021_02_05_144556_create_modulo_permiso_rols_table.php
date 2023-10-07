<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class CreateModuloPermisoRolsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('modulo_permiso_rols', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->bigInteger('modulo_permiso_id')->unsigned()->nullable();
            $table->smallInteger('rol_id')->unsigned()->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        $data = [
            [
                'modulo_permiso_id' => 1,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 2,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 3,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 4,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 5,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 6,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 7,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 8,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 9,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 10,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 11,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 12,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 13,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 14,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 15,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 16,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 17,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 18,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 19,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 20,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 21,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 22,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 23,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 24,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 25,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 26,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 27,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 28,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 29,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 30,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 31,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 32,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 33,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 34,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 35,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 36,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 37,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 38,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 39,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 40,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 41,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 42,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 43,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 44,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 45,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 46,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 47,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 48,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 49,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 50,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' => 51,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>52,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>53,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>54,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>55,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>56,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>57,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>58,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>59,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>60,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>61,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>62,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>63,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>64,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>65,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>66,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>67,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>68,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>69,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>70,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>71,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>72,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>73,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>74,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>75,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>76,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>77,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>78,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>79,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>80,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>81,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>82,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>83,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>84,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>85,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>86,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>87,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>88,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>89,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>90,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>91,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>92,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>93,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>94,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>95,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>96,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>97,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>98,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>99,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>100,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@adin.com',
                'created_at' => Carbon::now()
            ],

            [
                'modulo_permiso_id' =>101,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>102,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>103,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>104,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>105,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>106,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>107,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>108,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>109,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>110,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>111,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>112,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>113,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>114,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>115,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>116,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>117,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>118,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>119,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>120,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>121,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>122,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>123,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>124,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>125,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>126,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>127,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>128,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>129,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>130,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>131,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>132,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>133,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>134,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>135,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>136,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>137,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>138,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>139,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>140,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>141,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>142,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>143,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>144,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>145,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>146,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>147,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>148,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>149,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>150,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>151,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>152,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>153,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>154,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>155,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>156,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>157,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>158,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>159,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>160,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>161,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>162,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>163,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>164,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>165,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>166,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>167,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>168,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>169,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>170,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>171,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>172,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>173,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>174,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>175,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>176,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>177,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>178,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>179,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>180,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>181,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>182,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>183,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>184,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>185,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>186,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>187,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>188,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>189,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>190,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>191,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>192,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>193,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>194,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>195,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>196,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>197,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>198,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>199,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>200,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>201,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>202,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>203,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>204,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>205,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>206,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>207,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>208,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>209,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>210,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>211,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>212,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>213,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>214,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>215,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>216,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>217,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>218,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>219,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>220,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>221,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>222,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>223,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>224,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>225,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>226,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>227,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>228,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>229,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>230,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>231,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>232,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>233,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>234,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>235,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>236,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>237,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>238,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>239,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>240,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>241,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>242,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>243,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>244,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>245,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>246,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>247,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>248,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>249,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>250,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>251,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>252,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>253,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>254,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>255,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>256,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>257,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>258,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>259,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>260,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>261,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>262,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>263,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>264,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>265,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>266,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>267,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>268,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>269,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>270,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>271,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>272,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>273,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>274,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>275,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>276,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>277,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>278,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>279,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>280,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>281,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>282,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>283,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>284,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>285,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>286,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>287,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>288,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>289,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>290,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>291,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>292,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>293,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>294,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>295,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>296,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>297,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>298,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>299,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>300,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>301,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>302,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>303,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>304,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>305,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>306,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>307,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>308,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>309,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>310,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>311,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>312,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>313,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>314,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>315,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>316,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>317,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>318,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>319,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>320,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>321,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>322,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>323,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>324,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>325,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>326,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
                [
                    'modulo_permiso_id' =>327,
                    'rol_id' => 1,
                    'activo' => true,
                    'usercreated' => 'sys@admin.com',
                    'created_at' => Carbon::now()
                ],
                [
                    'modulo_permiso_id' =>328,
                    'rol_id' => 1,
                    'activo' => true,
                    'usercreated' => 'sys@admin.com',
                    'created_at' => Carbon::now()
                ],
                [
                    'modulo_permiso_id' =>329,
                    'rol_id' => 1,
                    'activo' => true,
                    'usercreated' => 'sys@admin.com',
                    'created_at' => Carbon::now()
                ],
                [
                    'modulo_permiso_id' =>330,
                    'rol_id' => 1,
                    'activo' => true,
                    'usercreated' => 'sys@admin.com',
                    'created_at' => Carbon::now()
                ],
                [
                    'modulo_permiso_id' =>331,
                    'rol_id' => 1,
                    'activo' => true,
                    'usercreated' => 'sys@admin.com',
                    'created_at' => Carbon::now()
                ],
            [
                'modulo_permiso_id' =>332,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>333,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>334,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>335,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>336,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>337,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>338,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>339,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>340,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>341,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>342,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>343,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>344,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>345,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>346,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>347,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>348,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>349,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>350,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>351,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>352,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>353,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>354,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>355,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>356,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>357,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>358,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>359,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>360,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>361,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>362,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>363,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>364,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>365,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>366,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>367,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>368,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>369,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_permiso_id' =>370,
                'rol_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ]
        ];

        DB::table('modulo_permiso_rols')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('modulo_permiso_rols');
    }
}
