<?php

    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\DB;
    use Illuminate\Support\Facades\Schema;

    class CreateIniciativasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('iniciativas', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->smallInteger('id')->unsigned()->autoIncrement();
            $table->string('nombre', 350)->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->boolean('aplica_persona')->nullable();
            $table->boolean('aplica_congresista')->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });
        $data = [
            [
                'id'                 => 1,
                'nombre'             => 'Legislativa',
                'aplica_persona'     => 0,
                'aplica_congresista' => 1
            ],
            [
                'id'                 => 2,
                'nombre'             => 'Gubernamental',
                'aplica_persona'     => 1,
                'aplica_congresista' => 0
            ],
            [
                'id'                 => 3,
                'nombre'             => 'Otras entidades',
                'aplica_persona'     => 1,
                'aplica_congresista' => 0
            ],
            [
                'id'                 => 4,
                'nombre'             => 'Mixta',
                'aplica_persona'     => 1,
                'aplica_congresista' => 1
            ],
            [
                'id'                 => 5,
                'nombre'             => 'Popular',
                'aplica_persona'     => 0,
                'aplica_congresista' => 0
            ]
        ];

        DB::table('iniciativas')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('iniciativas');
    }
}
