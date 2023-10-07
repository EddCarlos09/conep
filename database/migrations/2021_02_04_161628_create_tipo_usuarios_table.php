<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class CreateTipoUsuariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tipo_usuarios', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->smallInteger('id')->unsigned()->autoIncrement();
            $table->string('nombre', 50)->nullable();
            $table->boolean('acceso_panel_administrador')->default(0)->nullable();
            $table->boolean('acceso_panel_cliente')->default(0)->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        $data = [
            ['nombre' => 'administrador', 'acceso_panel_administrador' => true, 'acceso_panel_cliente' => false, 'activo' => true, 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
            ['nombre' => 'cliente', 'acceso_panel_administrador' => false,'acceso_panel_cliente' => true,'activo' => true, 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
        ];

        DB::table('tipo_usuarios')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tipo_usuarios');
    }
}
