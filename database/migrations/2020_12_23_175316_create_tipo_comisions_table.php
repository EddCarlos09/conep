<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CreateTipoComisionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tipo_comisions', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->smallInteger('id')->unsigned()->autoIncrement();
            // $table->smallInteger('cororacion_id')->nullable()->unsigned();
            $table->string('nombre', 50)->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });
        // Schema::table('tipo_comisions', function (Blueprint $table) {
        //     $table->foreign('corporacion_id')->references('id')->on('corporacions')->onDelete('cascade');
        // });

        // Salvador

        // $data = [
        //     ['nombre' => 'Comisión Permanente', 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
        //     ['nombre' => 'Comisión Especial', 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
        //     ['nombre' => 'Comisión Ad Hoc', 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
        //     ['nombre' => 'Comisión Transitoria', 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
        // ];

        // Honduras

        $data = [
            ['nombre' => 'Comisión Ordinaria', 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
        ];
        DB::table('tipo_comisions')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tipo_comisions');
    }
}
