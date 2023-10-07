<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

    class CreateUsuarioCuentasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usuario_cuentas', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->smallInteger('tipo_usuario_id')->nullable()->unsigned();
            $table->string('email', 50)->nullable();
            $table->string('nombre_completo', 100)->nullable();
            $table->string('password', 500)->nullable();
            $table->smallInteger('intentos')->default(0)->nullable()->unsigned();
            $table->date('fecha_suspension')->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        Schema::table('usuario_cuentas', function (Blueprint $table) {
            $table->foreign('tipo_usuario_id')->references('id')->on('tipo_usuarios')->onDelete('cascade');
        });

        $data = [
            [
                'tipo_usuario_id' => 1,
                'nombre_completo' => 'Admnistrador',
                'email' => 'administrador@administrador.com',
                'password'=> Hash::make('123456'),
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ],
        ];

        DB::table('usuario_cuentas')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('usuario_cuentas');
    }
}
