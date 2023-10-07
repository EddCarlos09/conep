<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Modulo;
use Illuminate\Http\Request;

class ModuloPermisoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        //
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

    /**
     * Get all modulo permiso ids from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function getModulosPermisos(){
        $result = Modulo::join(
          "modulo_permisos",
            "modulo_permisos.modulo_id",
            "modulos.id"
        )->join(
            "permisos",
            "permisos.id",
            "modulo_permisos.permiso_id"
        )->where(
            "modulos.activo",
            "=",
            "1"
        )->where(
            "modulo_permisos.activo",
            "=",
            "1"
        )->select(
            "modulos.id as moduloId",
            "modulos.nombre as moduloNombre",
            "modulo_permisos.id as permisoId",
            "permisos.nombre as permisoNombre",
            "modulo_permisos.id as moduloPermisoRolId",
            "modulo_permisos.descripcion as moduloPermisoDescripcion"
        )->get();

        $permisos = [];
        $modulos = $result->unique(
            "moduloId"
        )->values()->all();

        foreach($modulos as $modulo){
            $item_modulo = [
                "value" => $modulo->moduloId,
                "label" => $modulo->moduloNombre,
                "children" => []
            ];
            array_push($permisos, $item_modulo);
        }
        foreach ($result as $x)
        {
            foreach($permisos as $key => $value)
            {
                if($value["value"] === $x->moduloId){
                    $item = [
                        "label" => $x->moduloPermisoDescripcion,
                        "value" => "p_" . $x->permisoId,
                        "children" => [
                            "label" => $x->moduloPermisoDescripcion,
                            "value" => "mp_" . $x->moduloPermisoRolId
                        ]
                    ];
                    array_push($permisos[$key]["children"], $item);
                }
            }
        }

        return response($permisos, 200);
    }
}
