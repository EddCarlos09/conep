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

class ControlPoliticoProposicionsController extends Controller
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
        $proposicion = ControlPoliticoProposicion::select('id', 'nombre','url', 'activo')
        ->where('control_politico_id', $controlPolitico)
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($proposicion, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ControlPoliticoProposicion::$rules, ControlPoliticoProposicion::$rulesMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);
        
        DB::beginTransaction();
        try {
            $proposicion = new ControlPoliticoProposicion;

            $request->request->add(['usercreated' => $request->user]);
            $result = $proposicion->create($request->all());
            if($result != null){
                $id = $result->id;
                $idPadre = $result->control_politico_id;
                if($request->hasFile('archivo')){
                    $archivo = $request->file('archivo');
                    $proposicionUpdate = ControlPoliticoProposicion::find($id);
                    if($proposicionUpdate != null){
                        $carpeta = $id;
                        $path = $archivo->storeAs(
                            '/controlpolitico/'.$idPadre.'/proposiciones/'.$carpeta, // Directorio
                            $archivo->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );
                        $proposicionUpdate->url = $path;
                        $proposicionUpdate->save();
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
        $proposicion = ControlPoliticoProposicion::select('id', 'nombre', 'url', 'activo')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($proposicion, 200);
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
        $validator = Validator::make($request->all(), ControlPoliticoProposicion::$rulesPut, ControlPoliticoProposicion::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try {
            $proposicion = ControlPoliticoProposicion::find($id);
            if($proposicion != null){
                if($request->hasFile('archivo')){
                    $archivo = $request->file('archivo');
                    if(Storage::disk('public')->exists($proposicion->url))
                        Storage::disk('public')->delete($proposicion->url);
                    
                    $carpeta = $id;
                    $carpetaPadre = $proposicion->control_politico_id;
                    $path = $archivo->storeAs(
                        '/controlpolitico/'.$carpetaPadre.'/proposiciones/'.$carpeta, // Directorio
                        $archivo->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $proposicion->nombre = $request->input('nombre');
                    $proposicion->url = $path;
                    $proposicion->usermodifed = $request->user;
                    $proposicion->save();
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
        $proposicion = ControlPoliticoProposicion::find($id);
        $proposicion->activo=!$proposicion->activo;
        $proposicion->save();
        return response($proposicion, 200);
    }

    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $controlPolitico = $request->input('controlpolitico');
        $count = ControlPoliticoProposicion::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('control_politico_id', $controlPolitico)
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        ->count();
        return response($count, 200);
    }
}
