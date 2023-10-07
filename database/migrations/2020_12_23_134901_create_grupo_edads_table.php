<?php

    use Carbon\Carbon;
    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\DB;
    use Illuminate\Support\Facades\Schema;

    class CreateGrupoEdadsTable extends Migration
    {
        /**
         * Run the migrations.
         *
         * @return void
         */
        public function up()
        {
            Schema::create(
                'grupo_edads',
                function (Blueprint $table)
                {
                    $table->engine = 'InnoDB';
                    $table->smallInteger('id')->unsigned()->autoIncrement();
                    $table->string(
                        'nombre',
                        50
                    )->nullable();
                    $table->tinyInteger(
                        'edad_inicial',
                        false,
                        true
                    )->nullable();
                    $table->tinyInteger(
                        'edad_final',
                        false,
                        true
                    )->nullable();
                    $table->boolean('activo')->default(1)->nullable();
                    $table->string(
                        'usercreated',
                        250
                    )->nullable();
                    $table->string(
                        'usermodifed',
                        250
                    )->nullable();
                    $table->timestamps();
                }
            );
            DB::table('grupo_edads')->insert(
                [
                    'nombre'       => '25-34',
                    'edad_inicial' => 25,
                    'edad_final'   => 34,
                    'activo'       => true,
                    'usercreated'  => 'sys@admin.com',
                    'created_at'   => Carbon::now()
                ]
            );
            DB::table('grupo_edads')->insert(
                [
                    'nombre'       => '35-44',
                    'edad_inicial' => 35,
                    'edad_final'   => 44,
                    'activo'       => true,
                    'usercreated'  => 'sys@admin.com',
                    'created_at'   => Carbon::now()
                ]
            );
            DB::table('grupo_edads')->insert(
                [
                    'nombre'       => '45-54',
                    'edad_inicial' => 45,
                    'edad_final'   => 54,
                    'activo'       => true,
                    'usercreated'  => 'sys@admin.com',
                    'created_at'   => Carbon::now()
                ]
            );
            DB::table('grupo_edads')->insert(
                [
                    'nombre'       => '55-64',
                    'edad_inicial' => 55,
                    'edad_final'   => 64,
                    'activo'       => true,
                    'usercreated'  => 'sys@admin.com',
                    'created_at'   => Carbon::now()
                ]
            );
            DB::table('grupo_edads')->insert(
                [
                    'nombre'       => '65-74',
                    'edad_inicial' => 65,
                    'edad_final'   => 74,
                    'activo'       => true,
                    'usercreated'  => 'sys@admin.com',
                    'created_at'   => Carbon::now()
                ]
            );
            DB::table('grupo_edads')->insert(
                [
                    'nombre'       => '75-84',
                    'edad_inicial' => 75,
                    'edad_final'   => 84,
                    'activo'       => true,
                    'usercreated'  => 'sys@admin.com',
                    'created_at'   => Carbon::now()
                ]
            );
            DB::table('grupo_edads')->insert(
                [
                    'nombre'       => '85-94',
                    'edad_inicial' => 85,
                    'edad_final'   => 94,
                    'activo'       => true,
                    'usercreated'  => 'sys@admin.com',
                    'created_at'   => Carbon::now()
                ]
            );
        }

        /**
         * Reverse the migrations.
         *
         * @return void
         */
        public function down()
        {
            Schema::dropIfExists('grupo_edads');
        }
    }
