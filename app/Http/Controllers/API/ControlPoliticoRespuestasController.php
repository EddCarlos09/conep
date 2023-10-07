<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\ControlPolitico;
use App\Models\ControlPoliticoProposicion;
use App\Models\ControlPoliticoCitadoImagen;
use App\Models\ControlPoliticoRespuesta;
use App\Models\ControlPoliticoDocumento;
use Validator;
use App\Messages;
use Carbon\Carbon;
use DB;

class ControlPoliticoRespuestasController extends Controller
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
        $respuesta = ControlPoliticoRespuesta::select('id', 'nombre','url', 'activo')
        ->where('control_politico_id', $controlPolitico)
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($respuesta, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ControlPoliticoRespuesta::$rules, ControlPoliticoRespuesta::$rulesMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);


        DB::beginTransaction();
        try {
            $respuesta = new ControlPoliticoRespuesta;

            $request->request->add(['usercreated' => $request->user]);
            $result = $respuesta->create($request->all());
            if($result != null){
                $id = $result->id;
                if($request->hasFile('archivo')){
                    $archivo = $request->file('archivo');
                    $respuestaUpdate = ControlPoliticoRespuesta::find($id);
                    if($respuestaUpdate != null){
                        $carpeta = $id;
                        $carpetaPadre = $result->control_politico_id;
                        $path = $archivo->storeAs(
                            '/controlpolitico/'.$carpetaPadre.'/respuestas/'.$carpeta, // Directorio
                            $archivo->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );
                        $respuestaUpdate->url = $path;
                        $respuestaUpdate->save();
                    }
                }
            }
        DB::commit();
            return response()->json(['message' => 'OK'], 201);
        } catch (\Exception $e)
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
        $respuesta = ControlPoliticoRespuesta::select('id', 'nombre', 'url', 'activo')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($respuesta, 200);
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
        $validator = Validator::make($request->all(), ControlPoliticoRespuesta::$rulesPut, ControlPoliticoRespuesta::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);


        DB::beginTransaction();
        try {

            $respuesta = ControlPoliticoRespuesta::find($id);
            if($respuesta != null){
                if($request->hasFile('archivo')){
                    $archivo = $request->file('archivo');
                    if(Storage::disk('public')->exists($respuesta->url))
                        Storage::disk('public')->delete($respuesta->url);
                    
                    $carpeta = $id;
                    $carpetaPadre = $respuesta->control_politico_id;
                    $path = $archivo->storeAs(
                        '/controlpolitico/'.$carpetaPadre.'/respuestas/'.$carpeta, // Directorio
                        $archivo->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $respuesta->nombre = $request->input('nombre');
                    $respuesta->url = $path;
                    $respuesta->usermodifed = $request->user;
                    $respuesta->save();
                }
            }
            DB::commit();
            return response()->json(['message' => 'OK'], 201);
        } catch (\Exception $e)
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
        $respuesta = ControlPoliticoRespuesta::find($id);
        $respuesta->activo=!$respuesta->activo;
        $respuesta->save();
        return response($respuesta, 200);
    }

    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $controlPolitico = $request->input('controlpolitico');
        $count = ControlPoliticoRespuesta::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('control_politico_id', $controlPolitico)
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        ->count();
        return response($count, 200);
    }

}
