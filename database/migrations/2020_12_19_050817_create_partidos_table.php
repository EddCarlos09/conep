<?php

    use App\Models\Partido;
    use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class CreatePartidosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('partidos', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('nombre', 200)->nullable();
            $table->text('resenaHistorica')->nullable();
            $table->text('lineamientos')->nullable();
            $table->string('lugar', 100)->nullable();
            $table->date('fechaDeCreacion')->nullable();
            $table->text('estatutos')->nullable();
            $table->string('color', 20)->nullable();
            $table->boolean('partidoActivo')->default(1)->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
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
        $file_name = 'tbl_partidos.csv';

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
            $fecha_creacion = $import_data[4] === 'NA'
                ? null
                : DateTime::createFromFormat(
                    'd/m/Y',
                    $import_data[4]
                );

            $fecha_creacion = $fecha_creacion
                ? $fecha_creacion->format('Y-m-d')
                : null;

            $created_at = $import_data[11] === 'NA'
                ? null
                : DateTime::createFromFormat(
                    'd/m/Y G:i',
                    $import_data[11]
                );

            $created_at = $created_at
                ? $created_at->format('Y-m-d G:i')
                : null;

            $updated_at = $import_data[12] === 'NA'
                ? null
                : DateTime::createFromFormat(
                    'd/m/Y G:i',
                    $import_data[12]
                );

            $updated_at = $updated_at
                ? $updated_at->format('Y-m-d G:i')
                : null;

            $insertData = [
                "id"=>$import_data[0] === 'NA' ? null : $import_data[0],
                "nombre"=>$import_data[1] === 'NA' ? null : $import_data[1],
                "resenaHistorica"=>null,
                "lineamientos"=>$import_data[2] === 'NA' ? null : $import_data[2],
                "lugar"=>$import_data[3] === 'NA' ? null : $import_data[3],
                "fechaDeCreacion"=>$fecha_creacion,
                "estatutos"=>$import_data[5] === 'NA' ? null : $import_data[5],
                "color"=>$import_data[6] === 'NA' ? null : $import_data[6],
                "partidoActivo"=>$import_data[7] === 'NA' ? null : $import_data[7],
                "activo"=>$import_data[8] === 'NA' ? null : $import_data[8],
                "created_at"=>$created_at,
                "updated_at"=>$updated_at,
            ];

            Partido::insert($insertData);

        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('partidos');
    }
}
