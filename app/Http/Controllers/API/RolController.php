<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Rol;
use App\Models\SucursalUsuarioCuentaRol;
use Illuminate\Http\Request;

class RolController extends Controller
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
        $item = Rol::select([
            'id',
            'nombre',
            'activo'
        ])
        ->where('id', $id)
        ->get()
        ->first();

        return response($item, 200);
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
     * Get all type rols by type user from storage.
     *
     * @param  int  $tipo_usuario_id
     * @return \Illuminate\Http\Response
     */
    public function getAllByIdTipoUsuario($tipo_usuario_id)
    {
        $items = Rol::join(
            "rol_tipo_usuarios",
            "rol_tipo_usuarios.rol_id",
            "rols.id"
        )->where(
            "rol_tipo_usuarios.tipo_usuario_id",
            "=",
            $tipo_usuario_id
        )->orderBy(
            "rols.nombre"
        )->select(
            "rols.id",
            "rols.nombre",
            "rols.activo"
        )->get();

        return response($items, 200);
    }


    /**
     * Get all type rols by type user from storage.
     *
     * @param  int  $tipo_usuario_id
     * @param  int  $sucursal_usuario_cuenta_id
     * @return \Illuminate\Http\Response
     */
    public function getAllByIdTipoUsuarioAndIdSucursalCuentaUsuario($tipo_usuario_id, $sucursal_usuario_cuenta_id)
    {
        $result = Rol::join(
            "rol_tipo_usuarios",
            "rol_tipo_usuarios.rol_id",
            "rols.id"
        )->where(
            'rol_tipo_usuarios.tipo_usuario_id',
            '=',
            $tipo_usuario_id
        )->where(
            "rol_tipo_usuarios.activo",
            "=",
            1
        )->orderBy(
            "rols.nombre"
        )->select(
            "rols.id",
            "rols.nombre",
            "rols.activo"
        )->get();

        $result2 = SucursalUsuarioCuentaRol::where(
    'sucursal_usuario_cuenta_id',
            '=',
            $sucursal_usuario_cuenta_id
        )->get();


        foreach($result2 as $item2){
            $item_rol_id = $item2->rol_id;
            $key = $result->search(function($item) use ($item_rol_id){
                return $item->id === $item_rol_id;
            });

            $result->pull($key);
        }

        return response($result->values(), 200);
    }

    /**
     * Get all type rols from storage.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getAll(Request $request){
        $activo = null;
        $query = Rol::query();

        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                '=',
                $request->activo
            );
        }

        $items = $query->select([
            "id",
            "nombre",
            "activo"
        ])->get();

        return response($items, 200);
    }

    /**
     * Get all type rols from storage without assign to the user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getAllSinAsignarATipoDeUsuario($id){
        $result = Rol::join(
            "rol_tipo_usuarios",
            "rol_tipo_usuarios.rol_id",
            "rols.id"
        )->where(
            "rol_tipo_usuarios.tipo_usuario_id",
            "=",
            $id
        )->where(
            "rol_tipo_usuarios.activo",
            "=",
            1
        )->where(
            "rols.activo",
            "=",
            1
        )->select([
            "rols.id",
            "rols.nombre",
            "rols.activo"
       ])->get();

        $result2 = Rol::where(
            "activo",
            "=",
            1
        )->orderBy(
            "nombre"
        )->select([
            "id",
            "nombre",
            "activo"
        ])->get();

        foreach($result as $item){
            $item_id = $item->id;
            $key = $result2->search(function($item2) use ($item_id){
                return $item2->id === $item_id;
            });

            $result2->pull($key);
        }

        return response($result2->values(), 200);
    }


    public function getByIdSucursalCuentaUsuarioRol($sucursal_usuario_cuenta_rol_id){
        $result = Rol::join(
            "sucursal_usuario_cuenta_rols",
            "sucursal_usuario_cuenta_rols.rol_id",
        "rols.id"
        )->where(
            "sucursal_usuario_cuenta_rols.id",
            "=",
            $sucursal_usuario_cuenta_rol_id
        )->select([
            "rols.id",
            "rols.nombre",
            "rols.activo"
        ])->get()
          ->first();

        return response($result, 200);
    }
}
