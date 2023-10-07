<?php

namespace App\Http\Controllers\CLIENTAPI;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\AgendaLegislativa;
use App\Models\AgendaLegislativaActividad;
use App\Models\AgendaLegislativaComision;
use App\Models\Votacion;
use App\Models\ControlPolitico;
use App\Models\Eleccion;
use App\Models\Partido;
use DB;
class ActividadesLegislativasController extends Controller
{
    public function getAgenda(Request $request){
        $fecha=$request->input('fecha');
        $tactividad=$request->input('idtactividad');
        $corporacion=$request->input('idcorporacion');
        $comision=$request->input('idcomision');
        $AgendaLegislativaComision = AgendaLegislativaActividad::select('id','agenda_legislativa_id','titulo','destacado','tipo_actividad_id','proyecto_ley_id','activo')
        ->with('agenda','tipoActividad')
        ->whereHas('agenda', function($q) use ($fecha,$corporacion,$comision){           
                $q->whereDate('fecha',$fecha)
                ->whereHas('agendaComision',function($u) use ($corporacion,$comision){
                    $u->where('comision_id', ($comision != "-1") ? '=' : '!=', $comision); 
                });              
        })
        ->where('activo', $request->input('idFilter'))
        ->where('destacado', 1)                 
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
        $tactividad=$request->input('idtactividad');
        $corporacion=$request->input('idcorporacion');
        $comision=$request->input('idcomision');
        $AgendaLegislativaActividad = AgendaLegislativaActividad::select('id','agenda_legislativa_id')
        ->with('agenda','tipoActividad')                    
        ->whereHas('agenda', function($q) use ($fecha,$corporacion,$comision){            
                $q->whereDate('fecha', $fecha)
                ->whereHas('agendaComision',function($u) use ($corporacion,$comision){
                    $u->where('comision_id', ($comision != "-1") ? '=' : '!=', $comision); 
                });              
        })            
        ->where('activo', $request->input('idFilter'))
        ->where('destacado', 1)
        ->where('tipo_actividad_id', ($tactividad != "-1") ? '=' : '!=', $tactividad)                     
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')            
        ->count();
        return response($AgendaLegislativaActividad, 200);
    }
   
    public function getAgendaActividad(Request $request){
            $fecha=$request->input('fecha');
            $tactividad=$request->input('idtactividad');
            $corporacion=$request->input('idcorporacion');
            $comision=$request->input('idcomision');
            $AgendaLegislativaComision = AgendaLegislativaActividad::select('id','agenda_legislativa_id','titulo','destacado','tipo_actividad_id','proyecto_ley_id','activo')        
            ->with('agenda','tipoActividad')
            ->whereHas('agenda', function($q) use ($fecha,$corporacion,$comision){               
                    $q->whereDate('fecha',$fecha)
                    ->whereHas('agendaComision',function($u) use ($corporacion,$comision){
                        $u->where('comision_id', ($comision != "-1") ? '=' : '!=', $comision); 
                    });                
            })

            ->where('activo', $request->input('idFilter'))
            ->where('tipo_actividad_id', ($tactividad != "-1") ? '=' : '!=', $tactividad)                                    
            ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
            ->skip(($request->input('page') - 1) * $request->input('rows'))
            ->take($request->input('rows'))       
            ->orderBy('id','asc')
            ->get()
            ->toJson(JSON_PRETTY_PRINT);
        
        return response($AgendaLegislativaComision, 200);
    }

    public function totalrecordsAgendaActividad(Request $request){
       
        $fecha=$request->input('fecha');
        $tactividad=$request->input('idtactividad');
        $corporacion=$request->input('idcorporacion');
        $comision=$request->input('idcomision');
            $AgendaLegislativaActividad = AgendaLegislativaActividad::select('id','agenda_legislativa_id')
            ->with('agenda','tipoActividad')                    
            ->whereHas('agenda', function($q) use ($fecha,$corporacion,$comision){
                
                    $q->whereDate('fecha', $fecha)
                    ->whereHas('agendaComision',function($u) use ($corporacion,$comision){
                        $u->where('comision_id', ($comision != "-1") ? '=' : '!=', $comision); 
                    });  
                
            })            
            ->where('activo', $request->input('idFilter'))   
            ->where('tipo_actividad_id', ($tactividad != "-1") ? '=' : '!=', $tactividad)             
            ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')            
            ->count();
            return response($AgendaLegislativaActividad, 200);
        
        
    }

    public function getAgendaDetalle($id){
               
        $agendaactividad = AgendaLegislativaActividad::select(
            'id',        
            'agenda_legislativa_id',            
            'titulo',            
            'descripcion',
            'destacado',
            'tipo_actividad_id',
            'proyecto_ley_id',           
            'activo')
            ->with('agenda','tipoActividad','selected')            
            ->where('id', $id)
            ->get()
            ->toJson(JSON_PRETTY_PRINT);
            return response($agendaactividad, 200);
    }
    public function getDataByYearAndMonth(Request $request){
        $destacado=$request->input('destacado');
        $year = $request->input('year');
        $month = $request->input('month');
        $dataCalendar = AgendaLegislativa::with('agendaActividad')
        ->whereHas('agendaActividad', function($q) use ($destacado){
           if($destacado)
            $q->where('destacado', $destacado);
        })
        ->where('activo', 1) 
        ->whereYear('fecha', '=', $year)
        ->whereMonth('fecha', '=', $month)               
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($dataCalendar, 200);
    }
}
