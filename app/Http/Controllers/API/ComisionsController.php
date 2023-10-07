<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\Comision;
use App\Models\ComisionImagen;
use App\Models\ComisionMiembro;
use App\Models\ComisionSecretario;
use App\Models\ComisionDatosContacto;
use Validator;
use App\Messages;
use Carbon\Carbon;
use DB;


class ComisionsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        // $corporacion = $request->input('corporacion');
        $tipoComision = $request->input('tipoComision');
        $comision = Comision::select('id','nombre', 'tipo_comision_id', 'descripcion', 'activo')
        ->with('tipoComision')
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        // ->where('corporacion_id', ($corporacion != "-1") ? '=' : '!=', $corporacion)
        ->where('tipo_comision_id', ($tipoComision != "-1") ? '=' : '!=', $tipoComision)
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($comision, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->request->add(['tipo_comision_id' => 1]);
        $validator = Validator::make($request->all(), Comision::$rulesPost, Comision::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $comision = new Comision;
            $request->request->add(['usercreated' => $request->user]);
            $result = $comision->create($request->all());
            $id = $result->id;
            if($result != null)
            {
                $files = $request->file('imagen');
                if($request->hasFile('imagen'))
                {
                    $nombre = $id;
                    foreach ($files as $file)
                    {
                        // Se crea registro
                        $imagenComision = new ComisionImagen;
                        $imagenComision->usercreated = $request->user;
                        $imagenComision->comision_id = $id;
                        $imagenComision->activo = 1;
                        $path = $file->storeAs(
                            '/comisions/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );
                        $imagenComision->imagen = $path;
                        $imagenComision->save();
                    }
                }

                $datosContacto = $request->input('datosContacto');
                if($datosContacto != null)
                {
                    foreach($request->input('datosContacto') as $key => $value)
                    {
                        $datosContacto[$key]['comision_id'] = $id;
                        $requestComisionDatosContacto = new Request($datosContacto[$key]);
                        if($requestComisionDatosContacto->activo == 1)
                        {
                            $comisionDatosContacto = new ComisionDatosContacto;
                            $comisionDatosContacto->fill($requestComisionDatosContacto->all());
                            $comisionDatosContacto->usercreated = $request->user;
                            $comisionDatosContacto->save();
                        }
                    }
                }

                $miembros = $request->input('miembros');
                if($miembros != null)
                {
                    foreach($request->input('miembros') as $key => $value)
                    {
                        $miembros[$key]['comision_id'] = $id;
                        $requestComisionMiembros = new Request($miembros[$key]);
                        if($requestComisionMiembros->activo == 1)
                        {
                            $comisionMiembros = new ComisionMiembro;
                            $comisionMiembros->fill($requestComisionMiembros->all());
                            $comisionMiembros->usercreated = $request->user;
                            $comisionMiembros->save();
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
        $partido = Comision::select('id', 'nombre', 'descripcion', 'tipo_comision_id', 'activo')
        ->with('comisionDatosContacto', 'comisionImagen', 'tipoComision', 'comisionMiembro', 'comisionSecretario')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($partido, 200);
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
        $validator = Validator::make($request->all(), Comision::$rulesPut, Comision::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);
        // DB::beginTransaction();
        // try
        // {
            $comision = Comision::find($id);
            $files = $request->file('imagen');
            if($request->hasFile('imagen'))
            {
                $imagenesAnteriores = ComisionImagen::select('id')
                ->where('comision_id', $comision->id)
                ->where('activo', 1)
                ->get();

                if($imagenesAnteriores != null){
                    foreach ($imagenesAnteriores as $key => $imagenAnterior)
                    {
                        $imgAnterior = ComisionImagen::find($imagenesAnteriores[$key]->id);
                        if(Storage::disk('public')->exists($imgAnterior->imagen))
                            Storage::disk('public')->delete($imgAnterior->imagen);
                        $imgAnterior->usermodifed = $request->user;
                        $imgAnterior->activo = 0;
                        $imgAnterior->save();
                    }
                }
                $nombre = $id;
                foreach ($files as $file)
                {
                    // Se crea registro
                    $imagenComision = new ComisionImagen;
                    $imagenComision->usercreated = $request->user;
                    $imagenComision->comision_id = $id;
                    $imagenComision->activo = 1;
                    $path = $file->storeAs(
                        '/comisions/'.$nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $imagenComision->imagen = $path;
                    $imagenComision->save();
                }
            }
            $request->request->add(['usermodifed' => $request->user]);
            $comision->fill($request->all());
            $comision->save();

            $datosContacto = $request->input('datosContacto');
            if($datosContacto != null)
            {
                foreach($request->input('datosContacto') as $key => $value)
                {
                    $datosContacto[$key]['comision_id'] = $id;
                    $requestComisionDatosContacto = new Request($datosContacto[$key]);
                    if($requestComisionDatosContacto->id > 0)
                    {
                        if($requestComisionDatosContacto->activo == 1)
                        {
                            $comisionDatosContacto = ComisionDatosContacto::find($requestComisionDatosContacto->id);
                            $comisionDatosContacto->fill($requestComisionDatosContacto->all());
                            $comisionDatosContacto->usermodifed = $request->user;
                            $comisionDatosContacto->save();
                        }
                        else
                        {
                            $comisionDatosContacto = ComisionDatosContacto::find($requestComisionDatosContacto->id);
                            $comisionDatosContacto->activo = 0;
                            $comisionDatosContacto->usermodifed = $request->user;
                            $comisionDatosContacto->save();
                        }
                    }
                    else
                    {
                        if($requestComisionDatosContacto->activo == 1)
                        {
                            $comisionDatosContacto = new ComisionDatosContacto;
                            $comisionDatosContacto->fill($requestComisionDatosContacto->all());
                            $comisionDatosContacto->usercreated = $request->user;
                            $comisionDatosContacto->save();
                        }
                    }
                }
            }

            $miembro = $request->input('miembros');
            if($miembro != null)
            {
                foreach($request->input('miembros') as $key => $value)
                {
                    $miembro[$key]['comision_id'] = $id;
                    $requestComisionMiembro = new Request($miembro[$key]);
                    if($requestComisionMiembro->id > 0)
                    {
                        if($requestComisionMiembro->activo == 1)
                        {
                            $comisionMiembro = ComisionMiembro::find($requestComisionMiembro->id);
                            $comisionMiembro->fill($requestComisionMiembro->all());
                            $comisionMiembro->usermodifed = $request->user;
                            $comisionMiembro->save();
                        }
                        else
                        {
                            $comisionMiembro = ComisionMiembro::find($requestComisionMiembro->id);
                            $comisionMiembro->activo = 0;
                            $comisionMiembro->usermodifed = $request->user;
                            $comisionMiembro->save();
                        }
                    }
                    else
                    {
                        if($requestComisionMiembro->activo == 1)
                        {
                            $comisionMiembro = new ComisionMiembro;
                            $comisionMiembro->fill($requestComisionMiembro->all());
                            $comisionMiembro->usercreated = $request->user;
                            $comisionMiembro->save();
                        }
                    }
                }
            }

            $secretario = $request->input('secretarios');
            if($secretario != null)
            {
                foreach($request->input('secretarios') as $key => $value)
                {
                    $secretario[$key]['comision_id'] = $id;
                    $requestComisionSecretario = new Request($secretario[$key]);
                    if($requestComisionSecretario->id > 0)
                    {
                        if($requestComisionSecretario->activo == 1)
                        {
                            $comisionSecretario = ComisionSecretario::find($requestComisionSecretario->id);
                            $comisionSecretario->fill($requestComisionSecretario->all());
                            $comisionSecretario->usermodifed = $request->user;
                            $comisionSecretario->save();
                        }
                        else
                        {
                            $comisionSecretario = ComisionSecretario::find($requestComisionSecretario->id);
                            $comisionSecretario->activo = 0;
                            $comisionSecretario->usermodifed = $request->user;
                            $comisionSecretario->save();
                        }
                    }
                    else
                    {
                        if($requestComisionSecretario->activo == 1)
                        {
                            $comisionSecretario = new ComisionSecretario;
                            $comisionSecretario->fill($requestComisionSecretario->all());
                            $comisionSecretario->usercreated = $request->user;
                            $comisionSecretario->save();
                        }
                    }
                }
            }

            // DB::commit();
            // return response()->json(['message' => 'OK'], 202);
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
        $comision = Comision::find($id);
        $comision->activo=!$comision->activo;
        $comision->save();
        return response($comision, 200);
    }

       /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $tipoComision = $request->input('tipoComision');
        $count = Comision::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        // ->where('corporacion_id', ($corporacion != "-1") ? '=' : '!=', $corporacion)
        ->where('tipo_comision_id', ($tipoComision != "-1") ? '=' : '!=', $tipoComision)
        ->count();
        return response($count, 200);
    }

    public function getCongresistas(Request $request){

        $query = ComisionMiembro::query();

        if ($request->has('id')) {
            $query->where('id' , $request->id);
        }

        if ($request->has('comision_id')) {
            $query->where('comision_id', $request->comision_id);
        }

        if ($request->has('congresista_id')) {
            $query->where('congresista_id', $request->congresista_id);
        }

        if ($request->has('comision_cargo_congresista_id')) {
            $query->where('comision_cargo_congresista_id', $request->comision_cargo_congresista_id);
        }

        if ($request->has('activo')) {
            $query->where('activo', $request->activo);
        }

        $query->with(['congresista']);
        $result = $query->get();

        return response($result, 200);
    }
}
