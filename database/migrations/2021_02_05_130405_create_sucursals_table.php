<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class CreateSucursalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sucursals', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->smallInteger('id')->unsigned()->autoIncrement();
            $table->smallInteger('tipo_sucursal_id')->unsigned()->nullable();
            $table->smallInteger('empresa_id')->unsigned()->nullable();
            $table->string('nombre', 100)->nullable();
            $table->smallInteger('numero_sucursal')->unsigned()->nullable();
            $table->smallInteger('pais_id')->unsigned()->nullable();
            $table->smallInteger('estado_id')->unsigned()->nullable();
            $table->smallInteger('municipio_id')->unsigned()->nullable();
            $table->string('codigo_postal', 6)->nullable();
            $table->string('direccion', 150)->nullable();
            $table->decimal('latitud', $precision = 17, $scale = 14)->unsigned()->nullable();
            $table->decimal('longitud', $precision = 17, $scale = 14)->unsigned()->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        Schema::table('sucursals', function (Blueprint $table) {
            $table->foreign('tipo_sucursal_id')->references('id')->on('tipo_sucursals')->onDelete('cascade');
            $table->foreign('empresa_id')->references('id')->on('empresas')->onDelete('cascade');
        });

        $data = [
            ['tipo_sucursal_id' => 1,
             'empresa_id' => 1,
             'nombre' => 'Honduras - sucursal',
             'numero_sucursal' => 1,
             'activo' => true,
             'usercreated' => 'sys@admin.com',
             'created_at' => Carbon::now()
            ]
        ];
        DB::table('sucursals')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sucursals');
    }
}
