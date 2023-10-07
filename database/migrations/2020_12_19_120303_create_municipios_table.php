<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMunicipiosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('municipios', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            // $table->Integer();
            $table->string('nombre', 50)->nullable();
            $table->boolean('activo')->nullable()->default(1);
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        // Salvador

        // $data = [
        //     ['id'=>1,'nombre'=>'Ahuachapán','activo'=>1,],
        //     ['id'=>2,'nombre'=>'Cabañas','activo'=>1,],
        //     ['id'=>4,'nombre'=>'Chalatenango','activo'=>1,],
        //     ['id'=>5,'nombre'=>'Cuscatlán','activo'=>1,],
        //     ['id'=>6,'nombre'=>'La Libertad','activo'=>1,],
        //     ['id'=>7,'nombre'=>'La Paz','activo'=>1,],
        //     ['id'=>8,'nombre'=>'La Unión','activo'=>1,],
        //     ['id'=>9,'nombre'=>'Morazán','activo'=>1,],
        //     ['id'=>10,'nombre'=>'San Miguel','activo'=>1,],
        //     ['id'=>11,'nombre'=>'San Salvador','activo'=>1,],
        //     ['id'=>12,'nombre'=>'San Vicente','activo'=>1,],
        //     ['id'=>13,'nombre'=>'Santa Ana','activo'=>1,],
        //     ['id'=>14,'nombre'=>'Sonsonate','activo'=>1,],
        //     ['id'=>15,'nombre'=>'Usulután','activo'=>1,],
        // ];

        // Honduras

        $data = [
            ['id' => 1 ,'nombre' => 'Atlántida', 'activo' => 1],
            ['id' => 2 ,'nombre' => 'Colón', 'activo' => 1],
            ['id' => 3 ,'nombre' => 'Comayagua', 'activo' => 1],
            ['id' => 4 ,'nombre' => 'Copán', 'activo' => 1],
            ['id' => 5 ,'nombre' => 'Cortés', 'activo' => 1],
            ['id' => 6 ,'nombre' => 'Choluteca', 'activo' => 1],
            ['id' => 7 ,'nombre' => 'El Paraíso', 'activo' => 1],
            ['id' => 8 ,'nombre' => 'Francisco Morazán', 'activo' => 1],
            ['id' => 9 ,'nombre' => 'Gracias a Dios', 'activo' => 1],
            ['id' => 10 ,'nombre' => 'Intibucá', 'activo' => 1],
            ['id' => 11 ,'nombre' => 'Islas de la Bahía', 'activo' => 1],
            ['id' => 12 ,'nombre' => 'La Paz', 'activo' => 1],
            ['id' => 13 ,'nombre' => 'Lempira', 'activo' => 1],
            ['id' => 14 ,'nombre' => 'Ocotepeque', 'activo' => 1],
            ['id' => 15 ,'nombre' => 'Olancho', 'activo' => 1],
            ['id' => 16 ,'nombre' => 'Santa Bárbara', 'activo' => 1],
            ['id' => 17 ,'nombre' => 'Valle', 'activo' => 1],
            ['id' => 18 ,'nombre' => 'Yoro', 'activo' => 1]
        ];

        DB::table('municipios')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('municipios');
    }
}
