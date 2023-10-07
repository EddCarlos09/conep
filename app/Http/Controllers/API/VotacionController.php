<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Votacion;
use App\Models\VotacionPlenaria;
use App\Models\VotacionComision;
use App\Models\VotacionCongresista;
use App\Models\TipoRespuestaVotacion;
use App\Models\Congresista;
use App\Models\VotacionEstado;
use Illuminate\Support\Facades\Storage;
use Validator;
use App\Messages;
use Carbon\Carbon;
use DB;

class VotacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Votacion::query();

        // Sería activo
        if ($request->has('idFilter') && !is_null($request["idFilter"]))
        {
            $query->where(
                'activo',
                $request->idFilter
            );
        }
        // Cuatrienio
        if ($request->has('cuatrienio') && !is_null($request["cuatrienio"]))
        {
            $query->where(
                'cuatrienio_id',
                $request->cuatrienio
            );
        }
        // Legislatura
        if ($request->has('legislatura') && !is_null($request["legislatura"]))
        {
            $query->where(
                'legislatura_id',
                $request->legislatura
            );
        }
        // Corporación
        if ($request->has('corporacion') && !is_null($request["corporacion"]))
        {
            $corporacion = $request["corporacion"];
            $query->Where(function ($query) use ($corporacion){
            $query->WhereHas('votacionPlenaria', function ($query) use ($corporacion) {
                $query->where('corporacion_id', '=', $corporacion);
            })
                  ->orWhereHas('votacionComision', function ($query) use ($corporacion) {
                      $query->where('corporacion_id', '=', $corporacion);
                  });
            });
        }

        // Comisión
        if ($request->has('comision') && !is_null($request["comision"]))
        {
            $comision = $request["comision"];
            $query->Where(function ($query) use ($comision){
                $query->orWhereHas('votacionComision', function ($query) use ($comision) {
                          $query->where('comision_id', '=', $comision);
                      });
            });
        }

        $items = $query->select([
                            'id',
                            'fecha',
                            'urlGaceta',
                            'legislatura_id',
                            'cuatrienio_id',
                            'proyecto_de_ley_id',
                            'esPlenaria',
                            'esComision',
                            'voto_general',
                            'activo'
                        ])->with(
                            "legislatura",
                            "cuatrienio",
                            "proyectoDeLey",
                            "votacionCongresista"
                        )->get()->toJson(JSON_PRETTY_PRINT);

        return response($items, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), Votacion::$rulesPost,  Votacion::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        $esPlenaria = $request->get("esPlenaria");
        $esComision = $request->get("esComision");
        $votoGeneral = $request->get("voto_general");
        if($esPlenaria == "true"){
            $plenariaRequest = new Request($request->get('votacion_plenaria'));
            $validator2 = Validator::make($plenariaRequest->all(), Votacion::$rulesPostPlenaria,  Votacion::$messagesPostPlenaria);
            if ($validator2->fails())
                return response()->json($validator2->errors(),422);
        }
        if($esComision == "true"){
            $comisionRequest = new Request($request->get('votacion_comision'));
            $validator3 = Validator::make($comisionRequest->all(), Votacion::$rulesPostComision,  Votacion::$messagesPostComision);
            if ($validator3->fails())
                return response()->json($validator3->errors(),422);
        }

        DB::beginTransaction();
        try {
            $item = new Votacion();
            $request->request->add(['usercreated' => $request->user]);
            $request->merge([
                'esPlenaria' => $esPlenaria == "true" ? 1 : 0,
                'esComision' => $esComision == "true" ? 1 : 0,
                'voto_general' => $votoGeneral == "true" ? 1 : 0
            ]);
            $result = $item->create($request->all());
            if($result != null){
                $id = $result->id;

                $estadoProyecto = $request->input('votacion_estado');
                if($estadoProyecto != null && $estadoProyecto["proyecto_ley_estado_id"] != 0){
                    $estadoProyecto["votacion_id"] = $id;
                    $VotacionEstado = new VotacionEstado;
                    $VotacionEstado->fill($estadoProyecto);
                    $VotacionEstado->usercreated = $request->user;
                    $VotacionEstado->save();
                }


                if($result->esPlenaria == 1){
                    $plenaria = $request->input('votacion_plenaria');
                    if($plenaria != null){
                        $plenaria["votacion_id"] = $id;
                        $votacionPlenaria = new VotacionPlenaria;
                        $votacionPlenaria->fill($plenaria);
                        $votacionPlenaria->usercreated = $request->user;
                        $votacionPlenaria->save();
                    }
                }
                if($result->esComision == 1){
                    $comision = $request->input('votacion_comision');
                    if($comision != null){
                        $comision["votacion_id"] = $id;
                        $votacionComision = new VotacionComision;
                        $votacionComision->fill($comision);
                        $votacionComision->usercreated = $request->user;
                        $votacionComision->save();
                    }
                }

                $gaceta = $request->file('gaceta');
                if($gaceta != null){
                    $path = $gaceta->storeAs(
                        '/votacion/'.$result->id, // Directorio
                        $gaceta->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $item = Votacion::find($result->id);
                    $item->urlGaceta = $path;
                    $item->save();
                }
            }
            DB::commit();
            return response()->json(['message' => 'OK'], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Error'], 204);
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
        $Votacion = Votacion::where('id', $id)
        ->with("legislatura", "cuatrienio", "votacionPlenaria", "votacionComision", "proyectoDeLey", "VotacionEstado")
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($Votacion, 200);
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
        $validator = Validator::make($request->all(), Votacion::$rulesPut,  Votacion::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        $esPlenaria = $request->get("esPlenaria");
        $esComision = $request->get("esComision");
        $votoGeneral = $request->get("voto_general");
        if($esPlenaria == "true"){
            $plenariaRequest = new Request($request->get('votacion_plenaria'));
            $validator2 = Validator::make($plenariaRequest->all(), Votacion::$rulesPutPlenaria,  Votacion::$messagesPutPlenaria);
            if ($validator2->fails())
                return response()->json($validator2->errors(),422);
        }
        if($esComision == "true"){
            $comisionRequest = new Request($request->get('votacion_comision'));
            $validator3 = Validator::make($comisionRequest->all(), Votacion::$rulesPutComision,  Votacion::$messagesPutComision);
            if ($validator3->fails())
                return response()->json($validator3->errors(),422);
        }


        DB::beginTransaction();
        try {
            $request->merge([
                'esPlenaria' => $esPlenaria == "true" || $esPlenaria == "1" ? 1 : 0,
                'esComision' => $esComision == "true" || $esComision == "1" ? 1 : 0,
                'voto_general' => $votoGeneral == "true" || $votoGeneral == "1" ? 1 : 0
            ]);

            $votacion = Votacion::find($id);
            $request->request->add(['usermodifed' => $request->user]);
            $votacion->fill($request->all());

            $file = $request->file('gaceta');
            if($file){
                if(Storage::disk('public')->exists($votacion->urlGaceta))
                    Storage::disk('public')->delete($votacion->urlGaceta);

                $path = $file->storeAs(
                    '/votacion/'.$votacion->id, // Directorio
                    $file->getClientOriginalName(), // Nombre real de la imagen
                    'public' // disco
                );
                $votacion->urlGaceta = $path;
            }
            $votacion->save();

            $estadoProyecto = $request->input('votacion_estado');
            if($estadoProyecto != null && $estadoProyecto["proyecto_ley_estado_id"] != 0){
                if($estadoProyecto["id"] == null || $estadoProyecto["id"] == 0){
                    $estadoProyecto["votacion_id"] = $id;
                    $votacionEstado = new VotacionEstado;
                    $votacionEstado->fill($estadoProyecto);
                    $votacionEstado->usercreated = $request->user;
                    $votacionEstado->save();
                }else{
                    $VotacionEstado = VotacionEstado::find($estadoProyecto["id"]);
                    $VotacionEstado->fill($estadoProyecto);
                    $VotacionEstado->usermodifed = $request->user;
                    $VotacionEstado->save();
                }
            }

            if($request->get('esPlenaria') == "1"){
                $plenaria = $request->input('votacion_plenaria');
                if($plenaria != null){
                    if($plenaria["id"] == null || $plenaria["id"] == 0){
                        $plenaria["votacion_id"] = $id;
                        $votacionPlenaria = new VotacionPlenaria;
                        $votacionPlenaria->fill($plenaria);
                        $votacionPlenaria->usercreated = $request->user;
                        $votacionPlenaria->save();
                    }else{
                        $VotacionPlenaria = VotacionPlenaria::find($plenaria["id"]);
                        $VotacionPlenaria->fill($plenaria);
                        $VotacionPlenaria->usermodifed = $request->user;
                        $VotacionPlenaria->save();
                    }
                }
            }

            if($request->get('esComision') == "1"){
                $comision = $request->input('votacion_comision');
                if($comision != null){
                    if($comision["id"] == null || $comision["id"] == 0){
                        $comision["votacion_id"] = $id;
                        $votacionComision = new VotacionComision;
                        $votacionComision->fill($comision);
                        $votacionComision->usercreated = $request->user;
                        $votacionComision->save();
                    }else{
                        $VotacionComision = VotacionComision::find($comision["id"]);
                        $VotacionComision->fill($comision);
                        $VotacionComision->usermodifed = $request->user;
                        $VotacionComision->save();
                    }
                }
            }
            DB::commit();
            return response()->json(['message' => 'OK'], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Error'], 204);
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
        $item = Votacion::find($id);
        $item->activo = !$item->activo;
        $item->save();
    }

    public function totalrecords(Request $request)
    {
        $query = Votacion::query();

        // Sería activo
        if ($request->has('idFilter') && !is_null($request["idFilter"]))
        {
            $query->where(
                'activo',
                $request->idFilter
            );
        }
        // Cuatrienio
        if ($request->has('cuatrienio') && !is_null($request["cuatrienio"]))
        {
            $query->where(
                'cuatrienio_id',
                $request->cuatrienio
            );
        }
        // Legislatura
        if ($request->has('legislatura') && !is_null($request["legislatura"]))
        {
            $query->where(
                'legislatura_id',
                $request->legislatura
            );
        }
        // Corporación
        if ($request->has('corporacion') && !is_null($request["corporacion"]))
        {
            $corporacion = $request["corporacion"];
            $query->Where(function ($query) use ($corporacion){
                $query->WhereHas('votacionPlenaria', function ($query) use ($corporacion) {
                    $query->where('corporacion_id', '=', $corporacion);
                })
                      ->orWhereHas('votacionComision', function ($query) use ($corporacion) {
                          $query->where('corporacion_id', '=', $corporacion);
                      });
            });
        }
        // Comisión
        if ($request->has('comision') && !is_null($request["comision"]))
        {
            $comision = $request["comision"];
            $query->Where(function ($query) use ($comision){
                $query->orWhereHas('votacionComision', function ($query) use ($comision) {
                    $query->where('comision_id', '=', $comision);
                });
            });
        }

        $items = $query->select([
                                    'id',
                                    'fecha',
                                    'urlGaceta',
                                    'legislatura_id',
                                    'cuatrienio_id',
                                    'proyecto_de_ley_id',
                                    'esPlenaria',
                                    'esComision',
                                    'activo'
                                ])->with(
            "legislatura",
            "cuatrienio",
            "proyectoDeLey",
            "votacionCongresista"
        )->count();

        return response($items, 200);
    }

    public function showVotar($id){
        $Votacion = Votacion::where('id', $id)->where('activo', 1)
        ->with("votacionCongresista", "votacionPlenaria" , "votacionComision", "proyectoDeLey", 'tipoVotacion', 'claseVotacion')
        ->get()
        ->first();
        $TiposRespuesta = TipoRespuestaVotacion::where('activo',1)
        ->get();
        $Congresistas;
        if($Votacion->esPlenaria){
            $Congresistas = Congresista::with("persona")
            ->where('cuatrienio_id', $Votacion->cuatrienio_id)
            ->where('activo',1)
            ->where('corporacion_id', $Votacion->votacionPlenaria->corporacion_id)
            ->get();
        }else{
            $Congresistas = Congresista::with("persona")
            ->join('comision_miembros', 'comision_miembros.congresista_id', 'congresistas.id')
            ->join('comisions', 'comisions.id', 'comision_miembros.comision_id')
            ->join('tipo_comisions', 'tipo_comisions.id', 'comisions.tipo_comision_id')
            ->where('congresistas.cuatrienio_id', $Votacion->cuatrienio_id)
            ->where('congresistas.activo',1)
            ->where('congresistas.corporacion_id', $Votacion->votacionComision->corporacion_id)
            ->where('tipo_comisions.id', $Votacion->votacionComision->tipo_comision_id)
            ->where('comisions.id', $Votacion->votacionComision->comision_id)
            ->get();
        }

        $array = array_merge(['votacion' => $Votacion->toArray(), 'tipos_respuesta' => $TiposRespuesta->toArray(), 'congresistas' => $Congresistas->toArray()]);
        json_encode($array);

        return response($array, 200);
    }

    public function updateVotaciones(Request $request, $id){
        // $validator = Validator::make($request->all(), Votacion::$rulesVotacionesPut,  Votacion::$rulesVotacionesPutMessages);
        // if ($validator->fails())
        //     return response()->json($validator->errors(),422);
            DB::beginTransaction();
            try {
            $votacionCongresista = $request->input('votacion_congresista');
            if($votacionCongresista != null)
            {
                foreach($votacionCongresista as $key => $value)
                {
                    $requestVotacionCongresista = new Request($value);
                    if($requestVotacionCongresista->id > 0)
                    {
                        if($requestVotacionCongresista->activo == 1)
                        {
                            $votacion = VotacionCongresista::find($requestVotacionCongresista->id);
                            $votacion->fill($requestVotacionCongresista->all());
                            $votacion->usermodifed = $request->user;
                            $votacion->save();
                        }
                        else
                        {
                            $votacion = VotacionCongresista::find($requestVotacionCongresista->id);
                            $votacion->activo = 0;
                            $votacion->usermodifed = $request->user;
                            $votacion->save();
                        }
                    }
                    else
                    {
                        if($requestVotacionCongresista->activo == 1)
                        {
                            $votacion = new VotacionCongresista;
                            $votacion->fill($requestVotacionCongresista->all());
                            $votacion->usercreated = $request->user;
                            $votacion->save();
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
            return response()->json(['message' => $e], 422);
        }
    }
}
