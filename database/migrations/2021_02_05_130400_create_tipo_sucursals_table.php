<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class CreateTipoSucursalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tipo_sucursals', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->smallInteger('id')->unsigned()->autoIncrement();
            $table->string('nombre', 50)->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });
        $data = [
            [
                'nombre' => 'Matriz',
                'activo' => true,
                'usercreated' => 'sys@admin.com',
                'created_at' => Carbon::now()
            ]
        ];

        DB::table('tipo_sucursals')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tipo_sucursals');
    }
}
