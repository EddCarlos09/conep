<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Eleccion;
use App\Models\EleccionCandidato;
use Validator;
use App\Messages;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use DB;

class EleccionsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $corporacion = $request->input('idCorporacion');
        $tipoComision = $request->input('idTipoComision');
        $cuatrienio = $request->input('idCuatrienio');
        $comision = $request->input('idComision');
        $search = $request->input('search');
        $eleccion = Eleccion::select('id','titulo','cuatrienio_id','comision_id',
        'tipo_comision_id','fechaDeEleccion','comision_miembro_id','activo')
        ->with('cuatrienio', 'comision', 'funcionarioActual')
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('corporacion_id', ($corporacion != "0") ? '=' : '!=', $corporacion)
        ->where('tipo_comision_id', ($tipoComision != "0") ? '=' : '!=', $tipoComision)
        ->where('comision_id', ($comision != "0") ? '=' : '!=', $comision)
        ->where('cuatrienio_id', ($cuatrienio != "0") ? '=' : '!=', $cuatrienio)
        ->where('titulo', 'LIKE', '%' . $search . '%' )
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($eleccion, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), Eleccion::$rulesPost, Eleccion::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

            DB::beginTransaction();
            try
            {
                $eleccion = new Eleccion;
                $request->request->add(['usercreated' => $request->user]);
                $result = $eleccion->create($request->all());
                $id = $result->id;
                if($result != null)
                {
                    $candidatos = $request->input('candidatos');
                    if($candidatos != null)
                    {
                        foreach($request->input('candidatos') as $key => $value)
                        {
                            $candidatos[$key]['eleccion_id'] = $id;
                            $requestEleccioncandidatos = new Request($candidatos[$key]);
                            if($requestEleccioncandidatos->activo == 1)
                            {
                                $eleccioncandidatos = new EleccionCandidato;
                                $eleccioncandidatos->fill($requestEleccioncandidatos->all());
                                $eleccioncandidatos->usercreated = $request->user;
                                $eleccioncandidatos->save();
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
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $eleccion = Eleccion::select('id', 'titulo', 'corporacion_id', 'tipo_comision_id', 
        'comision_miembro_id', 'comision_id', 'cuatrienio_id', 'fechaDeEleccion', 'infoGeneral', 'resultadoVotacion',
        'comision_cargo_congresista_id', 'activo')
        ->with('corporacion', 'tipoComision', 'comision', 'cuatrienio', 'funcionarioActual', 'candidato')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($eleccion, 200);
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
        $validator = Validator::make($request->all(), Eleccion::$rulesPut, Eleccion::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);
        DB::beginTransaction();
        try
        {
            $eleccion = Eleccion::find($id);
            $request->request->add(['usermodifed' => $request->user]);
            $eleccion->fill($request->all());
            $eleccion->save();

            $candidatos = $request->input('candidatos');
            if($candidatos != null)
            {
                foreach($request->input('candidatos') as $key => $value)
                {
                    $candidatos[$key]['eleccion_id'] = $id;
                    $requestEleccionCandidato = new Request($candidatos[$key]);
                    if($requestEleccionCandidato->id > 0)
                    {
                        if($requestEleccionCandidato->activo == 1)
                        {
                            $eleccionCandidato = EleccionCandidato::find($requestEleccionCandidato->id);
                            $eleccionCandidato->fill($requestEleccionCandidato->all());
                            $eleccionCandidato->usermodifed = $request->user;
                            $eleccionCandidato->save();
                        }
                        else
                        {
                            $eleccionCandidato = EleccionCandidato::find($requestEleccionCandidato->id);
                            $eleccionCandidato->activo = 0;
                            $eleccionCandidato->usermodifed = $request->user;
                            $eleccionCandidato->save();
                        }
                    }
                    else
                    {
                        if($requestEleccionCandidato->activo == 1)
                        {
                            $eleccionCandidato = new EleccionCandidato;
                            $eleccionCandidato->fill($requestEleccionCandidato->all());
                            $eleccionCandidato->usercreated = $request->user;
                            $eleccionCandidato->save();
                        }
                    }
                }
            }

            DB::commit();
            return response()->json(['message' => 'OK'], 202);
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
        $eleccion = Eleccion::find($id);
        $eleccion->activo=!$eleccion->activo;
        $eleccion->save();
        return response($eleccion, 200);
    }

    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $corporacion = $request->input('idCorporacion');
        $tipoComision = $request->input('idTipoComision');
        $cuatrienio = $request->input('idCuatrienio');
        $comision = $request->input('idComision');
        $fecha = $request->input('fecha');
        $search = $request->input('search');
        
        $count = Eleccion::where('activo', $request->input('idFilter'))
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('corporacion_id', ($corporacion != "0") ? '=' : '!=', $corporacion)
        ->where('tipo_comision_id', ($tipoComision != "0") ? '=' : '!=', $tipoComision)
        ->where('comision_id', ($comision != "0") ? '=' : '!=', $comision)
        ->where('cuatrienio_id', ($cuatrienio != "0") ? '=' : '!=', $cuatrienio)
        ->where('titulo', 'LIKE', '%' . $search . '%' )
        ->count();
        return response($count, 200);
    }
}
