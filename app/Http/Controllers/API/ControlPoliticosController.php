<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\ControlPolitico;
use App\Models\ControlPoliticoTag;
use Validator;
use App\Messages;
use Carbon\Carbon;
use DB;

class ControlPoliticosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $legislatura = $request->input('legislatura');
        $cuatrienio = $request->input('cuatrienio');
        $estado = $request->input('estado');
        $corporacion = $request->input('corporacion');
        $controlPolitico = ControlPolitico::select(
            'id','titulo', 'fecha', 'comision_id', 'legislatura_id', 'cuatrienio_id', 'estado_control_politico_id', 'tema_id_principal', 'tema_id_secundario', 'corporacion_id', 'activo')
        ->with('legislatura', 'cuatrienio', 'estadoControlPolitico', 'comision', 'temaPrincipalControlPolitico','temaSecundarioControlPolitico', 'corporacion')
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('legislatura_id', ($legislatura != "-1") ? '=' : '!=', $legislatura)
        ->where('cuatrienio_id', ($cuatrienio != "-1") ? '=' : '!=', $cuatrienio)
        ->where('estado_control_politico_id', ($estado != "-1") ? '=' : '!=', $estado)
        ->where('corporacion_id', ($corporacion != "-1") ? '=' : '!=', $corporacion)
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%' )
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($controlPolitico, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ControlPolitico::$rules, ControlPolitico::$rulesMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        // DB::beginTransaction();
        // try {
            $controlPolitico = new ControlPolitico;
            $request->request->add(['usercreated' => $request->user]);
            $result = $controlPolitico->create($request->all());

            $id = $result->id;

            $tags = $request->input('control_politico_tags');
                if($tags != null)
                {
                    foreach($request->input('control_politico_tags') as $key => $value)
                    {
                        $tags[$key]['control_politico_id'] = $id;
                        $requestCPTag = new Request($tags[$key]);

                        if($requestCPTag->activo == 1)
                        {
                            $CPTag = new ControlPoliticoTag;
                            $CPTag->fill($requestCPTag->all());
                            $CPTag->usercreated = $request->user;
                            $CPTag->save();
                        }
                    }
                }

            // DB::commit();
            return response()->json(['message' => 'OK'], 201);

        // } catch (\Exception $e)
        // {
        //     DB::rollback();
        //     return response()->json(['message' => 'Error'], 422);
        // }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $controlPolitico = ControlPolitico::select(
            'id','titulo', 'fecha', 'comision_id', 
            'legislatura_id', 'cuatrienio_id', 'estado_control_politico_id', 
            'tema_id_principal', 'tema_id_secundario', 'corporacion_id', 'tags', 'detalles', 
            'numero_proposicion', 'activo')
        ->with('comision','corporacion', 'controlPoliticoTags')
        ->where('id',$id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($controlPolitico, 200);
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
        $validator = Validator::make($request->all(), ControlPolitico::$rules, ControlPolitico::$rulesMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $controlPolitico = ControlPolitico::find($id);
            if($controlPolitico != null){
                $request->request->add(['usermodifed' => $request->user]);
                $controlPolitico->fill($request->all());
                $controlPolitico->save();
            }

            $tags = $request->input('control_politico_tags');
            if($tags != null)
            {
                foreach($request->input('control_politico_tags') as $key => $value)
                {
                    $tags[$key]['control_politico_id'] = $id;
                    $requesttags = new Request($tags[$key]);
                    if($requesttags->id > 0)
                    {
                        if($requesttags->activo == 1)
                        {
                            $controlPoliticoTag = ControlPoliticoTag::find($requesttags->id);
                            $controlPoliticoTag->fill($requesttags->all());
                            $controlPoliticoTag->usermodifed = $request->user;
                            $controlPoliticoTag->save();
                        }
                        else
                        {
                            $controlPoliticoTag = ControlPoliticoTag::find($requesttags->id);
                            $controlPoliticoTag->activo = 0;
                            $controlPoliticoTag->usermodifed = $request->user;
                            $controlPoliticoTag->save();
                        }
                    }
                    else
                    {
                        if($requesttags->activo == 1)
                        {
                            $controlPoliticoTag = new ControlPoliticoTag;
                            $controlPoliticoTag->fill($requesttags->all());
                            $controlPoliticoTag->usercreated = $request->user;
                            $controlPoliticoTag->save();
                        }
                    }
                }
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
        $controlPolitico = ControlPolitico::find($id);
        $controlPolitico->activo=!$controlPolitico->activo;
        $controlPolitico->save();
        return response($controlPolitico, 200);
    }

    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $legislatura = $request->input('legislatura');
        $cuatrienio = $request->input('cuatrienio');
        $comision = $request->input('comision');
        $estado = $request->input('estado');
        $corporacion = $request->input('corporacion');
        $count = ControlPolitico::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('legislatura_id', ($legislatura != "-1") ? '=' : '!=', $legislatura)
        ->where('cuatrienio_id', ($cuatrienio != "-1") ? '=' : '!=', $cuatrienio)
        ->where('estado_control_politico_id', ($estado != "-1") ? '=' : '!=', $estado)
        ->where('corporacion_id', ($corporacion != "-1") ? '=' : '!=', $corporacion)
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%' )
        ->count();
        return response($count, 200);
    }
}
