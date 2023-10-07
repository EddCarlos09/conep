<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CreateComisionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comisions', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->integer('id')->unsigned()->autoIncrement();
            $table->string('nombre', 200)->nullable();
            // $table->smallInteger('corporacion_id')->unsigned()->nullable();
            $table->smallInteger('tipo_comision_id')->unsigned()->nullable();
            $table->text('descripcion')->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
            // Campos agregados por db de postgre
           $table->integer('camara_id')->unsigned()->nullable();
           $table->boolean('permanente')->nullable();
           $table->string('imagen', 100)->nullable();
           $table->integer('orden')->unsigned()->nullable();
           $table->string('correo', 75)->nullable();
           $table->string('oficina', 100)->nullable();
           $table->string('telefono', 50)->nullable();
           $table->string('url', 200)->nullable();
        });

        Schema::table('comisions', function (Blueprint $table) {
            // $table->foreign('corporacion_id')->references('id')->on('corporacions')->onDelete('cascade');
            $table->foreign('tipo_comision_id')->references('id')->on('tipo_comisions')->onDelete('cascade');

        });

        // Salvador

        // $data = [
        //     ['nombre'=> 'Comisión Agropecuaria','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Asuntos Municipales','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de la Mujer y la Igualdad de Género ','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Cultura y Educación','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Defensa','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Economía','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión Financiera','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de la Familia, Niñez, Adolescencia, Adulto Mayor y Personas con Discapacidad','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Hacienda y Especial del Presupuesto','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Juventud y Deporte','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Justicia y Derechos Humanos','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Legislación y Puntos Constitucionales','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Medio Ambiente y Cambio Climático','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Obras Públicas, Transporte y Vivienda','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Política','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Relaciones Exteriores, Integración Centroamericana y Salvadoreños en el Exterior','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Reformas Electorales y Constitucionales','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Salud ','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Seguridad Pública y Combate a la Narcoactividad','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión de Trabajo y Previsión Social','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión Especial para investigar el destino final de los fondos que la Asamblea Legislativa ha aprobado para Organizaciones No Gubernamentales, Fundacionales y Asociaciones sin fines de lucro','tipo_comision_id'=>2,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión Especial para investigar la entrega de sobresueldos provenientes de fondos públicos de Casa Presidencial a funcionarios, personas naturales o jurídicas de gobiernos anteriores ','tipo_comision_id'=>2,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        //     ['nombre'=> 'Comisión Ad Hoc para que estudio el proyecto de Ley de Recursos Hídricos. ','tipo_comision_id'=>3,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        // ];

        // Honduras

        $data = [
            ['nombre'=> 'Comisión de prueba','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Medio Ambiente y Cambio Climático ','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Equidad de Género ','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Finanzas y Cooperación Externa','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Defensa y Soberanía','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de la Familia, la Niñez, Juventud y Adulto Mayor','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Economía Social ','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Legislación y Asuntos Constitucionales','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Asuntos Electorales','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Presupuestos','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Justicia y Derechos Humanos','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Ética y Transparencia','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Educación','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Salud','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Seguridad y Prevención Ciudadana','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Transporte, Vivienda y Urbanismo','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Telecomunicaciones','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Energía','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Agricultura y Ganadería','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Relaciones Internacionales e Integración Regional ','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Minería e Hidrocarburos','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Desarrollo y Protección Social ','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Trabajo y Asuntos Gremiales','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Modernización y Comunicación Institucional ','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Deporte y Prevención Social ','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Enlace con la Sociedad Civil y Participación Comunitaria','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Asuntos Regionales, Departamentales y Municipales','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Ciencia y Tecnología','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Promoción de Inversiones','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['nombre'=> 'Comisión de Enlace con Grupos Indígenas y Afro-hondureños','tipo_comision_id'=>1,'descripcion'=>'Descripción de prueba','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        ];

        DB::table('comisions')->insert($data);

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('comisions');
    }
}
