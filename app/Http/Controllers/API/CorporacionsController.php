<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Corporacion;
use App\Models\CorporacionImagen;
use App\Models\CorporacionDatosContacto;
use App\Models\CorporacionMiembro;
use Validator;
use App\Messages;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use DB;

class CorporacionsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $corporacionIndex = Corporacion::select('id','nombre', 'descripcion','activo')
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($corporacionIndex, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $corporacion = Corporacion::select('id','nombre','descripcion','activo')
        ->with('corporacionDatosContacto', 'corporacionImagen', 'corporacionMiembro')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($corporacion, 200);
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
        $validator = Validator::make($request->all(), Corporacion::$rulesPut, Corporacion::$messagesPut);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try 
        {
            $corporacion = Corporacion::find($id);                
            $files = $request->file('imagen');
            if($request->hasFile('imagen'))
            {
                $imagenesAnteriores = CorporacionImagen::select('id')
                ->where('corporacion_id', $corporacion->id)
                ->where('activo', 1)
                ->get();
                $files = $request->file('imagen');

                if($imagenesAnteriores != null)
                {
                    foreach ($imagenesAnteriores as $key => $imagenAnterior) 
                    {
                        $imgAnterior = CorporacionImagen::find($imagenesAnteriores[$key]->id);
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
                    $corporacionImagen = new CorporacionImagen;
                    $corporacionImagen->usercreated = $request->user;
                    $corporacionImagen->corporacion_id = $id;
                    $corporacionImagen->activo = 1;
                    $path = $file->storeAs(
                        '/corporacions/'.$nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );                
                    $corporacionImagen->imagen = $path;
                    $corporacionImagen->save();
                }  
            }
            $request->request->add(['usermodifed' => $request->user]);
            $corporacion->fill($request->all());
            $corporacion->save();
            $datosContacto = $request->input('datosContacto');
            if($datosContacto != null)
            {
                foreach($request->input('datosContacto') as $key => $value)
                {
                    $datosContacto[$key]['corporacion_id'] = $id;
                    $requestCorporacionDatosContacto = new Request($datosContacto[$key]);
                    if($requestCorporacionDatosContacto->id > 0)
                    {
                        if($requestCorporacionDatosContacto->activo == 1)
                        {
                            $corporacionDatosContacto = CorporacionDatosContacto::find($requestCorporacionDatosContacto->id);
                            $corporacionDatosContacto->fill($requestCorporacionDatosContacto->all());
                            $corporacionDatosContacto->usermodifed = $request->user;
                            $corporacionDatosContacto->save();
                        }
                        else
                        {
                            $corporacionDatosContacto = CorporacionDatosContacto::find($requestCorporacionDatosContacto->id);
                            $corporacionDatosContacto->activo = 0;
                            $corporacionDatosContacto->usermodifed = $request->user;
                            $corporacionDatosContacto->save();
                        }
                    }
                    else
                    {
                        if($requestCorporacionDatosContacto->activo == 1)
                        {
                            $corporacionDatosContacto = new CorporacionDatosContacto;
                            $corporacionDatosContacto->fill($requestCorporacionDatosContacto->all());
                            $corporacionDatosContacto->usercreated = $request->user;
                            $corporacionDatosContacto->save();
                        }
                    }
                }
            }
            
            $miembro = $request->input('miembros');
            if($miembro != null)
            {
                foreach($request->input('miembros') as $key => $value)
                {
                    $miembro[$key]['corporacion_id'] = $id;
                    $requestCorporacionMiembro = new Request($miembro[$key]);
                    if($requestCorporacionMiembro->id > 0)
                    {
                        if($requestCorporacionMiembro->activo == 1)
                        {
                            $corporacionMiembro = CorporacionMiembro::find($requestCorporacionMiembro->id);
                            $corporacionMiembro->fill($requestCorporacionMiembro->all());
                            $corporacionMiembro->usermodifed = $request->user;
                            $corporacionMiembro->save();
                        }
                        else
                        {
                            $corporacionMiembro = CorporacionMiembro::find($requestCorporacionMiembro->id);
                            $corporacionMiembro->activo = 0;
                            $corporacionMiembro->usermodifed = $request->user;
                            $corporacionMiembro->save();
                        }
                    }
                    else
                    {
                        if($requestCorporacionMiembro->activo == 1)
                        {
                            $corporacionMiembro = new CorporacionMiembro;
                            $corporacionMiembro->fill($requestCorporacionMiembro->all());
                            $corporacionMiembro->usercreated = $request->user;
                            $corporacionMiembro->save();
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
        $corporacion = Corporacion::find($id);
        $corporacion->activo=!$corporacion->activo;
        $corporacion->save();
        return response($corporacion, 200);
    }
}
