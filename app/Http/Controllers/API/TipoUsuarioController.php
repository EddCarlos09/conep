<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TipoUsuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Validator;

class TipoUsuarioController extends Controller
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
        $validator = Validator::make($request->all(), TipoUsuario::$rulesPost,  TipoUsuario::$messagesPost);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $item = new TipoUsuario();
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
        $item = TipoUsuario::select([
            'id',
            'nombre',
            'acceso_panel_administrador',
            'acceso_panel_cliente',
            'activo'
            ])->where('id',$id)
            ->get()
            ->first();

        return response($item,200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), TipoUsuario::$rulesPut, TipoUsuario::$messagesPut);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try
        {
            $itemOriginal = TipoUsuario::find($id);
            $request->request->add(['usermodifed' => $request->user]);
            $request->request->add(['activo' => $itemOriginal->activo]);
            $itemOriginal->fill($request->all());
            $itemOriginal->save();
            DB::commit();
            return response()->json(['message' => 'OK'],202 );
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
    public function destroy($id)
    {
        //
    }

    /**
     * Display a listing of the resource.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getAllDto(Request $request)
    {
        $activo = null;
        $tipo_usuario_id = null;
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $activo = $request->activo;
        }

        if ($request->has('tipo_usuario_id') && !is_null($request["tipo_usuario_id"]))
        {
            $tipo_usuario_id = $request->tipo_usuario_id;
        }

        $items_dto = TipoUsuario::leftjoin(
            "rol_tipo_usuarios",
            "rol_tipo_usuarios.tipo_usuario_id",
            "tipo_usuarios.id"
        )->leftjoin(
            "rols",
            "rols.id",
            "rol_tipo_usuarios.rol_id"
        )->where(
            "tipo_usuarios.id",
            "LIKE",
            '%' . $tipo_usuario_id . '%'
        )->where(
        "tipo_usuarios.activo",
        "LIKE",
        '%' . $activo . '%'
        )->orderBy(
            "rols.nombre"
        )->select(
            "tipo_usuarios.id",
            "tipo_usuarios.nombre",
            "tipo_usuarios.acceso_panel_administrador",
            "tipo_usuarios.acceso_panel_cliente",
            "tipo_usuarios.activo",
            "tipo_usuarios.activo",
            DB::raw("GROUP_CONCAT(rols.nombre SEPARATOR ', ') as roles")
        )->groupBy(
            "tipo_usuarios.id",
            "tipo_usuarios.nombre",
            "tipo_usuarios.activo",
            "tipo_usuarios.activo"
        )->get();

        return response($items_dto, 200);
    }

}
