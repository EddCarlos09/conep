<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CreateModulosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('modulos', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->smallInteger('id')->unsigned()->autoIncrement();
            $table->string('nombre', 50)->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        $data = [
            [
                'nombre' => 'Página principal',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Empresa',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Sucursal',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Usuario',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Asignación de usuario',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Usuarios por sucursal',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Roles por usuario',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Rol',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Tipos de usuario',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Roles por tipo de usuario',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Congresista',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Comisiones',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Proyectos de ley',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Nuestra democracia',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Congreso visible',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Control político',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Agenda legislativa',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Secretario',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Información del sitio',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Informes Regionales',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Balance cuatrienio',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Opinión',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Opinión de congresistas',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Podcast',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Multimedia',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Partidos',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Votaciones',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Elecciones',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Datos de contacto',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Cuatrienio',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Departamento',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Geografía',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Género',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Profesión',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Grupo de edad',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Circunscripción',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Cargo',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Cargo de integrante',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Estado de proyecto de ley',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Iniciativa',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Legislatura',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Tema de proyecto de ley',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Tema de control',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Tipo de publicación proyecto de ley',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Tipo de fecha proyecto de ley',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Estado de control político',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Glosario legislativo',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Tema blog nuestra democracia',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Tipo de actividad en la agenda legislativa',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Corporación',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Tipo citación',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Persona',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Profesión',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Región',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Municipio',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'nombre' => 'Tipo de investigación',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ]

        ];

        DB::table('modulos')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('modulos');
    }
}
