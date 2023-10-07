<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\ControlPolitico;
use App\Models\ControlPoliticoProposicion;
use App\Models\ControlPoliticoCitante;
use App\Models\ControlPoliticoRespuesta;
use App\Models\ControlPoliticoDocumento;
use Validator;
use App\Messages;
use Carbon\Carbon;
use DB;

class ControlPoliticoCitantesController extends Controller
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
        $documentos = ControlPoliticoCitante::select('id', 'congresista_id', 'activo')
        ->with('congresista')
        ->where('control_politico_id', $controlPolitico)
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($documentos, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ControlPoliticoCitante::$rules, ControlPoliticoCitante::$rulesMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $citante = new ControlPoliticoCitante;
            $request->request->add(['usercreated' => $request->user]);
            $result = $citante->create($request->all());

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
        $documento = ControlPoliticoCitante::select('id', 'congresista_id', 'activo')
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
        $validator = Validator::make($request->all(), ControlPoliticoCitante::$rulesPost, ControlPoliticoCitante::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        // DB::beginTransaction();
        // try
        // {
            $citante = ControlPoliticoCitante::find($id);
            if($citante != null){
                $request->request->add(['usermodifed' => $request->user]);
                $citante->fill($request->all());
                $citante->save();
            }
            //     DB::commit();
        //     return response()->json(['message' => 'OK'], 201);
        // }
        // catch (\Exception $e)
        // {
        //     DB::rollback();
        //     return response()->json(['message' => 'Error'], 422);
        // }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $citante = ControlPoliticoCitante::find($id);
        $citante->activo=!$citante->activo;
        $citante->save();
        return response($citante, 200);
    }
}
