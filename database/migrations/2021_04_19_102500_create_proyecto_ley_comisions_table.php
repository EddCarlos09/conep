<?php

    use App\Models\ProyectoLeyComision;
    use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProyectoLeyComisionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('proyecto_ley_comisions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('proyecto_ley_estado_id')->nullable();
            $table->unsignedInteger('comision_id')->nullable();
            $table->boolean('activo')->nullable()->default(1);
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });
        Schema::table('proyecto_ley_comisions', function (Blueprint $table) {
            $table->foreign('proyecto_ley_estado_id')
                  ->references('id')
                  ->on('proyecto_ley_estados')
                  ->onDelete('cascade');

            $table->foreign('comision_id')
                  ->references('id')
                  ->on('comisions')
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
        Schema::dropIfExists('proyecto_ley_comisions');
    }
}
