<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfesionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profesions', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->string('nombre', 100)->nullable();
            $table->boolean('activo')->nullable()->default(1);
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        $data = [
            ['id'=>174,'nombre'=>'Abogado/a','activo'=>1,],
            ['id'=>175,'nombre'=>'Administrador/a de empresas','activo'=>1,],
            ['id'=>176,'nombre'=>'Antropólogo/a','activo'=>1,],
            ['id'=>177,'nombre'=>'Arquitecto/a','activo'=>1,],
            ['id'=>178,'nombre'=>'Artista','activo'=>1,],
            ['id'=>179,'nombre'=>'Biólogo/a','activo'=>1,],
            ['id'=>180,'nombre'=>'Ciencias de la Salud','activo'=>1,],
            ['id'=>181,'nombre'=>'Comunicador/a social','activo'=>1,],
            ['id'=>182,'nombre'=>'Contador/a','activo'=>1,],
            ['id'=>184,'nombre'=>'Docente','activo'=>1,],
            ['id'=>185,'nombre'=>'Economista','activo'=>1,],
            ['id'=>187,'nombre'=>'Esteticista','activo'=>1,],
            ['id'=>188,'nombre'=>'Filosofo/a','activo'=>1,],
            ['id'=>189,'nombre'=>'Físico/a','activo'=>1,],
            ['id'=>190,'nombre'=>'Geógrafo/a','activo'=>1,],
            ['id'=>191,'nombre'=>'Geólogo/a','activo'=>1,],
            ['id'=>192,'nombre'=>'Historiador/a','activo'=>1,],
            ['id'=>193,'nombre'=>'Ingeniero/a','activo'=>1,],
            ['id'=>195,'nombre'=>'Matemático/a','activo'=>1,],
            ['id'=>196,'nombre'=>'Politólogo/a','activo'=>1,],
            ['id'=>197,'nombre'=>'Psicólogo/a','activo'=>1,],
            ['id'=>198,'nombre'=>'Químico/a','activo'=>1,],
            ['id'=>199,'nombre'=>'Trabajador social','activo'=>1,],
            ['id'=>200,'nombre'=>'No profesional','activo'=>1,],
            ['id'=>201,'nombre'=>'Administrador/a público/a','activo'=>1,],
            ['id'=>202,'nombre'=>'Guía turístico','activo'=>1,],
            ['id'=>203,'nombre'=>'Internacionalista','activo'=>1,],
            ['id'=>204,'nombre'=>'Religioso','activo'=>1,],
            ['id'=>209,'nombre'=>'Empresario','activo'=>1,],
            ['id'=>217,'nombre'=>'Veterinario/a','activo'=>1,],
            ['id'=>218,'nombre'=>'Estudiante','activo'=>1,],
            ['id'=>219,'nombre'=>'Sociólogo/a','activo'=>1,],
            ['id'=>221,'nombre'=>'Carrera militar','activo'=>1,],
            ['id'=>222,'nombre'=>'Piloto','activo'=>1,],
            ['id'=>223,'nombre'=>'Deportista','activo'=>1,],
            ['id'=>227,'nombre'=>'Agrónomo/a','activo'=>1,],
            ['id'=>228,'nombre'=>'Bibliotecólogo/a','activo'=>1,],
            ['id'=>230,'nombre'=>'Publicista','activo'=>1,],
            ['id'=>234,'nombre'=>'Mercadeo / Negocios Internacionales','activo'=>1,],
            ['id'=>236,'nombre'=>'Comercio Exterior','activo'=>1,],
            ['id'=>237,'nombre'=>'Obras Públicas','activo'=>1,],
            ['id'=>238,'nombre'=>'Odontólogo/a','activo'=>1,],
            ['id'=>239,'nombre'=>'Gobierno','activo'=>1,],
            ['id'=>240,'nombre'=>'Secretario/a','activo'=>1,],
            ['id'=>241,'nombre'=>'Diseñador/a','activo'=>1,],
            ['id'=>242,'nombre'=>'Zootecnista','activo'=>1,],
            ['id'=>243,'nombre'=>'Teólogo/a','activo'=>1,],
            ['id'=>244,'nombre'=>'Auxilar de Enfermería','activo'=>1,],
            ['id'=>245,'nombre'=>'Licenciado','activo'=>1,],
        ];

        DB::table('profesions')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('profesions');
    }
}
