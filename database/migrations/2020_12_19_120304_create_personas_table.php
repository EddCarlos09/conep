<?php

use App\Models\Persona;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('personas', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->string('nombres', 50)->nullable();
            $table->string('apellidos', 100)->nullable();
            $table->date('fechaNacimiento')->nullable();
            $table->unsignedBigInteger('municipio_id_nacimiento')->nullable();
            $table->unsignedBigInteger('profesion_id')->nullable();
            $table->unsignedSmallInteger('genero_id')->nullable();
            $table->date('fecha_fallecimiento')->nullable();
            $table->text('perfil_educativo')->nullable();
            $table->unsignedSmallInteger('grado_estudio_id')->nullable();
            $table->boolean('activo')->nullable()->default(1);
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();

            $table->foreign('municipio_id_nacimiento')
                  ->references('id')
                  ->on('municipios')
                  ->onDelete('cascade');

            $table->foreign('profesion_id')
                  ->references('id')
                  ->on('profesions')
                  ->onDelete('cascade');

            $table->foreign('genero_id')
                  ->references('id')
                  ->on('generos')
                  ->onDelete('cascade');

            $table->foreign('grado_estudio_id')
                  ->references('id')
                  ->on('grado_estudios')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('personas');
    }
}
