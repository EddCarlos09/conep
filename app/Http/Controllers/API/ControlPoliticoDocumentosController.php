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

class ControlPoliticoDocumentosController extends Controller
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
        $documentos = ControlPoliticoDocumento::select('id', 'nombre','url', 'activo')
        ->where('control_politico_id', $controlPolitico)
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
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
        $validator = Validator::make($request->all(), ControlPoliticoDocumento::$rules, ControlPoliticoDocumento::$rulesMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try {
            $documento = new ControlPoliticoDocumento;

            $request->request->add(['usercreated' => $request->user]);
            $result = $documento->create($request->all());
            if($result != null){
                $id = $result->id;

                if($request->hasFile('archivo')){
                    $archivo = $request->file('archivo');
                    $documentoUpdate = ControlPoliticoDocumento::find($id);
                    if($documentoUpdate != null){
                        $carpeta = $id;
                        $carpetaPadre = $documentoUpdate->control_politico_id;
                        $path = $archivo->storeAs(
                            '/controlpolitico/'.$carpetaPadre.'/documentos/'.$carpeta, // Directorio
                            $archivo->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );
                        $documentoUpdate->url = $path;
                        $documentoUpdate->save();
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
        $documento = ControlPoliticoDocumento::select('id', 'nombre', 'url', 'activo')
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
        $validator = Validator::make($request->all(), ControlPoliticoDocumento::$rulesPut, ControlPoliticoDocumento::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try {
            $documento = ControlPoliticoDocumento::find($id);
            if($documento != null){
                if($request->hasFile('archivo')){
                    $archivo = $request->file('archivo');
                    if(Storage::disk('public')->exists($documento->url))
                        Storage::disk('public')->delete($documento->url);
                    
                    $carpeta = $id;
                    $carpetaPadre = $documento->control_politico_id;
                    $path = $archivo->storeAs(
                        '/controlpolitico/'.$carpetaPadre.'/documentos/'.$carpeta, // Directorio
                        $archivo->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $documento->nombre = $request->input('nombre');
                    $documento->url = $path;
                    $documento->usermodifed = $request->user;
                    $documento->save();
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
        $documento = ControlPoliticoDocumento::find($id);
        $documento->activo=!$documento->activo;
        $documento->save();
        return response($documento, 200);
    }

    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $controlPolitico = $request->input('controlpolitico');
        $count = ControlPoliticoDocumento::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('control_politico_id', $controlPolitico)
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        ->count();
        return response($count, 200);
    }
}
