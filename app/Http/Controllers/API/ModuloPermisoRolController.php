<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Modulo;
use App\Models\ModuloPermisoRol;
use App\Models\Rol;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ModuloPermisoRolController extends Controller
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
            $itemRol = Rol::find($id);
            $itemRol->activo = !$itemRol->activo;
            $itemRol->save();

            // Checamos los modulos permisos que tiene el rol.
            // Estamos desactivando el rol y sus modulos permimisos rol
            if(!$itemRol->activo){
                ModuloPermisoRol::where(
                    "rol_id",
                    "=",
                    $itemRol->id
                )->update(['activo' => 0]);
            }
            // Estamos activando el rol y sus modulos permisos rol
            else{
                $lastUpdate = ModuloPermisoRol::where(
                    "rol_id",
                    "=",
                    $itemRol->id
                )->orderBy(
                    'updated_at',
                    'desc'
                )->select(
                    'updated_at'
                )->get()->first();

                ModuloPermisoRol::where(
                    "rol_id",
                    "=",
                    $itemRol->id
                )->where(
                    'updated_at',
                    '=',
                    $lastUpdate->updated_at
                )->update([
                    'activo' => 1
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'OK'], 201);
        }
        catch (Exception $e)
        {
            DB::rollback();
            return response()->json(['message' => 'Error'], 422);
        }
    }

    public function getAll(Request $request){
        $activo = null;
        $modulo_permiso_id = null;
        $rol_id = null;
        $query = ModuloPermisoRol::query();

        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                '=',
                $request->activo
            );
        }
        if ($request->has('modulo_permiso_id') && !is_null($request["modulo_permiso_id"]))
        {
            $query->where(
                'modulo_permiso_id',
                '=',
                $request->modulo_permiso_id
            );
        }
        if ($request->has('rol_id') && !is_null($request["rol_id"]))
        {
            $query->where(
                'rol_id',
                '=',
                $request->rol_id
            );
        }

        $items = $query->select([
           "id",
           "modulo_permiso_id",
           "rol_id",
           "activo"
        ])->get();

        return response($items, 200);
    }

    public function getAllDto(Request $request){
        $activo = null;
        $modulo_permiso_id = null;
        $rol_id = null;
        $query = ModuloPermisoRol::query()->join(
            "rols",
            "rols.id",
            "modulo_permiso_rols.rol_id"
        );

        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'modulo_permiso_rols.activo',
                '=',
                $request->activo
            );
        }
        if ($request->has('modulo_permiso_id') && !is_null($request["modulo_permiso_id"]))
        {
            $query->where(
                'modulo_permiso_rols.modulo_permiso_id',
                '=',
                $request->modulo_permiso_id
            );
        }
        if ($request->has('rol_id') && !is_null($request["rol_id"]))
        {
            $query->where(
                'modulo_permiso_rols.rol_id',
                '=',
                $request->rol_id
            );
        }

        $items = $query->select([
            "modulo_permiso_rols.id",
            "modulo_permiso_rols.modulo_permiso_id",
            "modulo_permiso_rols.rol_id",
            "rols.nombre as rol_nombre",
            "modulo_permiso_rols.activo"
        ])->get();

        return response($items, 200);
    }

    public function postRange(Request $request){

        DB::beginTransaction();
        try
        {
            $usercreated = $request->user;
            $rol = new Rol();
            $rol->activo = 1;
            $rol->usercreated = $usercreated;
            $rol->nombre = $request->nombre;
            $rol->save();

            $modulo_permiso_rols = [];

            $pos = strpos($request->idsModuloPermiso, ',');
            if($pos === false){
                $idsModuloPermiso = [];
                array_push($idsModuloPermiso, $request->idsModuloPermiso);
            }
            else{
                $idsModuloPermiso = explode(",", $request->idsModuloPermiso);
            }

            foreach($idsModuloPermiso as $idModuloPermiso){
                $item_modulo_permiso_rol = [
                    "modulo_permiso_id" => str_replace("p_", "", $idModuloPermiso),
                    "rol_id" => $rol->id,
                    "activo" => 1,
                    "usercreated" => $usercreated
                ];
                array_push($modulo_permiso_rols, $item_modulo_permiso_rol);
            }

            ModuloPermisoRol::insert($modulo_permiso_rols);

            DB::commit();
            return response()->json(['message' => 'OK'], 201);
        }
        catch (Exception $e)
        {
            DB::rollback();
            return response()->json(['message' => 'Error'], 422);
        }
    }

    public function putRange($id, Request $request){

        DB::beginTransaction();
        try
        {
            // Actualizamos el nombre del rol
            $usermodifed = $request->user;
            $rol = Rol::find($id);
            $request->request->add(['usermodifed' => $usermodifed]);
            $rol->fill($request->all());
            $rol->save();

            // Ahora actualizamos el modulo permiso rol
            // Queda pendiente ya que migro las tablas
            // Primero obtengo los modulo permiso rol ids en relación al rol_id
            $items = ModuloPermisoRol::where(
                "rol_id",
                "=",
                $rol->id
            )->select([
                "id",
                "modulo_permiso_id",
                "rol_id",
                "activo",
                "usermodifed"
            ])->get()->toArray();

            // Pongo activo = 0 a todos los modulo permiso ids
            foreach($items as $key => $value){
                $items[$key]["activo"] = 0;
            }

            $insert_modulo_permiso_rols = [];

            // Obtenemos el listado de idsModuloPermiso del front que esta en string
            // Y lo pasamos a un array
            $pos = strpos($request->idsModuloPermiso, ',');
            if($pos === false){
                $idsModuloPermiso = [];
                array_push($idsModuloPermiso, $request->idsModuloPermiso);
            }
            else{
                $idsModuloPermiso = explode(",", $request->idsModuloPermiso);
            }

            // Ahora iteramos el array obtenido para ir cambiando el activo de 0 a 1
            foreach($idsModuloPermiso as $idModuloPermiso){
                $id = str_replace("p_", "", $idModuloPermiso);
                $encontrado = false;

                foreach ($items as $key => $value)
                {
                    $item_id = $items[$key]["id"];

                    if((string)$item_id === (string)$id){

                        $encontrado = true;
                        $items[$key]["activo"] = 1;
                        $items[$key]["usermodifed"] = $usermodifed;
                    }
                }

                if(!$encontrado){
                    $item_modulo_permiso_rol = [
                        "activo" => 1,
                        "usercreated" => $usermodifed,
                        "modulo_permiso_id" => $id,
                        "rol_id" => $rol->id,
                ];
                    array_push($insert_modulo_permiso_rols, $item_modulo_permiso_rol);
                }
            }

            ModuloPermisoRol::insert($insert_modulo_permiso_rols);

            foreach($items as $item) {
                ModuloPermisoRol::where("id", $item["id"])
                                ->update([
                                    "modulo_permiso_id"=> $item["modulo_permiso_id"],
                                    "rol_id"=>$item["rol_id"],
                                    "activo"=>$item["activo"],
                                ]);
            }


            DB::commit();
            return response()->json(['message' => 'OK'], 201);
        }
        catch (Exception $e)
        {
            DB::rollback();
            return response()->json(['message' => 'Error'], 422);
        }
    }

    public function getModulosPermisosRolByIdRol($rol_id){
        $result = Modulo::join(
            "modulo_permisos",
            "modulo_permisos.modulo_id",
            "modulos.id"
        )->join(
            "permisos",
            "permisos.id",
            "modulo_permisos.permiso_id"
        )->join(
            "modulo_permiso_rols",
            "modulo_permiso_rols.modulo_permiso_id",
            "modulo_permisos.id"
        )->where(
            "modulos.activo",
            "=",
            1
        )->where(
            "modulo_permisos.activo",
            "=",
            1
        )->where(
            "modulo_permiso_rols.activo",
            "=",
            1
        )->where(
            "modulo_permiso_rols.rol_id",
            "=",
            $rol_id
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
