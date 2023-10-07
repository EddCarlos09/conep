<?php

namespace App\Http\Controllers\CLIENTAPI;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BalanceCuatrienio;
use App\Models\BalanceCuatrienioInforme;

class BalanceCuatrienioController extends Controller
{
    public function detalleBalanceCuatrienio($id)
    {
        $BalanceCuatrienio = BalanceCuatrienio::where('id', $id)
        ->with("imagen", "informes")
        ->get()->first()
        ->toJson(JSON_PRETTY_PRINT);
        return response($BalanceCuatrienio, 200);
    }
    public function getInformeById($id)
    {
        $BalanceCuatrienioInforme = BalanceCuatrienioInforme::where('id', $id)
        ->with("imagen", "equipo")
        ->get()->first()
        ->toJson(JSON_PRETTY_PRINT);
        return response($BalanceCuatrienioInforme, 200);
    }
    public function getInformes(Request $request, $id){
        $filter = $request->input('idFilter');
        $equipo = $request->input('equipo');
        $publicacion = $request->input('publicacion');
        $concepto = $request->input('concepto');
        $items = BalanceCuatrienioInforme::with("equipo", "tipoPublicacion", "conceptos", "imagen")
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('tipo_publicacion_id', ($publicacion != "-1") ? '=' : '!=', $publicacion)
        ->where('equipo_id', ($equipo != "-1") ? '=' : '!=', $equipo)
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->where('balance_cuatrienio_id', $id)
        ->whereHas('conceptos', function($q) use ($concepto){
            $q->where('glosario_legislativo_id', ($concepto != "-1") ? '=' : '!=', $concepto);
        })
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items, 200);
    }
    public function totalrecordsInformes(Request $request, $id){
        $filter = $request->input('idFilter');
        $equipo = $request->input('equipo');
        $publicacion = $request->input('publicacion');
        $concepto = $request->input('concepto');
        $count = BalanceCuatrienioInforme::with("conceptos")->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
            ->where('equipo_id', ($equipo != "-1") ? '=' : '!=', $equipo)
            ->where('tipo_publicacion_id', ($publicacion != "-1") ? '=' : '!=', $publicacion)
            ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
            ->where('balance_cuatrienio_id', $id)
            ->whereHas('conceptos', function($q) use ($concepto){
                $q->where('glosario_legislativo_id', ($concepto != "-1") ? '=' : '!=', $concepto);
            })
            ->count();

        return response($count, 200);
    }
}
