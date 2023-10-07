<?php

    use App\Models\Legislatura;
    use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateLegislaturasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('legislaturas', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->smallInteger('id')->unsigned()->autoIncrement();
            $table->string('nombre', 100)->nullable();
            $table->date('fechaInicio')->nullable();
            $table->date('fechaFin')->nullable();
            $table->smallInteger('cuatrienio_id')->nullable()->unsigned();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });
        Schema::table('legislaturas', function (Blueprint $table) {
            $table->foreign('cuatrienio_id')->references('id')->on('cuatrienios')->onDelete('cascade');
        });

        $this->setDataToTable();
    }

    /**
     * Set data to table.
     *
     * @return void
     */
    public function setDataToTable()
    : void
    {
        // File upload location
        $location = 'database';
        $file_name = 'tbl_legislaturas.csv';

        // Import CSV to Database
        $filepath = public_path($location."/".$file_name);

        // Reading file
        $file = fopen($filepath,"r");

        $import_data_array = array();
        $i = 0;

        while (($data = fgetcsv($file)) !== FALSE) {
            // Skip first row (Remove below comment if you want to skip the first row)
            $data = array_map("utf8_encode", $data); //added
            if($i === 0){
                $i++;
                continue;
            }
            foreach ($data as $cell_value)
            {
                $import_data_array[$i][] = $cell_value;
            }
            $i++;
        }
        fclose($file);

        // Insert to MySQL database
        foreach($import_data_array as $import_data){
            $fecha_inicio = $import_data[2] === 'NA'
                ? null
                : DateTime::createFromFormat(
                    'd/m/Y',
                    $import_data[2]
                );

            $fecha_inicio = $fecha_inicio
                ? $fecha_inicio->format('Y-m-d')
                : null;

            $fecha_fin = $import_data[3] === 'NA'
                ? null
                : DateTime::createFromFormat(
                    'd/m/Y',
                    $import_data[3]
                );

            $fecha_fin = $fecha_fin
                ? $fecha_fin->format('Y-m-d')
                : null;

            $created_at = $import_data[8] === 'NA'
                ? null
                : DateTime::createFromFormat(
                    'd/m/Y G:i',
                    $import_data[8]
                );

            $created_at = $created_at
                ? $created_at->format('Y-m-d G:i')
                : null;

            $updated_at = $import_data[9] === 'NA'
                ? null
                : DateTime::createFromFormat(
                    'd/m/Y G:i',
                    $import_data[9]
                );

            $updated_at = $updated_at
                ? $updated_at->format('Y-m-d G:i')
                : null;

            $insertData = [
                "id"=>$import_data[0] === 'NA' ? null : $import_data[0],
                "nombre"=>$import_data[1] === 'NA' ? null : $import_data[1],
                "fechaInicio"=>$fecha_inicio,
                "fechaFin"=>$fecha_fin,
                "cuatrienio_id"=>$import_data[4] === 'NA' ? null : $import_data[4],
                "activo"=>$import_data[5] === 'NA' ? null : $import_data[5],
                "created_at"=>$created_at,
                "updated_at"=>$updated_at,
            ];

            Legislatura::insert($insertData);

        }
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('legislaturas');
    }
}
