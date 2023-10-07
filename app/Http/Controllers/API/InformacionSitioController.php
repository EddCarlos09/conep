<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\InformacionSitio;
use App\Models\SlidePrincipalCv;
use App\Models\SlideSecundarioCv;
use Illuminate\Http\Request;
use Validator;
use DB;
use Illuminate\Support\Facades\Storage;

class InformacionSitioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $infoSitio = InformacionSitio::select('id', 'imgPrincipal', 'congresistas', 'nuestraDemocracia', 'actividadLegislativa', 'igmActividadLegislativa', 'comisiones', 'contenidoMultimedia', 'proyectosDeLey', 'datos','observacionesLegales', 'activo',)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($infoSitio, 200);
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
        $infoSitioById = InformacionSitio::select('id', 'imgPrincipal', 'congresistas', 'nuestraDemocracia', 'actividadLegislativa', 'igmActividadLegislativa', 'comisiones', 'contenidoMultimedia', 'proyectosDeLey', 'datos','observacionesLegales', 'activo',)
            ->with('slidePrincipal', 'slideSecundario')
            ->where('id', $id)
            ->get()
            ->toJson(JSON_PRETTY_PRINT);
        return response($infoSitioById, 200);
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

        $validator = Validator::make($request->all(), InformacionSitio::$rulesPut, InformacionSitio::$rulesPutMessages);

        if ($validator->passes()) {
            DB::beginTransaction();
            try {
            $InfoSitio = InformacionSitio::find($id);
            $nombre = $id;
            
            if ($request->hasFile("newimgPrincipal")) {
                $filesP = $request->file('newimgPrincipal');
                //Se crea registro
                if (Storage::disk('public')->exists($InfoSitio->imgPrincipal))
                    Storage::disk('public')->delete($InfoSitio->imgPrincipal);
                $path = $filesP[0]->storeAs(
                    '/InformacionSitio/' . $nombre, // Directorio
                    $filesP[0]->getClientOriginalName(), // Nombre real de la imagen
                    'public' // disco   
                );              
                $InfoSitio->imgPrincipal = $path;                                     
            }
            if ($request->hasFile("newigmActividadLegislativa")) {
                $files = $request->file('newigmActividadLegislativa');
                
                    // Se crea registro
                    if (Storage::disk('public')->exists($InfoSitio->igmActividadLegislativa))
                        Storage::disk('public')->delete($InfoSitio->igmActividadLegislativa);
                    $path1 = $files[0]->storeAs(
                        '/InformacionSitio/' . $nombre, // Directorio
                        $files[0]->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    // $request->merge(['igmActividadLegislativa' => $path1]);  
                    $InfoSitio->igmActividadLegislativa = $path1;
                                        
            }                           
            $slidePrincipal = $request->input('slide_principal');
            if ($slidePrincipal != null) {
                foreach ($request->input('slide_principal') as $key => $value) {
                    $slidePrincipal[$key]['informacion_sitio_id'] = $id;
                    $requestslidePrincipal = new Request($slidePrincipal[$key]);
                    if ($requestslidePrincipal->activo == 0) {
                        $imgAnterior = SlidePrincipalCv::find($requestslidePrincipal->id);
                        if (Storage::disk('public')->exists($imgAnterior->imagen))
                            Storage::disk('public')->delete($imgAnterior->imagen);
                        $imgAnterior->usermodifed = $request->user;
                        $imgAnterior->activo = 0;
                        $imgAnterior->save();
                    }
                }
            }
            if ($request->hasFile("newSlidePrincipal")) {
                $files = $request->file('newSlidePrincipal');

                foreach ($files as $file) {
                    // Se crea registro
                    $imgSlideP = new SlidePrincipalCv();
                    $imgSlideP->usercreated = $request->user;
                    $imgSlideP->informacion_sitio_id = $id;
                    $imgSlideP->activo = 1;
                    $path = $file->storeAs(
                        '/congresoVisible/' . $nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $imgSlideP->imagen = $path;
                    $imgSlideP->save();
                }
            }
            $slideSecundario = $request->input('slide_secundario');
            if ($slideSecundario != null) {
                foreach ($request->input('slide_secundario') as $key => $value) {
                    $slideSecundario[$key]['informacion_sitio_id'] = $id;
                    $requestslideSecundario = new Request($slideSecundario[$key]);
                    if ($requestslideSecundario->activo == 0) {
                        $imgAnterior = SlideSecundarioCv::find($requestslideSecundario->id);
                        if (Storage::disk('public')->exists($imgAnterior->imagen))
                            Storage::disk('public')->delete($imgAnterior->imagen);
                        $imgAnterior->usermodifed = $request->user;
                        $imgAnterior->activo = 0;
                        $imgAnterior->save();
                    }
                }
            }
            if ($request->hasFile('newSlideSecundario')) {
                $files = $request->file('newSlideSecundario');
                foreach ($files as $file) {
                    // Se crea registro
                    $imgSlideS = new SlideSecundarioCv();
                    $imgSlideS->usercreated = $request->user;
                    $imgSlideS->informacion_sitio_id = $id;
                    $imgSlideS->activo = 1;
                    $path = $file->storeAs(
                        '/InfoSitio/' . $nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $imgSlideS->imagen = $path;
                    $imgSlideS->save();
                }
            }        
            $InfoSitio->congresistas = $request->congresistas;
            $InfoSitio->nuestraDemocracia = $request->nuestraDemocracia;
            $InfoSitio->actividadLegislativa = $request->actividadLegislativa;
            $InfoSitio->comisiones = $request->comisiones;
            $InfoSitio->contenidoMultimedia = $request->contenidoMultimedia;
            $InfoSitio->proyectosDeLey = $request->proyectosDeLey;
            $InfoSitio->datos = $request->datos; 
            $InfoSitio->observacionesLegales = $request->observacionesLegales;
            $InfoSitio->usercreated = $request->user;
            $InfoSitio->usermodifed = $request->user;                   
            $InfoSitio->save(); 

            DB::commit();
            return response()->json(['message' => 'OK'], 202);
            } catch (\Exception $e) {
                DB::rollback();
                return response()->json(['message' => 'Error'], 422);
            }
        } else
            return response()->json($validator->errors(), 422);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
