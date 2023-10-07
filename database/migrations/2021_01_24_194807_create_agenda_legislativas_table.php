<?php
 use App\Models\AgendaLegislativa;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAgendaLegislativasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('agenda_legislativas', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->dateTime('fecha');
            $table->date('fecha_realizada')->nullable();
            $table->string('comentarios', 2500)->nullable();           
            $table->Integer('cuatrienio_id')->nullable()->unsigned();
            $table->boolean('realizado')->nullable();            
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();            
            $table->timestamps();                       
        });
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('agenda_legislativas');
    }
}
