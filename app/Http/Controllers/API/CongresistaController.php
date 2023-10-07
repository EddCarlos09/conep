<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Congresista;
use App\Models\Investigacion;
use App\Models\CargoCamara;
use App\Models\CongresistaReemplazo;
use Validator;
use App\Messages;
use Carbon\Carbon;
use DB;
use Illuminate\Support\Facades\Storage;
use EloquentBuilder;

class CongresistaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Persona::query();

        if ($request->has('genero_id') && !is_null($request["genero_id"]))
        {
            $query->where(
                'genero_id',
                $request->genero_id
            );
        }

        if ($request->has('profesion_id') && !is_null($request["profesion_id"]))
        {
            $query->where(
                'profesion_id',
                $request->profesion_id
            );
        }

        if ($request->has('grado_estudio_id') && !is_null($request["grado_estudio_id"]))
        {
            $query->where(
                'grado_estudio_id',
                $request->grado_estudio_id
            );
        }

        if ($request->has('lugar_nacimiento_id') && !is_null($request["lugar_nacimiento_id"]))
        {
            $query->where(
                'municipio_id_nacimiento',
                $request->lugar_nacimiento_id
            );
        }
        if ($request->has('idFilter') && !is_null($request["idFilter"]))
        {
            $query->where(
                'activo',
                $request->idFilter
            );
        }

        if ($request->has('search') && !is_null($request["search"]))
        {
            $search = $request->input('search');

            $query->Where(function($query) use ($search){
                $query->where(DB::raw("CONCAT(`nombres`, ' ', `apellidos`)"), 'LIKE', "%".$search."%")
                      ->orWhere(DB::raw("(DATE_FORMAT(fechaNacimiento,'%Y-%m-%d'))"), 'LIKE', '%' . $search . '%')
                      ->orWhere(DB::raw("(DATE_FORMAT(fecha_fallecimiento,'%Y-%m-%d'))"), 'LIKE', '%' . $search . '%')
                      ->orWhere(function ($query) use ($search){
                          $query->orWhereHas('LugarNacimiento', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          })->orWhereHas('GradoEstudio', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          })->orWhereHas('Genero', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          })->orWhereHas('Profesion', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          });
                      });
            });
        }

        $items = $query->select(
            [
                'id',
                'nombres',
                'apellidos',
                'fechaNacimiento',
                'municipio_id_nacimiento',
                'profesion_id',
                'genero_id',
                'fecha_fallecimiento',
                'grado_estudio_id',
                'activo'
            ])
            ->with(['LugarNacimiento', 'GradoEstudio', 'Genero', 'Profesion', 'Imagenes'])
            ->skip(($request->input('page') - 1) * $request->input('rows'))
            ->take($request->input('rows'))
            ->orderBy('id','desc')
            ->get()
            ->toJson(JSON_PRETTY_PRINT);

        return response($items);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        
        $validator = Validator::make($request->all(), Congresista::$rulesPost,  Congresista::$messagesPost);
        if ($validator->fails()) {
            $messages = array_merge_recursive($validator->errors()->toArray());
            return response()->json($messages, 422);
        }
        DB::beginTransaction();
        try{
            $item = new Congresista();
            $request->request->add(['usercreated' => $request->user]);
            $result = $item->create($request->all()); // Congresista creado
            if($result != null){
                $id = $result->id;

                $hoja = $request->file('hoja');

                if($hoja != null){
                    $path = $hoja->storeAs(
                        '/congresista/'.$result->id, // Directorio
                        $hoja->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $item = Congresista::find($result->id);
                    $item->urlHojaVida = $path;
                    $item->save();  
                }

                // Investigaciones
                $investigaciones = $request->input('investigaciones');
                if($investigaciones != null)
                {
                    foreach($request->input('investigaciones') as $key => $value)
                    {
                        $investigaciones[$key]['congresista_id'] = $id;
                        $requestInvestigaciones = new Request($investigaciones[$key]);
                        if($requestInvestigaciones->activo == 1)
                        {
                            $CongresistaInvestigaciones = new Investigacion;
                            $CongresistaInvestigaciones->fill($requestInvestigaciones->all());
                            $CongresistaInvestigaciones->usercreated = $request->user;
                            $CongresistaInvestigaciones->save();
                        }
                    }
                }

                // Cargo
                $cargo = $request->input('cargo');
                if($cargo != null){
                    $cargo["congresista_id"] = $id;
                    $CongresistaCargo = new CargoCamara;
                    $CongresistaCargo->fill($cargo);
                    $CongresistaCargo->usercreated = $request->user;
                    $CongresistaCargo->save();
                }

                // Reemplazo
                $reemplazo = $request->input('reemplazo');
                if($reemplazo != null && $reemplazo["persona_id_reemplaza"] != 0){
                    $reemplazo["persona_id_reemplazado"] = $result->persona_id;
                    $CongresistaReemplazo = new CongresistaReemplazo;
                    $CongresistaReemplazo->fill($reemplazo);
                    $CongresistaReemplazo->usercreated = $request->user;
                    $CongresistaReemplazo->save();
                }
            }



            DB::commit();
            return response()->json(['message' => 'OK'], 201);
        }catch (\Exception $e)
        {
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
        $Congresista = Congresista::where('id', $id)
        ->with("corporacion", "cuatrienio", "partido", "persona", "investigaciones", "cargo", 'departamento', 'reemplazo')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($Congresista, 200);
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
        $validator = Validator::make($request->all(), Congresista::$rulesPut,  Congresista::$messagesPut);
        // $validator2 = Validator::make($cPerfilRequest->all(), Congresista::$rulesPutPerfil,  Congresista::$messagesPutPerfil);
        if ($validator->fails()) {
            $messages = array_merge_recursive($validator->errors()->toArray());
            return response()->json($messages, 422);
        }

        DB::beginTransaction();
        try {
            $congresista = Congresista::find($id);
            $request->request->add(['usermodifed' => $request->user]);
            $congresista->fill($request->all());
           

            $file = $request->file('hoja');
            if($file){
                if(Storage::disk('public')->exists($congresista->urlHojaVida))
                    Storage::disk('public')->delete($congresista->urlHojaVida);

                $path = $file->storeAs(
                    '/congresista/'.$congresista->id, // Directorio
                    $file->getClientOriginalName(), // Nombre real de la imagen
                    'public' // disco
                );
                $congresista->urlHojaVida = $path;
            }
            $congresista->save();

            // Investigaciones

            $investigaciones = $request->input('investigaciones');
            if($investigaciones != null)
            {
                foreach($request->input('investigaciones') as $key => $value)
                {
                    $investigaciones[$key]['congresista_id'] = $id;
                    $requestInvestigaciones = new Request($investigaciones[$key]);
                    if($requestInvestigaciones->id > 0)
                    {
                        if($requestInvestigaciones->activo == 1)
                        {
                            $CongresistaInvestigaciones = Investigacion::find($requestInvestigaciones->id);
                            $CongresistaInvestigaciones->fill($requestInvestigaciones->all());
                            $CongresistaInvestigaciones->usermodifed = $request->user;
                            $CongresistaInvestigaciones->save();
                        }
                        else
                        {
                            $CongresistaInvestigaciones = Investigacion::find($requestInvestigaciones->id);
                            $CongresistaInvestigaciones->activo = 0;
                            $CongresistaInvestigaciones->usermodifed = $request->user;
                            $CongresistaInvestigaciones->save();
                        }
                    }
                    else
                    {
                        if($requestInvestigaciones->activo == 1)
                        {
                            $CongresistaInvestigaciones = new Investigacion;
                            $CongresistaInvestigaciones->fill($requestInvestigaciones->all());
                            $CongresistaInvestigaciones->usercreated = $request->user;
                            $CongresistaInvestigaciones->save();
                        }
                    }
                }
            }

            // Cargo
            $cargo = $request->input('cargo');
            if($cargo != null){
                $CongresistaCargo = CargoCamara::find($cargo["id"]);
                if($cargo["cargo_legislativo_id"] != 0){
                    if($CongresistaCargo == null){
                        $cargo["congresista_id"] = $id;
                        $CongresistaCargo = new CargoCamara;
                        $CongresistaCargo->fill($cargo);
                        $CongresistaCargo->usercreated = $request->user;
                        $CongresistaCargo->save();
                    }else{
                        $CongresistaCargo->fill($cargo);
                        $CongresistaCargo->usermodifed = $request->user;
                        $CongresistaCargo->save();
                    }
                }
            }

            // Reemplazo
            $reemplazo = $request->input('reemplazo');
            if($reemplazo != null){
                if($reemplazo["persona_id_reemplazado"] != 0){
                    $CongresistaReemplazo = CongresistaReemplazo::find($reemplazo["id"]);
                    if($CongresistaReemplazo == null){
                        $reemplazo["persona_id_reemplazado"] = $congresista->persona_id;
                        $CongresistaReemplazo = new CongresistaReemplazo;
                        $CongresistaReemplazo->fill($reemplazo);
                        $CongresistaReemplazo->usercreated = $request->user;
                        $CongresistaReemplazo->save();
                    }else{
                        $CongresistaReemplazo->fill($reemplazo);
                        $CongresistaReemplazo->usermodifed = $request->user;
                        $CongresistaReemplazo->save();
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $Congresista = Congresista::find($id);
        $Congresista->activo=!$Congresista->activo;
        $Congresista->save();

        return response($Congresista, 200);
    }

    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $corporacion = $request->input('corporacion');
        $cuatrienio = $request->input('cuatrienio');
        $partido = $request->input('partido');
        $count = Congresista::with("persona")
            ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
            ->where('corporacion_id', ($corporacion != "-1") ? '=' : '!=', $corporacion)
            ->where('cuatrienio_id', ($cuatrienio != "-1") ? '=' : '!=', $cuatrienio)
            ->where('partido_id', ($partido != "-1") ? '=' : '!=', $partido)
            ->whereHas('persona', function($q) use ($request){
                $q->where(DB::raw("CONCAT(`nombres`, ' ', `apellidos`)"), 'LIKE', "%".$search."%");
            })
            ->count();

        return response($count, 200);
    }

    public function getCongresistas(Request $request){

        $query = Persona::query();

        if ($request->has('genero_id') && !is_null($request["genero_id"]))
        {
            $query->where(
                'genero_id',
                $request->genero_id
            );
        }

        if ($request->has('profesion_id') && !is_null($request["profesion_id"]))
        {
            $query->where(
                'profesion_id',
                $request->profesion_id
            );
        }

        if ($request->has('grado_estudio_id') && !is_null($request["grado_estudio_id"]))
        {
            $query->where(
                'grado_estudio_id',
                $request->grado_estudio_id
            );
        }

        if ($request->has('lugar_nacimiento_id') && !is_null($request["lugar_nacimiento_id"]))
        {
            $query->where(
                'municipio_id_nacimiento',
                $request->lugar_nacimiento_id
            );
        }

        if ($request->has('idFilter') && !is_null($request["idFilter"]))
        {
            $query->where(
                'activo',
                $request->idFilter
            );
        }

        if ($request->has('search') && !is_null($request["search"]))
        {
            $search = $request->input('search');

            $query->Where(function($query) use ($search){
                $query->where(DB::raw("CONCAT(`nombres`, ' ', `apellidos`)"), 'LIKE', "%".$search."%")
                      ->orWhere(DB::raw("(DATE_FORMAT(fechaNacimiento,'%Y-%m-%d'))"), 'LIKE', '%' . $search . '%')
                      ->orWhere(DB::raw("(DATE_FORMAT(fecha_fallecimiento,'%Y-%m-%d'))"), 'LIKE', '%' . $search . '%')
                      ->orWhere(function ($query) use ($search){
                          $query->orWhereHas('LugarNacimiento', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          })->orWhereHas('GradoEstudio', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          })->orWhereHas('Genero', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          })->orWhereHas('Profesion', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          });
                      });
            });
        }

        $count = $query->select(
            [
                'id',
                'nombres',
                'apellidos',
                'fechaNacimiento',
                'municipio_id_nacimiento',
                'profesion_id',
                'genero_id',
                'fecha_fallecimiento',
                'grado_estudio_id',
                'activo'
            ])
           ->with(['LugarNacimiento', 'GradoEstudio', 'Genero', 'Profesion', 'Imagenes'])
           ->get()->count();

        return response($count);
    }
}
