<?php
use App\Models\AgendaLegislativaActividad;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAgendaLegislativaActividadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('agenda_legislativa_actividads', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->bigInteger('agenda_legislativa_id')->unsigned();            
            $table->string('titulo',250)->nullable();
            $table->boolean('destacado')->default(0)->nullable();
            $table->mediumText('descripcion')->nullable();
            $table->tinyInteger('tipo_actividad_id')->nullable()->unsigned();
            $table->bigInteger('proyecto_ley_id')->unsigned()->nullable();                       
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();            
            $table->timestamps();
        });
        Schema::table('agenda_legislativa_actividads', function (Blueprint $table) {
            $table->foreign('agenda_legislativa_id')->references('id')->on('agenda_legislativas')->onDelete('cascade');                        
            $table->foreign('tipo_actividad_id')->references('id')->on('tipo_actividad_agenda_legislativas')->onDelete('cascade');                        
        });
        
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('agenda_legislativa_actividads');
    }
}
