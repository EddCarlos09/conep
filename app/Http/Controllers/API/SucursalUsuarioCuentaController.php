<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SucursalUsuarioCuenta;
use App\Models\UsuarioCuenta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SucursalUsuarioCuentaController extends Controller
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
        $validator = Validator::make(
            $request->all(),
            SucursalUsuarioCuenta::$rulesPost,
            SucursalUsuarioCuenta::$rulesPostMessages
        );

        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try
        {
            $item = new SucursalUsuarioCuenta();
            $request->request->add(['usercreated' => $request->user]);
            $request->request->add(['activo' => 1]);
            $item->create($request->all());
            DB::commit();
            return response()->json(['message' => 'OK'],202);
        }
        catch (\Exception $e)
        {
            DB::rollback();
            return response()->json(['message' => 'Error'],422);
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
        $item = SucursalUsuarioCuenta::find($id);
        $item->activo = !$item->activo;
        $item->save();
        return response($item, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroyAll($id)
    {
        $items = SucursalUsuarioCuenta::where('sucursal_id', '=',$id)->get();
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
        $tipo_sucursal_id = null;
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $activo = $request->activo;
        }
        if ($request->has('tipo_sucursal_id') && !is_null($request["tipo_sucursal_id"]))
        {
            $tipo_sucursal_id = $request->tipo_sucursal_id;
        }
        // El request solo va a ser: Activo y tipo de sucursal
        $items = SucursalUsuarioCuenta::join(
            "sucursals",
            "sucursals.id",
            "sucursal_usuario_cuentas.sucursal_id"
        )->join(
            "tipo_sucursals",
            "tipo_sucursals.id",
            "sucursals.tipo_sucursal_id"
        )->where(
        'sucursal_usuario_cuentas.activo' ,
        'LIKE',
        '%' . $activo . '%'
        )->where(
        'sucursals.tipo_sucursal_id' ,
        'LIKE',
        '%' . $tipo_sucursal_id . '%'
        )->select(
            "sucursals.id as sucursal_id",
            "sucursals.nombre as nombre_sucursal",
            "tipo_sucursals.nombre as tipo_sucursal",
            "sucursal_usuario_cuentas.activo",
            DB::raw("count(*) as cantidad_cuentas")
        )
        ->groupBy('sucursals.id')
        ->get();

        return response($items, 200);
    }

    public function showFilter(Request $request){
        $query = SucursalUsuarioCuenta::query();

        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('sucursal_id') && !is_null($request["sucursal_id"]))
        {
            $query->where(
                'sucursal_id',
                "=",
                $request->sucursal_id
            );
        }

        if ($request->has('usuario_cuenta_id') && !is_null($request["usuario_cuenta_id"]))
        {
            $query->where(
                'usuario_cuenta_id',
                "=",
                $request->usuario_cuenta_id
            );
        }

        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                "=",
                $request->activo
            );
        }

        $result = $query->with(['UsuarioCuenta' => function($query){
            $query->select(
                ["id", "tipo_usuario_id", "nombre_completo", "email"]
            )->with(['TipoUsuario' => function($query){
                $query->select(['id', 'nombre']);
            }]);
        }])->get();

        return response(
            $result,
            200
        );
    }

    public function getUsuariosFaltantesEnSucursal(Request $request){
        $sucursal_id = 0;
        if ($request->has('sucursal_id') && !is_null($request["sucursal_id"]))
        {
            $sucursal_id = $request->sucursal_id;
        }

        $items = UsuarioCuenta::join(
            "tipo_usuarios",
            "tipo_usuarios.id",
            "usuario_cuentas.tipo_usuario_id"
        )->whereNotIn(
            "usuario_cuentas.id",
            SucursalUsuarioCuenta::where(
            "sucursal_id",
            "=",
                    $sucursal_id
            )->select(
                "usuario_cuenta_id"
            )->get()
        )->select(
            "usuario_cuentas.id as usuario_cuenta_id",
            "usuario_cuentas.nombre_completo",
            "usuario_cuentas.email",
            "tipo_usuarios.nombre as tipo_usuario"
        )->get();

        return response(
            $items,
            200
        );
    }
}
