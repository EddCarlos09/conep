<?php

namespace App\Http\Controllers\CLIENTAPI;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Votacion;

class VotacionController extends Controller
{    
    public function detalleVotacion($id)
    {
        $Votacion = Votacion::where('id', $id)
        ->with("legislatura", "cuatrienio", "votacionPlenaria", "votacionComision", 
        'votacionCongresista', "proyectoDeLey","VotacionEstado","tipoVotacion","claseVotacion")
        ->get()->first()
        ->toJson(JSON_PRETTY_PRINT);
        return response($Votacion, 200);
    }
}
