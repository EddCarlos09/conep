<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class CreateEmpresasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('empresas', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->smallInteger('id')->unsigned()->autoIncrement();
            $table->string('nombre', 100)->nullable();
            $table->string('rfc', 15)->nullable();
            $table->string('email', 50)->nullable();
            $table->string('email_password', 500)->nullable();
            $table->string('email_host', 50)->nullable();
            $table->smallInteger('email_port')->nullable()->unsigned();
            $table->boolean('email_enable_ssl')->nullable()->unsigned();
            $table->boolean('activo')->default(1)->nullable();
            $table->string('usercreated', 250)->nullable();
            $table->string('usermodifed', 250)->nullable();
            $table->timestamps();
        });
        $data = [
            ['nombre' => 'Congreso Visible',
             'rfc'=>'XAXX010101000',
             'email' => 'cidfares.develop@gmail.com',
             'email_password'=> Crypt::encrypt('k394HN!W&pEX2cL$4w1#'),
             'email_host' => 'smtp.gmail.com',
             'email_port' => 587,
             'email_enable_ssl' => true,
             'activo' => true,
             'usercreated' => 'sys@admin.com',
             'created_at' => Carbon::now()
            ]
        ];
        DB::table('empresas')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('empresas');
    }
}
