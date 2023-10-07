<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class CreateRolTipoUsuariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rol_tipo_usuarios', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->smallInteger('rol_id')->unsigned()->nullable();
            $table->smallInteger('tipo_usuario_id')->unsigned()->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        Schema::table('rol_tipo_usuarios', function (Blueprint $table) {
            $table->foreign('rol_id')->references('id')->on('rols')->onDelete('cascade');
            $table->foreign('tipo_usuario_id')->references('id')->on('tipo_usuarios')->onDelete('cascade');
        });

        $data = [
            [
                'rol_id' => 1,
                'tipo_usuario_id' => 1,
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ]
        ];

        DB::table('rol_tipo_usuarios')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rol_tipo_usuarios');
    }
}
