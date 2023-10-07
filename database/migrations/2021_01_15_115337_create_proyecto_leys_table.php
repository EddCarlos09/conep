<?php

    use App\Models\ProyectoLey;
    use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateProyectoLeysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('proyecto_leys', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->smallInteger('cuatrienio_id')->nullable()->unsigned();
            $table->smallInteger('legislatura_id')->nullable()->unsigned();
            $table->string('titulo', 500)->nullable();
            $table->string('alias', 500)->nullable();
            $table->date('fecha_radicacion')->nullable();
            $table->string('numero_camara', 20)->nullable();
            $table->smallInteger('iniciativa_id')->unsigned()->unsigned();
            $table->tinyInteger('tipo_proyecto_id')->nullable()->unsigned();
            $table->smallInteger('tema_id_principal')->nullable()->unsigned();
            $table->smallInteger('tema_id_secundario')->nullable()->unsigned();
            $table->text('sinopsis')->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });
        Schema::table('proyecto_leys', function (Blueprint $table) {
            $table->foreign('cuatrienio_id')->references('id')->on('cuatrienios')->onDelete('cascade');
            $table->foreign('legislatura_id')->references('id')->on('legislaturas')->onDelete('cascade');
            $table->foreign('iniciativa_id')->references('id')->on('iniciativas')->onDelete('cascade');
            $table->foreign('tipo_proyecto_id')->references('id')->on('tipo_proyectos')->onDelete('cascade');
            $table->foreign('tema_id_principal')->references('id')->on('temas')->onDelete('cascade');
            $table->foreign('tema_id_secundario')->references('id')->on('temas')->onDelete('cascade');
        });
        
    }
    
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('proyecto_leys');
    }
}
