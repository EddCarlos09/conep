<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class CreateTipoPublicacionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tipo_publicacions', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->smallInteger('id')->unsigned()->autoIncrement();
            $table->string('nombre', 200)->nullable();
            $table->string('icono', 50)->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        $data = [
            // ['id'=>3,'nombre'=>'Investigación','icono'=>'fas fa-file-alt', 'activo' => true, 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
            // ['id'=>4,'nombre'=>'Opinión','icono'=>'fas fa-file-alt', 'activo' => true, 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
            // ['id'=>1,'nombre'=>'Blog','icono'=>'fas fa-file-alt', 'activo' => true, 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
            // ['id'=>7,'nombre'=>'Boletin ejemplo borrar','icono'=>'fas fa-file-alt', 'activo' => true, 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
            // ['id'=>2,'nombre'=>'Reportaje','icono'=>'fas fa-file-alt', 'activo' => true, 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
            // ['id'=>8,'nombre'=>'Balance','icono'=>'fas fa-file-alt', 'activo' => true, 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
            ['id'=>10,'nombre' => 'Lectura', 'icono' => 'fas fa-file-alt','activo' => true, 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
            ['id'=>11,'nombre' => 'Imágenes', 'icono' => 'fas fa-images','activo' => true, 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
            ['id'=>12,'nombre' => 'Video', 'icono' => 'fas fa-play-circle','activo' => true, 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()]
        ];

        DB::table('tipo_publicacions')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tipo_publicacions');
    }
}
