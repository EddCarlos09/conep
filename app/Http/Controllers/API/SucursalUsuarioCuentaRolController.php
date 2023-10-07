<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SucursalUsuarioCuenta;
use App\Models\SucursalUsuarioCuentaRol;
use App\Models\SucursalUsuarioCuentaRolModuloPermisoRol;
use App\Models\UsuarioCuenta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SucursalUsuarioCuentaRolController extends Controller
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

        DB::beginTransaction();
        try
        {
            // Desactivo el rol
            $rol = SucursalUsuarioCuentaRol::find($id);
            $rol->activo = !$rol->activo;
            $rol->save();

            // Desactivo los módulos permiso rol que esten activos
            if(!$rol->activo){
                SucursalUsuarioCuentaRolModuloPermisoRol::where(
                    "sucursal_usuario_cuenta_rol_id",
                    "=",
                    $rol->id
                )->where(
                    "activo",
                    "=",
                    1
                )->update([
                    "activo" => 0
                ]);

            }
            // Activo los módulos permisos rol, los últimos que fueron modificados por la desactivación
            else{
                $sucursalCuentaUsuarioRolModuloPermisoRols = SucursalUsuarioCuentaRolModuloPermisoRol::where(
                    "sucursal_usuario_cuenta_rol_id",
                    "=",
                    $rol->id
                )->get();

                $fechaHoraEliminacion = $sucursalCuentaUsuarioRolModuloPermisoRols->sortByDesc(
                    "updated_at"
                )->first()->updated_at;

                if(is_null($fechaHoraEliminacion)){
                    $sucursalCuentaUsuarioRolModuloPermisoRols = $sucursalCuentaUsuarioRolModuloPermisoRols->whereNull(
                        "updated_at"
                    );
                }
                else{

                    $sucursalCuentaUsuarioRolModuloPermisoRols = $sucursalCuentaUsuarioRolModuloPermisoRols->where(
                        "updated_at",
                        "=",
                        $fechaHoraEliminacion
                    );
                }

                foreach($sucursalCuentaUsuarioRolModuloPermisoRols as $key => $value){
                    $sucursalCuentaUsuarioRolModuloPermisoRols[$key]["activo"] = 1;
                }

                $sucursalCuentaUsuarioRolModuloPermisoRols = $sucursalCuentaUsuarioRolModuloPermisoRols->where(
                    "activo",
                    "=",
                    1);

                foreach($sucursalCuentaUsuarioRolModuloPermisoRols as $item) {
                    SucursalUsuarioCuentaRolModuloPermisoRol::where("id", $item["id"])
                                                            ->update(
                                                                [
                                                                    "modulo_permiso_rol_id"=> $item["modulo_permiso_rol_id"],
                                                                    "sucursal_usuario_cuenta_rol_id"=>$item["sucursal_usuario_cuenta_rol_id"],
                                                                    "usermodifed"=>$item["usermodifed"],
                                                                    "activo"=>$item["activo"],
                                                                ]
                                                            );
                }
            }

            DB::commit();
            return response($rol, 200);
        }
        catch (\Exception $e)
        {
            DB::rollback();
            return response()->json(['message' => 'Error'], 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroyAll($id)
    {
        $items = SucursalUsuarioCuenta::where(
            'usuario_cuenta_id',
            '=',
            $id)->get();
        foreach ($items as $item) {
            $item['activo'] = !$item['activo'];
            $item->save();
        }

        return response($items, 200);
    }

    /**
     * Display all resource.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function showAll(Request $request)
    {
        $activo = null;
        $sucursal_id = null;
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $activo = $request->activo;
        }
        if ($request->has('sucursal_id') && !is_null($request["sucursal_id"]))
        {
            $sucursal_id = $request->sucursal_id;
        }

        // El request solo va a ser: activo y la sucursal

        $items = UsuarioCuenta::join(
            "sucursal_usuario_cuentas",
            "usuario_cuentas.id",
            "sucursal_usuario_cuentas.usuario_cuenta_id"
        )->leftjoin(
            "sucursal_usuario_cuenta_rols",
            "sucursal_usuario_cuentas.id",
            "sucursal_usuario_cuenta_rols.sucursal_usuario_cuenta_id"
        )->join(
            "tipo_usuarios",
            "tipo_usuarios.id",
            "usuario_cuentas.tipo_usuario_id"
        )->leftjoin(
            "rols",
            "rols.id",
            "sucursal_usuario_cuenta_rols.rol_id"
        )->where(
            'sucursal_usuario_cuentas.activo' , 'LIKE', '%' . $activo . '%'
        )->where(
            'sucursal_usuario_cuentas.sucursal_id' , 'LIKE', '%' . $sucursal_id . '%'
        )->select(
            "sucursal_usuario_cuentas.activo",
            "sucursal_usuario_cuentas.id as sucursal_usuario_cuenta_id",
            "sucursal_usuario_cuentas.sucursal_id",
            "usuario_cuentas.id as usuario_cuenta_id",
            "usuario_cuentas.nombre_completo",
            "usuario_cuentas.email",
            "tipo_usuarios.nombre as tipo_usuario",
            DB::raw("GROUP_CONCAT(rols.nombre SEPARATOR ', ') as roles")
        )->groupBy(
            "sucursal_usuario_cuentas.activo",
            "sucursal_usuario_cuentas.id",
            "sucursal_usuario_cuentas.sucursal_id",
            "usuario_cuentas.id",
            "usuario_cuentas.nombre_completo",
            "usuario_cuentas.email",
            "tipo_usuarios.nombre"
        )->get();

        return response($items, 200);
    }

    function getAllRoles(Request $request){
        $activo = "";
        $rol_id = "";
        $sucursal_usuario_cuenta_id = "";

        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $activo = $request->activo;
        }
        if ($request->has('rol_id') && !is_null($request["rol_id"]))
        {
            $rol_id = $request->rol_id;
        }
        if ($request->has('sucursal_usuario_cuenta_id') && !is_null($request["sucursal_usuario_cuenta_id"]))
        {
            $sucursal_usuario_cuenta_id = $request->sucursal_usuario_cuenta_id;
        }

        $items = SucursalUsuarioCuentaRol::join(
            "rols",
            "rols.id",
            "sucursal_usuario_cuenta_rols.rol_id"
        )->where(
            "sucursal_usuario_cuenta_rols.sucursal_usuario_cuenta_id",
            'LIKE', '%' . $sucursal_usuario_cuenta_id . '%'
        )->where(
            "sucursal_usuario_cuenta_rols.activo",
            'LIKE', '%' . $activo . '%'
        )->where(
            "sucursal_usuario_cuenta_rols.rol_id",
            'LIKE', '%' . $rol_id . '%'
        )->orderBy(
            'rols.nombre'
        )->select(
            "sucursal_usuario_cuenta_rols.id",
            "sucursal_usuario_cuenta_rols.sucursal_usuario_cuenta_id",
            "sucursal_usuario_cuenta_rols.rol_id",
            "rols.nombre as rol_nombre",
            "sucursal_usuario_cuenta_rols.activo",
        )->get();

        return response($items, 200);
    }
}
