<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\RolTipoUsuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Validator;

class RolTipoUsuarioController extends Controller
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
        $validator = Validator::make($request->all(), RolTipoUsuario::$rulesPost,  RolTipoUsuario::$messagesPost);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $item = new RolTipoUsuario();
            $request->request->add(['usercreated' => $request->user]);
            $request->request->add(['activo' => 1]);
            $item->create($request->all());
            DB::commit();
            return response()->json(['message' => 'OK'], 201);
        }
        catch (\Exception $e)
        {
            DB::rollback();
            return response()->json(['message' => 'Error'], 422);
        }
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
        $item = RolTipoUsuario::find($id);
        $item->activo=!$item->activo;
        $item->save();
        return response($item, 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getAllDto(Request $request)
    {
        $query = RolTipoUsuario::query()->join(
            "rols",
            "rols.id",
            "rol_tipo_usuarios.rol_id"
        );

        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'rol_tipo_usuarios.activo',
                $request->activo
            );
        }
        if ($request->has('tipo_usuario_id') && !is_null($request["tipo_usuario_id"]))
        {
            $query->where(
                'rol_tipo_usuarios.tipo_usuario_id',
                $request->tipo_usuario_id
            );
        }
        if ($request->has('rol_id') && !is_null($request["rol_id"]))
        {
            $query->where(
                'rol_tipo_usuarios.rol_id',
                $request->rol_id
            );
        }

        $result = $query->select([
            "rol_tipo_usuarios.id",
            "rol_tipo_usuarios.rol_id",
            "rol_tipo_usuarios.tipo_usuario_id",
            "rol_tipo_usuarios.activo",
            "rols.nombre as rol_nombre"
        ])->get();

        return response($result, 200);
    }
}
