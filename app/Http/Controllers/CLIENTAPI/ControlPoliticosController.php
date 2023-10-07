<?php

namespace App\Http\Controllers\CLIENTAPI;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ControlPolitico;
use App\Models\ControlPoliticoCitante;
use App\Models\ControlPoliticoCitado;

class ControlPoliticosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response("",200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $controlPolitico = ControlPolitico::select(
            'id','titulo', 'fecha', 'comision_id', 'legislatura_id', 'cuatrienio_id', 'estado_control_politico_id', 'tema_id_principal', 'tema_id_secundario', 'numero_proposicion', 'detalles', 'tags', 'activo')
        ->where('id',$id)
        ->with('legislatura', 'cuatrienio', 'corporacion', 'estadoControlPolitico', 'temaPrincipalControlPolitico', 'temaSecundarioControlPolitico',
        'comision', 'controlPoliticoProposiciones', 'controlPoliticoCitantes', 'controlPoliticoTags',
        'controlPoliticoCitados', 'controlPoliticoRespuestas', 'controlPoliticoDocumentos')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($controlPolitico, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function getCitantesFilter(Request $request){
        $nombre = $request->input('nombre');
        $controlPolitico = $request->input('controlPolitico');
        $items = ControlPoliticoCitante::select('control_politico_citantes.congresista_id')
        ->join('congresistas', 'control_politico_citantes.congresista_id', 'congresistas.id')
        ->join('personas', 'congresistas.persona_id', 'personas.id')
        ->where('congresistas.activo','1')
        ->where('control_politico_citantes.control_politico_id',$controlPolitico)
        ->where(function ($query) use ($nombre) {
            $query->where('personas.nombres', 'LIKE', '%' . $nombre . '%' )
                  ->orWhere('personas.apellidos', 'LIKE', '%' . $nombre . '%' );
        })
        ->where('control_politico_citantes.activo',1)
        ->with('congresista')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items, 200);
    }

    public function getCitadosFilter(Request $request){
        $nombre = $request->input('nombre');
        $controlPolitico = $request->input('controlPolitico');
        $items = ControlPoliticoCitado::select('control_politico_citados.persona_id')
        ->join('personas', 'control_politico_citados.persona_id', 'personas.id')
        ->where('control_politico_id',$controlPolitico)
        ->where('control_politico_citados.activo',1)
        ->where(function ($query) use ($nombre) {
            $query->where('personas.nombres', 'LIKE', '%' . $nombre . '%' )
                  ->orWhere('personas.apellidos', 'LIKE', '%' . $nombre . '%' );
        })
        ->with('persona')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items, 200);
    }
}
