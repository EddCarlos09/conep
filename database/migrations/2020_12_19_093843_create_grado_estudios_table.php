<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;
class CreateGradoEstudiosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('grado_estudios', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->smallInteger('id')->unsigned()->autoIncrement();
            $table->string('nombre', 50)->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        $data = [
            ['id'=>1,'nombre'=>'Bachillerato','activo'=>1,],
            ['id'=>2,'nombre'=>'Bachillerato incompleto','activo'=>1,],
            ['id'=>3,'nombre'=>'Doctorado','activo'=>1,],
            ['id'=>4,'nombre'=>'Especialización','activo'=>1,],
            ['id'=>5,'nombre'=>'Maestría','activo'=>1,],
            ['id'=>9,'nombre'=>'Primaria','activo'=>1,],
            ['id'=>10,'nombre'=>'Primaria incompleta','activo'=>1,],
            ['id'=>12,'nombre'=>'Técnica','activo'=>1,],
            ['id'=>13,'nombre'=>'Tecnológica','activo'=>1,],
            ['id'=>14,'nombre'=>'Tecnológica incompleta','activo'=>1,],
            ['id'=>15,'nombre'=>'Técnica incompleta','activo'=>1,],
            ['id'=>16,'nombre'=>'Universitaria','activo'=>1,],
            ['id'=>17,'nombre'=>'Universitaria Incompleta','activo'=>1,],

        ];
        DB::table('grado_estudios')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('grado_estudios');
    }
}
