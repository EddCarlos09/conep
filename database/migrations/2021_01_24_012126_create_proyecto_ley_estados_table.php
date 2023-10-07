<?php

    use App\Models\ProyectoLeyEstado;
    use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateProyectoLeyEstadosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('proyecto_ley_estados', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->bigInteger('id')->unsigned()->autoIncrement();
            $table->bigInteger('proyecto_ley_id')->nullable()->unsigned();
            $table->date('fecha')->nullable();
            $table->smallInteger('estado_proyecto_ley_id')->nullable()->unsigned();
            $table->string('gaceta_texto', 50)->nullable();
            $table->string('gaceta_url', 500)->nullable();
            $table->string('nota', 500)->nullable();
            $table->string('observaciones', 500)->nullable();
            $table->integer('orden')->nullable()->unsigned();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });
        Schema::table('proyecto_ley_estados', function (Blueprint $table) {
            $table->foreign('proyecto_ley_id')->references('id')->on('proyecto_leys')->onDelete('cascade');
            $table->foreign('estado_proyecto_ley_id')->references('id')->on('estado_proyecto_leys')->onDelete('cascade');
        });

        // $this->setDataToTable();
    }

    public function setDataToTable()
    : void
    {
        // File upload location
        $location = 'database';
        $file_name = 'tbl_proyecto_ley_estados.csv';
        // Import CSV to Database
        $filepath = public_path($location . "/" . $file_name);
        // Reading file
        $file = fopen(
            $filepath,
            "r"
        );
        $import_data_array = [];
        $i = 0;
        while (($data = fgetcsv($file)) !== FALSE)
        {
            // Skip first row (Remove below comment if you want to skip the first row)
            $data = array_map(
                "utf8_encode",
                $data
            ); //added
            if ($i === 0)
            {
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
        foreach ($import_data_array as $import_data)
        {
            $fecha = $import_data[2] === 'NA'
                ? null
                : DateTime::createFromFormat(
                    'd/m/Y',
                    $import_data[2]
                );
            $fecha = $fecha ? $fecha->format('Y-m-d') : null;

            $created_at = $import_data[11] === 'NA'
                ? null
                : DateTime::createFromFormat(
                    'd/m/Y G:i',
                    $import_data[11]
                );
            $created_at = $created_at ? $created_at->format('Y-m-d G:i') : null;
            $updated_at = $import_data[12] === 'NA'
                ? null
                : DateTime::createFromFormat(
                    'd/m/Y G:i',
                    $import_data[12]
                );
            $updated_at = $updated_at ? $updated_at->format('Y-m-d G:i') : null;
            $insertData = [
                "id"                        => $import_data[0] === 'NA' ? null : $import_data[0],
                "proyecto_ley_id"           => $import_data[1] === 'NA' ? null : $import_data[1],
                "fecha"                     => $fecha,
                "estado_proyecto_ley_id"    => $import_data[3] === 'NA' ? null : $import_data[3],
                "gaceta_texto"              => $import_data[4] === 'NA' ? null : $import_data[4],
                "gaceta_url"                => $import_data[5] === 'NA' ? null : $import_data[5],
                "nota"                      => $import_data[6] === 'NA' ? null : $import_data[6],
                "corporacion_id"            => $import_data[7] === 'NA' ? null : $import_data[7],
                "observaciones"             => $import_data[8] === 'NA' ? null : $import_data[8],
                "orden"                     => $import_data[9] === 'NA' ? null : $import_data[9],
                "activo"                    => $import_data[10] === 'NA' ? null : $import_data[10],
                "created_at"                => $created_at,
                "updated_at"                => $updated_at,
            ];
            ProyectoLeyEstado::insert($insertData);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('proyecto_ley_estados');
    }
}
