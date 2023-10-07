<?php

namespace App\Http\Controllers\CLIENTAPI;

use App\Http\Controllers\Controller;
use App\Models\CongresoVisible;
use App\Models\CongresoVisibleAliado;
use App\Models\CongresoVisibleEquipo;
use Illuminate\Http\Request;

class CongresoVisibleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $congresovisible = CongresoVisible::select('id','queEs','objetivos','historiaymision',
        'nuestroFuturo', 'nuestroReto','activo') 
        ->with('congresoVisibleImagen','congresoVisibleDatosContacto')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($congresovisible,200);  
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function indexEquipo()
    {
        $Equipo = CongresoVisibleEquipo::select('id','nombre','descripcion','congreso_visible_id','activo')        
        ->with('equipoImagen','equipoDatosContacto') 
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($Equipo,200);    
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function indexAliado()
    {
        $Aliados = CongresoVisibleAliado::select('id','nombre','urlexterna')        
        ->with('aliadoImagen') 
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($Aliados,200); 
    }
}
