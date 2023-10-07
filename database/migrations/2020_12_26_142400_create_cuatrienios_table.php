<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CreateCuatrieniosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cuatrienios', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->smallInteger('id')->unsigned()->autoIncrement();
            $table->string('nombre', 50)->nullable();
            $table->year('fechaInicio')->nullable();
            $table->year('fechaFin')->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
            //Campo agregado por db de postgre
            // $table->integer('old_id')->unsigned()->nullable();
        });

        // DB::statement("ALTER TABLE cuatrienios MODIFY id smallint UNSIGNED");
        // DB::statement("ALTER TABLE cuatrienios DROP PRIMARY KEY");


        $data = [
            ['id'=>5, 'nombre'=> '1994-1998','fechaInicio'=>'1994-07-20','fechaFin'=>'1998-07-19','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['id'=>1, 'nombre'=> '1998-2002','fechaInicio'=>'1998-07-20','fechaFin'=>'2002-07-19','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['id'=>4, 'nombre'=> '2002-2006','fechaInicio'=>'2002-07-20','fechaFin'=>'2006-07-19','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['id'=>2, 'nombre'=> '2006-2010','fechaInicio'=>'2006-07-20','fechaFin'=>'2010-07-19','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['id'=>6, 'nombre'=> '2010-2014','fechaInicio'=>'2010-07-20','fechaFin'=>'2014-07-19','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['id'=>7, 'nombre'=> '2014-2018','fechaInicio'=>'2014-07-20','fechaFin'=>'2018-07-19','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
            ['id'=>8, 'nombre'=> '2018-2022','fechaInicio'=>'2018-07-20','fechaFin'=>'2022-07-20','activo'=>1,'usercreated' => 'sys@admin.com','created_at' => Carbon::now()],
        ];
        DB::table('cuatrienios')->insert($data);

        // foreach(array_chunk($data,100) as $array){
        //     DB::table('cuatrienios')->insert($array);
        // }
        // DB::statement("ALTER TABLE cuatrienios MODIFY id smallint UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT");
        // $data = [];
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cuatrienios');
    }
}
