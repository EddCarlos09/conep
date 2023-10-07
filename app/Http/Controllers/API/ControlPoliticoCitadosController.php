<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\ControlPoliticoCitado;
use App\Models\ControlPoliticoCitadoImagen;
use Validator;
use App\Messages;
use Carbon\Carbon;
use DB;

class ControlPoliticoCitadosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $controlPolitico = $request->input('controlpolitico');
        $asistencia = $request->input('asistencia');
        $tipo = $request->input('tipo');
        $citado = ControlPoliticoCitado::select(
        'id',
        'control_politico_id',
        'persona_id',
        'tipo_citacion', 'asistencia', 'activo')
        ->with('persona')
        ->where('control_politico_id', $controlPolitico)
        ->where('tipo_citacion', ($tipo != "0") ? '=' : '!=', $tipo)
        ->where('asistencia', ($asistencia != "0") ? '=' : '!=', $asistencia)
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($citado, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ControlPoliticoCitado::$rulesPost, ControlPoliticoCitado::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);


        DB::beginTransaction();
        try
        {
            $citado = new ControlPoliticoCitado;
            $request->request->add(['usercreated' => $request->user]);
            $result = $citado->create($request->all());
            

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
        $documento = ControlPoliticoCitado::select('id',
        'persona_id',
        'control_politico_id',
        'tipo_citacion', 'asistencia', 'activo')
        ->with('persona')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($documento, 200);
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
        $validator = Validator::make($request->all(), ControlPoliticoCitado::$rulesPut, ControlPoliticoCitado::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $citado = ControlPoliticoCitado::find($id);
            if($citado != null){
                $request->request->add(['usermodifed' => $request->user]);
                $citado->fill($request->all());
                $citado->save();
            }
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $citado = ControlPoliticoCitado::find($id);
        $citado->activo=!$citado->activo;
        $citado->save();
        return response($citado, 200);
    }
}
