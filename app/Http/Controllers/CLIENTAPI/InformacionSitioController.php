<?php

namespace App\Http\Controllers\CLIENTAPI;

use Illuminate\Http\Request;
use App\Models\InformacionSitio;
use App\Models\SlidePrincipalCv;
use App\Http\Controllers\Controller;
use App\Models\SlideSecundarioCv;

class InformacionSitioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function InformacionSitioHome()
    {
        $infoSitio = InformacionSitio::select('id', 'imgPrincipal', 'congresistas', 'nuestraDemocracia', 'actividadLegislativa', 'comisiones', 'contenidoMultimedia', 'proyectosDeLey', 'datos','observacionesLegales','activo',)
        ->with('slideSecundario')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($infoSitio, 200);
    }

    public function slideCongresoVisible()
    {
        $slide = InformacionSitio::select('id')
        ->with('slidePrincipal', 'slideSecundario')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($slide, 200);        
    }
}
