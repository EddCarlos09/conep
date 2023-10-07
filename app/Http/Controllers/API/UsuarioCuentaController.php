<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\UsuarioCuenta;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UsuarioCuentaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = UsuarioCuenta::query();

        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn('id' , json_decode($request->id));
        }

        if ($request->has('tipo_usuario_id'))
        {
            $query->whereIn('tipo_usuario_id' , json_decode($request->tipo_usuario_id));
        }

        if ($request->has('email') && !is_null($request["email"]))
        {
            $query->where('email' , 'LIKE', '%' . $request->email . '%');
        }

        if ($request->has('nombre_completo') && !is_null($request["nombre_completo"]))
        {
            $query->where('nombre_completo' , 'LIKE', '%' . $request->nombre_completo . '%');
        }

        if ($request->has('intentos') && !is_null($request["intentos"]))
        {
            $query->where('intentos' , '=', $request->intentos);
        }

        if ($request->has('fecha_suspension') && !is_null($request["fecha_suspension"]))
        {
            $query->where(DB::raw("(DATE_FORMAT(fecha_suspension,'%d/%m/%Y'))"), 'LIKE', '%' . $request->fecha_suspension . '%');
        }

        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where('activo' , $request->activo);
        }
        $query->with(['TipoUsuario']);
        $result = $query->get();

        return response($result, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), UsuarioCuenta::$rulesPost,UsuarioCuenta::$messagesPost);

        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $item = new UsuarioCuenta();
            $request->request->add(['activo' => 1]);
            $request->request->add(['usercreated' => $request->user]);
            $request->request->add(['password' => Hash::make(($request->password))]);
            $item->create($request->all());
            DB::commit();
            return response()->json(['message' => 'OK'],202);
        }
        catch (Exception $e)
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
        $item = UsuarioCuenta::with(['TipoUsuario'])
                ->where('id', $id)
                ->get([
                    'id',
                    'tipo_usuario_id',
                    'nombre_completo',
                    'activo',
                    'email'
                ])
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
        $validator = Validator::make($request->all(), UsuarioCuenta::rulesPut($id),  UsuarioCuenta::$messagesPut);

        if(!is_null($request->password ) && !is_null($request->password_confirmation )){
            $validator->addRules([
                 'password' => 'required|confirmed',
                 'password_confirmation' => 'required'
             ]);

            $validator->setCustomMessages([
                'password.required' =>'El password es requerido.',
                'password.confirmed' =>'Los password deben coincidir.',
                'password_confirmation.required' =>'La confirmación de password es requerido.',
            ]);
        }

        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try
        {
            $itemOriginal = UsuarioCuenta::find($id);
            $password = $itemOriginal->password;
            $request->request->add(['usermodifed' => $request->user]);
            $itemOriginal->fill($request->all());
            if(!is_null($request->password) && !is_null($request->password_confirmation)){
                $itemOriginal->password = Hash::make($request->password);
            }
            else{
                $itemOriginal->password = $password;
            }

            $itemOriginal->save();
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $item = UsuarioCuenta::find($id);
        $item->activo = !$item->activo;
        $item->save();
        return response($item,200);
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function showAll()
    {
        $items = UsuarioCuenta::with(['TipoUsuario'])
                             ->get([
                                       'id',
                                       'tipo_usuario_id',
                                       'nombre_completo',
                                       'activo',
                                       'email'
                                   ]);

        return response($items, 200);
    }

    /**
     * Desbloquea al usuario indicado.
     *
     * @return \Illuminate\Http\Response
     */
    public function desbloquear($id)
    {
        $item = UsuarioCuenta::where('id', '=', $id)
        ->update(['intentos' => 0, 'fecha_suspension' => null]);

        return response($item, 200);
    }

    public function getDto(Request $request)
    {
        $sucursal_usuario_cuenta_id = null;
        if ($request->has('sucursal_usuario_cuenta_id') && !is_null($request["sucursal_usuario_cuenta_id"]))
        {
            $sucursal_usuario_cuenta_id = $request->sucursal_usuario_cuenta_id;
        }
        $items = UsuarioCuenta::join(
            "tipo_usuarios",
            "tipo_usuarios.id",
            "usuario_cuentas.tipo_usuario_id"
        )->join(
            "sucursal_usuario_cuentas",
            "sucursal_usuario_cuentas.usuario_cuenta_id",
            "usuario_cuentas.id"
        )->where(
            "sucursal_usuario_cuentas.usuario_cuenta_id",
            "=",
            $sucursal_usuario_cuenta_id
        )->orderBy(
            "usuario_cuentas.nombre_completo"
        )->select(
            "usuario_cuentas.id",
            "usuario_cuentas.tipo_usuario_id",
            "usuario_cuentas.nombre_completo",
            "usuario_cuentas.email",
            "tipo_usuarios.nombre as tipo_usuario"
        )->get()->first();

        return response($items, 200);
    }
}
