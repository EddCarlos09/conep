<?php

    use App\Models\ProyectoLeyAutorLegislativo;
    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;

    class CreateProyectoLeyAutorLegislativosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('proyecto_ley_autor_legislativos', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('proyecto_ley_id')->nullable()->unsigned();
            $table->integer('congresista_id')->nullable()->unsigned();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });
        Schema::table('proyecto_ley_autor_legislativos', function (Blueprint $table) {
            $table->foreign('proyecto_ley_id')
                  ->references('id')
                  ->on('proyecto_leys')
                  ->onDelete('cascade');

            $table->foreign('congresista_id')
                  ->references('id')
                  ->on('congresistas')
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
        Schema::dropIfExists('proyecto_ley_autor_legislativos');
    }
}
