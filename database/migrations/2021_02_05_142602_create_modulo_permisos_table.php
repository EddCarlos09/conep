<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class CreateModuloPermisosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('modulo_permisos', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->smallInteger('modulo_id')->unsigned()->nullable();
            $table->smallInteger('permiso_id')->unsigned()->nullable();
            $table->string('descripcion', 500)->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        $data = [
            [
                'modulo_id' => 1,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar la página principal.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 2,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar la empresa.',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 2,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de la empresa.',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 3,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar una nueva sucursal.',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 3,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar una sucursal.',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 3,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar una sucursal.',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 3,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener una sucursal.',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 3,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos las sucursales.',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 3,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de sucursales.',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 4,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un nuevo usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 4,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 4,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 4,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 4,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los usuarios.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 4,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de usuarios.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 4,
                'permiso_id' => 7,
                'descripcion' => 'Se permite desbloquear a un usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 5,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un nueva asignación de usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 5,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar una asignación de usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 5,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar una sucursal.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 5,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener una sucursal.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 5,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todas las sucursales.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 5,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de asignación de usuarios.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 6,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un nuevo usuario a la sucursal.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 6,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un usuario a la sucursal.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 6,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un usuario a la sucursal.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 6,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un usuario de la sucursal.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 6,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los usuarios de la sucursal.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 6,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de usuarios de la sucursal.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 7,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un nuevo rol al usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 7,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un rol al usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 7,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un rol al usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 7,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un rol del usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 7,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los roles del usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 7,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de roles por usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 8,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un rol.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 8,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un rol.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 8,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un rol.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 8,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un rol.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 8,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los roles.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 8,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 9,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un tipo de usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 9,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un tipo de usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 9,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un tipo de usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 9,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un tipo de usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 9,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los tipos de usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 9,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de tipo de usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 10,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un nuevo rol al tipo de usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 10,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un rol a un tipo de usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 10,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un rol de a un tipo de usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 10,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un rol de un tipo de usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 10,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los roles de un tipo de usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 10,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de roles por tipo de usuario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 11,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un congresitas.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 11,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un congresista.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 11,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un congresista.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 11,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un congresista.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 11,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los congresistas.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 11,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de congresista.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 12,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar una comisión.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 12,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un comisión.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 12,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un comisión.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 12,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un comisión.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 12,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los comisiones.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 12,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de comisión.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 13,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 13,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 13,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 13,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 13,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los proyectos de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 13,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 14,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un blog de nuestra democracia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 14,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un blog de nuestra democracia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 14,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un blog de nuestra democracia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 14,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un blog de nuestra democracia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 14,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los blos de nuestra democracia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 14,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de blog de nuestra democracia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a congreso visible.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a congreso visible.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a congreso visible.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a congreso visible.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de congreso visible.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de congreso visible.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a control político.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a control político.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a control político.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a control político.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de control político.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de control político.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 17,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a agenda legislativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 17,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a agenda legislativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 17,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a agenda legislativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 17,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a agenda legislativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 17,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de agenda legislativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 17,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de agenda legislativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 18,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a secretario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 18,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a secretario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 18,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a secretario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 18,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a secretario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 18,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de secretario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 18,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de secretario.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],

            [
                'modulo_id' => 19,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a información del sitio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 19,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a información del sitio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 19,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a información del sitio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 19,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a información del sitio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 19,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de información del sitio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 19,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de información del sitio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 20,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a informes PNUD.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 20,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a informes PNUD.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 20,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a informes PNUD.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 20,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a informes PNUD.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 20,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de informes PNUD.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 20,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de informes PNUD.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 21,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a balance cuatrienio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 21,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a balance cuatrienio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 21,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a balance cuatrienio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 21,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a balance cuatrienio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 21,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de balance cuatrienio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 21,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de balance cuatrienio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 22,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a opinión.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 22,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a opinión.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 22,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a opinión.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 22,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a opinión.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 22,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de opinión.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 22,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de opinión.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 23,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a opinión de congresistas.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 23,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a opinión de congresistas.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 23,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a opinión de congresistas.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 23,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a opinión de congresistas.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 23,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de opinión de congresistas.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 23,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de opinión de congresistas.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 24,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a podcast.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 24,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a podcast.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 24,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a podcast.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 24,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a podcast.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 24,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de podcast.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 24,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de podcast.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 25,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a multimedia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 25,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a multimedia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 25,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a multimedia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 25,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a multimedia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 25,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de multimedia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 25,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de multimedia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 26,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a partidos.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 26,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a partidos.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 26,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a partidos.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 26,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a partidos.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 26,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de partidos.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 26,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de partidos.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 27,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a votaciones.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 27,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a votaciones.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 27,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a votaciones.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 27,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a votaciones.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 27,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de votaciones.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 27,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de votaciones.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 28,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a elecciones.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 28,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a elecciones.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 28,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a elecciones.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 28,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a elecciones.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 28,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de elecciones.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 28,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de elecciones.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 29,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a datos contacto.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 29,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a datos contacto.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 29,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a datos contacto.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 29,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a datos contacto.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 29,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de datos contacto.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 29,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de datos contacto.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 30,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a cuatrienio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 30,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a cuatrienio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 30,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a cuatrienio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 30,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a cuatrienio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 30,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de cuatrienio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 30,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de cuatrienio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 31,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a departamento.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 31,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a departamento.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 31,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a departamento.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 31,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a departamento.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 31,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de departamento.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 31,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de departamento.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 32,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a geografía.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 32,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a geografía.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 32,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a geografía.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 32,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a geografía.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 32,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de geografía.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 32,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de geografía.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 33,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a género.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 33,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a género.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 33,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a género.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 33,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a género.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 33,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de género.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 33,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de género.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 34,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a grado de estudio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 34,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a grado de estudio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 34,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a grado de estudio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 34,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a grado de estudio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 34,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de grado de estudio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 34,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de grado de estudio.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 35,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a grupo de edad.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 35,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a grupo de edad.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 35,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a grupo de edad.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 35,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a grupo de edad.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 35,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de grupo de edad.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 35,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de grupo de edad.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 36,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a circunscripción.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 36,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a circunscripción.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 36,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a circunscripción.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 36,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a circunscripción.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 36,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de circunscripción.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 36,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de circunscripción.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 37,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a cargo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 37,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a cargo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 37,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a cargo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 37,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a cargo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 37,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de cargo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 37,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de cargo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 38,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a cargo de integrante.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 38,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a cargo de integrante.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 38,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a cargo de integrante.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 38,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a cargo de integrante.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 38,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de cargo de integrante.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 38,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de cargo de integrante.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 39,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a estado de proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 39,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a estado de proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 39,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a estado de proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 39,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a estado de proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 39,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de estado de proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 39,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de estado de proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 40,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a iniciativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 40,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a iniciativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 40,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a iniciativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 40,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a iniciativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 40,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de iniciativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 40,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de iniciativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 41,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a legislatura.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 41,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a legislatura.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 41,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a legislatura.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 41,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a legislatura.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 41,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de legislatura.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 41,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de legislatura.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 42,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a tema de proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 42,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a tema de proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 42,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a tema de proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 42,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a tema de proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 42,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de tema de proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 42,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de tema de proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 43,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a tema de control.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 43,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a tema de control.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 43,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a tema de control.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 43,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a tema de control.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 43,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de tema de control.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 43,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de tema de control.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 44,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a tipo de publicación proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 44,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a tipo de publicación proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 44,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a tipo de publicación proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 44,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a tipo de publicación proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 44,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de tipo de publicación proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 44,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de tipo de publicación proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 45,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a tipo de fecha proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 45,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a tipo de fecha proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 45,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a tipo de fecha proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 45,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a tipo de fecha proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 45,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de tipo de fecha proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 45,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de tipo de fecha proyecto de ley.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 46,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a estado de control político.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 46,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a estado de control político.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 46,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a estado de control político.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 46,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a estado de control político.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 46,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de estado de control político.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 46,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de estado de control político.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 47,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a glosario legislativo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 47,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a glosario legislativo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 47,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a glosario legislativo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 47,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a glosario legislativo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 47,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de glosario legislativo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 47,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de glosario legislativo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 48,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a tema blog nuestra democracia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 48,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a tema blog nuestra democracia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 48,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a tema blog nuestra democracia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 48,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a tema blog nuestra democracia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 48,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de tema blog nuestra democracia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 48,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de tema blog nuestra democracia.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 49,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a tipo de actividad en la agenda legislativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 49,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a tipo de actividad en la agenda legislativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 49,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a tipo de actividad en la agenda legislativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 49,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a tipo de actividad en la agenda legislativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 49,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de tipo de actividad en la agenda legislativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 49,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de tipo de actividad en la agenda legislativa.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 50,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a corporación.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 50,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a corporación.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 50,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a corporación.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 50,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a corporación.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 50,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de corporación.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 50,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de corporación.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 51,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un registro a tipo citación.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 51,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un registro a tipo citación.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 51,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un registro a tipo citación.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 51,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un registro a tipo citación.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 51,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener todos los registros de tipo citación.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 51,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el index de tipo citación.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite visualizar el index de proposiciones',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite agregar un registro de proposiciones',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite obtener un registro de proposiciones',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite modificar un registro de proposiciones',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite eliminar un registro de proposiciones',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite visualizar el index de citantes',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite agregar un registro de citantes',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite eliminar un registro de citantes',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite visualizar el index de citados',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite agregar un registro de citados',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite obtener un registro de citados',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite modificar un registro de citados',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite eliminar un registro de citados',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite visualizar el index de respuestas',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite agregar un registro de respuestas',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite obtener un registro de respuestas',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite modificar un registro de respuestas',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite eliminar un registro de respuestas',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite visualizar el index de documentos',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite agregar un registro de documentos',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite obtener un registro de documentos',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite modificar un registro de documentos',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 16,
                'permiso_id' => 7,
                'descripcion' => 'Se permite eliminar un registro de documentos',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            //CongresoVisibleEquipos
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite visualizar el index de equipos.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite obtener todos los registros de equipos.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite agregar un registro de equipos.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite obtener un registro de equipos.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite modificar un registro de equipos.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite eliminar un registro de equipos',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            //CongresoVisibleEquiposIntegrante
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite visualizar el index de integrantes de equipo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite obtener todos los registros de integrantes de equipo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite agregar un registro de integrantes de equipo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite obtener un registro de integrantes de equipo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite modificar un registro de integrantes de equipo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite eliminar un registro de integrantes de equipo.',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            //CongresoVisibleAliados
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite visualizar el index aliados',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite obtener todos los registros de aliados',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite agregar un registro aliados',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite obtener un registro aliados',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite modificar un registro aliados',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 15,
                'permiso_id' => 7,
                'descripcion' => 'Se permite eliminar un registro aliados',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 52,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar una persona',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 52,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar una persona',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 52,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar una persona',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 52,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener una persona',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 52,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener a todas las personas',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 52,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el módulo de persona',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 53,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar una profesión',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 53,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar una profesión',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 53,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar una profesión',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 53,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener una profesión',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 53,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener a todas las profesiónes',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 53,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el módulo de profesión',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 54,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar una región',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 54,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar una región',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 54,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar una región',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 54,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener una región',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 54,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener a todas las regiones',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 54,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el módulo de región',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 55,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un municipio',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 55,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un municipio',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 55,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un municipio',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 55,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un municipio',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 55,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener a todas los municipios',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 55,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el módulo de municipio',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],

            [
                'modulo_id' => 56,
                'permiso_id' => 1,
                'descripcion' => 'Se permite agregar un tipo de investigación',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 56,
                'permiso_id' => 2,
                'descripcion' => 'Se permite modificar un tipo de investigación',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 56,
                'permiso_id' => 3,
                'descripcion' => 'Se permite eliminar un tipo de investigación',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 56,
                'permiso_id' => 4,
                'descripcion' => 'Se permite obtener un tipo de investigación',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 56,
                'permiso_id' => 5,
                'descripcion' => 'Se permite obtener a todas los tipos de investigación',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
            [
                'modulo_id' => 56,
                'permiso_id' => 6,
                'descripcion' => 'Se permite visualizar el módulo de tipo de investigación',
                'activo' => false,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ]
        ];

        DB::table('modulo_permisos')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('modulo_permisos');
    }
}
