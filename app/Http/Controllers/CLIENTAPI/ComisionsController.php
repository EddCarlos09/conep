<?php

namespace App\Http\Controllers\CLIENTAPI;

use App\Http\Controllers\Controller;
use App\Models\Comision;
use App\Models\ComisionMiembro;
use App\Models\ComisionSecretario;
use App\Models\ControlPolitico;
use App\Models\ProyectoLeyEstado;
use Illuminate\Http\Request;
use App\Models\AgendaLegislativaActividad;
use App\Models\AgendaLegislativa;

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
        $corporacion = $request->input('corporacion');
        $tipoComision = $request->input('tipoComision');
        $comision = Comision::select('id','nombre','tipo_comision_id', 'descripcion', 'activo')
        ->with('tipoComision','comisionImagen', "comisionDatosContacto")
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        // ->where('corporacion_id', ($corporacion != "-1") ? '=' : '!=', $corporacion)
        ->where('tipo_comision_id', ($tipoComision != "0") ? '=' : '!=', $tipoComision)
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
        //
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

    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        // $corporacion = $request->input('corporacion');
        $tipoComision = $request->input('tipoComision');
        $count = Comision::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        // ->where('corporacion_id', ($corporacion != "0") ? '=' : '!=', $corporacion)
        ->where('tipo_comision_id', ($tipoComision != "0") ? '=' : '!=', $tipoComision)
        ->count();
        return response($count, 200);
    }

    public function getControlPoliticoFilter(Request $request){
        $nombre = $request->input('nombre');
        $comision = $request->input('comision');
        $items = ControlPolitico::where('activo', '1')
        ->where('titulo', 'LIKE', '%' . $nombre . '%' )
        ->where('comision_id',$comision)
        ->with('estadoControlPolitico')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items, 200);
    }

    public function getProyectoLeyFilter(Request $request){
        $nombre = $request->input('nombre');
        $comision = $request->input('comision');
        $items = ProyectoLeyEstado::select('proyecto_ley_estados.proyecto_ley_id', 'proyecto_leys.titulo','proyecto_leys.numero_camara','proyecto_leys.numero_senado')
            ->join('proyecto_ley_comisions', 'proyecto_ley_estados.id', 'proyecto_ley_comisions.proyecto_ley_estado_id')
            ->join('proyecto_leys', 'proyecto_ley_estados.proyecto_ley_id', 'proyecto_leys.id')
            ->where('proyecto_leys.activo', '1')
            ->where('proyecto_ley_comisions.comision_id', $comision)
            ->where('proyecto_leys.titulo', 'LIKE', '%' . $nombre . '%')
            ->get()
            ->toJson(JSON_PRETTY_PRINT);

        return response($items);
    }

    public function getSecretariosFilter(Request $request){
        $nombre = $request->input('nombre');
        $comision = $request->input('comision');
        $items = ComisionSecretario::select('comision_secretarios.persona_id')
        ->join('personas', 'comision_secretarios.persona_id', 'personas.id')
        ->where('personas.activo','1')
        ->where('comision_secretarios.comision_id',$comision)
        ->where(function ($query) use ($nombre) {
            $query->where('personas.nombres', 'LIKE', '%' . $nombre . '%' )
                  ->orWhere('personas.apellidos', 'LIKE', '%' . $nombre . '%' );
        })
        ->where('comision_secretarios.activo',1)
        ->with('persona')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items, 200);
    }

    public function getMiembrosFilter(Request $request){
        $nombre = $request->input('nombre');
        $comision = $request->input('comision');
        $partido = $request->input('partido');
        $mesa = $request->input('mesa');
        $items = ComisionMiembro::select('comision_miembros.persona_id')
        // ->join('congresistas', 'comision_miembros.congresista_id', 'congresistas.id')
        // ->join('personas', 'congresistas.persona_id', 'personas.id')
        // ->where('congresistas.activo','1')
        // ->where('comision_miembros.cargo_legislativo_id_comision', ($mesa == '1') ? '!=' : '=', NULL)
        ->where('comision_miembros.comision_id',$comision)
        // ->where('congresistas.partido_id', ($partido != "0") ? '=' : '!=', $partido)
        // ->where(function ($query) use ($nombre) {
        //     $query->where('personas.nombres', 'LIKE', '%' . $nombre . '%' )
        //           ->orWhere('personas.apellidos', 'LIKE', '%' . $nombre . '%' );
        // })
        ->where('comision_miembros.activo',1)
        ->with('persona')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items, 200);
    }
    public function getAgenda(Request $request){
        $fecha=$request->input('fecha');
        $tactividad=$request->input('idactividad'); 
        // $corporacion=$request->input('idcorporacion');        
        $comision=$request->input('idcomision');
        $AgendaLegislativaComision = AgendaLegislativaActividad::select('id','agenda_legislativa_id','titulo','destacado','tipo_actividad_id','proyecto_ley_id','activo')        
        ->with('agenda','tipoActividad')
        ->whereHas('agenda', function($q) use ($fecha,$comision){            
            $q->whereDate('fecha', $fecha)
            ->whereHas('agendaComision',function($u) use ($comision){
                $u->where('comision_id', ($comision != "-1") ? '=' : '!=', $comision);                     
            });              
        })
        ->where('activo', 1)                
        ->where('tipo_actividad_id', ($tactividad != "-1") ? '=' : '!=', $tactividad)                       
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))       
        ->orderBy('id','asc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
    
        return response($AgendaLegislativaComision, 200);
     }
 

    public function totalrecordsAgenda(Request $request){
        $fecha=$request->input('fecha');
        $tactividad=$request->input('idactividad');
        // $corporacion=$request->input('idcorporacion');      
        $comision=$request->input('idcomision');
        $AgendaLegislativaActividad = AgendaLegislativaActividad::select('id','agenda_legislativa_id')
        ->with('agenda','tipoActividad')                    
        ->whereHas('agenda', function($q) use ($fecha,$comision){            
                $q->whereDate('fecha', $fecha)
                ->whereHas('agendaComision',function($u) use ($comision){
                    $u->where('comision_id', ($comision != "-1") ? '=' : '!=', $comision);                     
                });              
        })            
        ->where('activo', 1)        
        ->where('tipo_actividad_id', ($tactividad != "-1") ? '=' : '!=', $tactividad)                     
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')            
        ->count();
        return response($AgendaLegislativaActividad, 200);
    }
    public function getDataByYearAndMonth(Request $request){
        $destacado=1;
        $tactividad=$request->input('idactividad');
        // $corporacion=$request->input('idcorporacion');       
        $comision=$request->input('idcomision');
        $dataCalendar = AgendaLegislativa::with('agendaActividad')
        ->whereHas('agendaComision', function($q) use ($comision){                
            $q->where('comision_id', ($comision != "-1") ? '=' : '!=', $comision);
        }) 
        ->whereHas('agendaActividad', function($q) use ($tactividad){                
            $q->where('tipo_actividad_id', ($tactividad != "-1") ? '=' : '!=', $tactividad);
        })
        ->where('activo', 1) 
        ->whereYear('fecha', '=', $request->year)
        ->whereMonth('fecha', '=', $request->month)               
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($dataCalendar, 200);
    }
}
