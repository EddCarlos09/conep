<?php

namespace App\Http\Controllers\CLIENTAPI;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Eleccion;

class EleccionesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response('Elecciones');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $eleccion = Eleccion::select('id', 'titulo', 'infoGeneral', 'corporacion_id', 'tipo_comision_id', 
        'comision_miembro_id', 'comision_id', 'cuatrienio_id', 'fechaDeEleccion', 'resultadoVotacion',
        'comision_cargo_congresista_id', 'activo')
        ->with('corporacion', 'tipoComision', 'comision', 'cuatrienio', 'funcionarioActual', 'candidato')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($eleccion, 200);
    }

}
