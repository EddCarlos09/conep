<?php
use App\Models\AgendaLegislativaComision;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAgendaLegislativaComisionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('agenda_legislativa_comisions', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->bigInteger('agenda_legislativa_id')->unsigned(); 
            // $table->smallInteger('corporacion_id')->unsigned();            
            $table->integer('comision_id')->unsigned()->nullable(); 
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();                
            $table->timestamps();
        });
        Schema::table('agenda_legislativa_comisions', function (Blueprint $table) {
            $table->foreign('agenda_legislativa_id')->references('id')->on('agenda_legislativas')->onDelete('cascade');                        
            // $table->foreign('corporacion_id')->references('id')->on('corporacions')->onDelete('cascade');           
           // $table->foreign('comision_id')->references('id')->on('comisions')->onDelete('cascade');                                                
        });
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('agenda_legislativa_comisions');
    }
}
