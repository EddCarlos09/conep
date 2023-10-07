<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SucursalUsuarioCuentaRol;
use App\Models\SucursalUsuarioCuentaRolModuloPermisoRol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SucursalUsuarioCuentaRolModuloPermisoRolController extends Controller
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
     * Get all the specified resource from storage.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getAll(Request $request)
    {
        $query = SucursalUsuarioCuentaRolModuloPermisoRol::query();

        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        if ($request->has('modulo_permiso_rol_id') && !is_null($request["modulo_permiso_rol_id"]))
        {
            $query->where(
                "modulo_permiso_rol_id",
                "=",
                $request->modulo_permiso_rol_id
            );
        }
        if ($request->has('sucursal_usuario_cuenta_rol_id') && !is_null($request["sucursal_usuario_cuenta_rol_id"]))
        {
            $query->where(
                "sucursal_usuario_cuenta_rol_id",
                "=",
                $request->sucursal_usuario_cuenta_rol_id
            );
        }
        $result = $query->get();

        return response(
            $result,
            200
        );
    }

    /**
     * Save all modulo_permiso_id in the storage.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function postRange(Request $request)
    {
        DB::beginTransaction();
        try
        {
            //Damos de alta al usuario en la sucursal
            $usercreated = $request->user;
            $sucursal_usuario_cuenta_rol = new SucursalUsuarioCuentaRol();
            $sucursal_usuario_cuenta_rol->rol_id = $request->idRol;
            $sucursal_usuario_cuenta_rol->sucursal_usuario_cuenta_id = $request->idSucursalCuentaUsuario;
            $sucursal_usuario_cuenta_rol->activo = 1;
            $sucursal_usuario_cuenta_rol->usercreated = $usercreated;
            $sucursal_usuario_cuenta_rol->save();

            //Damos de alta los modulos permisos del usuario
            $sucursal_usuario_cuenta_rol_modulo_permiso_rols = [];

            $pos = strpos($request->idsModuloPermisoRol, ',');
            if($pos === false){
                $idsModuloPermisoRol = [];
                array_push($idsModuloPermisoRol, $request->idsModuloPermisoRol);
            }
            else{
                $idsModuloPermisoRol = explode(",", $request->idsModuloPermisoRol);
            }

            foreach($idsModuloPermisoRol as $idModuloPermisoRol){
                $item_sucursal_usuario_cuenta_rol_modulo_permiso_rols = [
                    "activo" => 1,
                    "usercreated" => $usercreated,
                    "modulo_permiso_rol_id" => str_replace("p_", "", $idModuloPermisoRol),
                    "sucursal_usuario_cuenta_rol_id" => $sucursal_usuario_cuenta_rol->id
                ];
                array_push($sucursal_usuario_cuenta_rol_modulo_permiso_rols, $item_sucursal_usuario_cuenta_rol_modulo_permiso_rols);
            }

            SucursalUsuarioCuentaRolModuloPermisoRol::insert($sucursal_usuario_cuenta_rol_modulo_permiso_rols);

            DB::commit();
            return response()->json(['message' => 'OK'], 201);
        }
        catch (Exception $e)
        {
            DB::rollback();
            return response()->json(['message' => 'Error'], 422);
        }
    }

    /**
     * Save all modulo_permiso_id in the storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function putRange(Request $request, $id)
    {
        DB::beginTransaction();
        try
        {
            // Damos de alta al usuario en la sucursal
            $user = $request->user;

            // Actualizamos el rol
            $rol_id = $request->idRol;
            $idSucursalCuentaUsuarioRol = $request->idSucursalCuentaUsuarioRol;

            $sucursal_usuario_cuenta_rol = SucursalUsuarioCuentaRol::where(
                "rol_id",
                "=",
                $rol_id
            )->where(
                "id",
                "=",
                $idSucursalCuentaUsuarioRol
            )->select([
                "id",
                "rol_id",
                "sucursal_usuario_cuenta_id",
                "activo",
                "usermodifed"
            ])->get()
              ->first();

            $sucursal_usuario_cuenta_rol->usermodifed = $user;
            $sucursal_usuario_cuenta_rol->save();

            // Actualizamos los modulos permisos rol
            $items = SucursalUsuarioCuentaRolModuloPermisoRol::where(
                "sucursal_usuario_cuenta_rol_id",
                "=",
                $idSucursalCuentaUsuarioRol
            )->select([
                "id",
                "modulo_permiso_rol_id",
                "sucursal_usuario_cuenta_rol_id",
                "activo"
            ])->get();

            // Pongo activo = 0 a todos los modulo permiso ids
            foreach($items as $key => $value){
                $items[$key]["activo"] = 0;
                $items[$key]["usermodifed"] = $user;
            }

            // Damos de alta los modulos permisos del usuario
            $insert_sucursal_usuario_cuenta_rol_modulo_permiso_rols = [];
            $pos = strpos(
                $request->idsModuloPermisoRol,
                ','
            );
            if ($pos === false)
            {
                $idsModuloPermisoRol = [];
                array_push($idsModuloPermisoRol, $request->idsModuloPermisoRol);
            }
            else
            {
                $idsModuloPermisoRol = explode(
                    ",",
                    $request->idsModuloPermisoRol
                );
            }

            // Ahora iteramos el array obtenido para ir cambiando el activo de 0 a 1
            foreach($idsModuloPermisoRol as $idModuloPermisoRol){
                $id = str_replace("p_", "", $idModuloPermisoRol);
                $encontrado = false;

                foreach ($items as $key => $value)
                {
                    $item_id = $items[$key]["modulo_permiso_rol_id"];
                    if((string)$item_id === (string)$id){
                        $encontrado = true;
                        $items[$key]["activo"] = 1;
                        $items[$key]["usermodifed"] = $user;
                    }
                }

                if(!$encontrado){
                    $item_sucursal_usuario_cuenta_rol_modulo_permiso_rols = [
                        "activo" => 1,
                        "usercreated" => $user,
                        "modulo_permiso_rol_id" => str_replace("p_", "", $idModuloPermisoRol),
                        "sucursal_usuario_cuenta_rol_id" => $sucursal_usuario_cuenta_rol->id
                    ];
                    array_push($insert_sucursal_usuario_cuenta_rol_modulo_permiso_rols, $item_sucursal_usuario_cuenta_rol_modulo_permiso_rols);
                }
            }

            SucursalUsuarioCuentaRolModuloPermisoRol::insert($insert_sucursal_usuario_cuenta_rol_modulo_permiso_rols);

            foreach($items as $item) {
                SucursalUsuarioCuentaRolModuloPermisoRol::where("id", $item["id"])
                ->update([
                    "modulo_permiso_rol_id"=> $item["modulo_permiso_rol_id"],
                    "sucursal_usuario_cuenta_rol_id"=>$item["sucursal_usuario_cuenta_rol_id"],
                    "usermodifed"=>$item["usermodifed"],
                    "activo"=>$item["activo"],
                ]);
            }

            DB::commit();

            return response()->json(
                ['message' => 'OK'],
                201
            );
        } catch (Exception $e)
        {
            DB::rollback();
            dd($e);

            return response()->json(
                ['message' => 'Error'],
                422
            );
        }
    }
}
