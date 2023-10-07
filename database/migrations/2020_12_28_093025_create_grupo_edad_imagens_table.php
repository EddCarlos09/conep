<?php

    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;

    class CreateGrupoEdadImagensTable extends Migration
    {
        /**
         * Run the migrations.
         *
         * @return void
         */
        public function up()
        {
            Schema::create(
                'grupo_edad_imagens',
                function (Blueprint $table)
                {
                    $table->engine = 'InnoDB';
                    $table->smallInteger('id')->unsigned()->autoIncrement();
                    $table->smallInteger('grupo_edad_id')->nullable()->unsigned();
                    $table->string(
                        'imagen',
                        350
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
                    $table->foreign('grupo_edad_id')->references('id')->on(
                        'grupo_edads'
                    )->onDelete('cascade');
                }
            );
        }

        /**
         * Reverse the migrations.
         *
         * @return void
         */
        public function down()
        {
            Schema::dropIfExists('grupo_edad_imagens');
        }
    }
