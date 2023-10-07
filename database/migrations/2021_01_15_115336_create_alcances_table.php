<?php

    use App\Models\Alcance;
    use Carbon\Carbon;
    use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAlcancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('alcances', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->smallInteger('id')->unsigned()->autoIncrement();
            $table->string('nombre')->nullable();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });

        $data = [
            ['id' => 1, 'nombre' => 'Nacional', 'activo' => 1, 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
            ['id' => 2, 'nombre' => 'Regional', 'activo' => 1, 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
            ['id' => 3, 'nombre' => 'Local', 'activo' => 1, 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
            ['id' => 4, 'nombre' => 'Tratado', 'activo' => 1, 'usercreated' => 'sys@admin.com', 'created_at' => Carbon::now()],
        ];

        Alcance::insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('alcances');
    }
}
