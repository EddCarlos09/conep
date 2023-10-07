<?php

namespace App\Http\Controllers\CLIENTAPI;

use App\Http\Controllers\Controller;
use App\Models\ComisionMiembro;
use Illuminate\Http\Request;
use App\Models\Persona;
use App\Models\CongresistaDatosContacto;
use App\Models\CongresistaPerfil;
use App\Models\GrupoEdad;
use App\Models\ProyectoLeyAutor;
use App\Models\ProyectoLeyPonente;
use App\Models\ControlPoliticoCitante;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CongresistaController extends Controller
{

    public function index(Request $request)
    {

        $query = Persona::query()->where(
            'activo', 1
        );
       
        if ($request->has('genero') && !is_null($request["genero"]) && $request->input('genero') !== '-1') {
            $genero = $request->input('genero');
            $query->where(
                'genero_id',
                $genero
            );
        }
        
        if ($request->has('gradoEstudio') && !is_null($request["gradoEstudio"]) && $request->input('gradoEstudio') !== '-1') {
            $gradoEstudio = $request->input('gradoEstudio');
            $query->where(
                'grado_estudio_id',
                $gradoEstudio
            );
        }
        if ($request->has('partido') && !is_null($request["partido"]) && $request->input('partido') !== '-1') {
            $partido = $request->input('partido');
            $query->where(
                'partido_id',
                $partido
            );
        }
        if ($request->has('grupoEdad') && !is_null($request["grupoEdad"]) && $request->input('grupoEdad') !== '-1') {
            $grupoEdad = $request->input('grupoEdad');
            $itemGrupoEdad = GrupoEdad::find($grupoEdad);
            $fechaInicio = Carbon::now()->subYears($itemGrupoEdad->edad_inicial)->format("Y-m-d");
            $fechafinal = Carbon::now()->subYears($itemGrupoEdad->edad_final)->format("Y-m-d");
            $query->where('fechaNacimiento', '<=', $fechaInicio);
            $query->where('fechaNacimiento', '>=', $fechafinal);
        }
        if ($request->has('comision') && !is_null($request["comision"]) && $request->input('comision') !== '-1') {
            $comision = $request->input('comision');
            $itemComisionMiembro = ComisionMiembro::find($comision);
            if(isset($itemComisionMiembro)){
                $itemComisionMiembro = $itemComisionMiembro->pluck('persona_id')->all();
            }
            else{
                $itemComisionMiembro = [0];
            }
            $query->whereIn('id', $itemComisionMiembro);
        }
        
        if ($request->has('search') && !is_null($request["search"])) {
            $search = $request->input('search');
            $query->Where(
                function ($query) use ( $search) {
                    $query->where(DB::raw("CONCAT(`nombres`, ' ', `apellidos`)"), 'LIKE', "%".$search."%");
                }
            );
        }
        $items = $query->with(
            [
                'Imagenes', "ComisionMiembro", "Contactos", 'Partido'
            ]
        )->skip(($request->input('page') - 1) * $request->input('rows'))->take($request->input('rows'))->orderBy(
            'id', 'desc'
        )->get()->toJson(JSON_PRETTY_PRINT);

        return response($items);
    }
    public function totalrecords(Request $request)
    {
        $query = Persona::query()->where(
            'activo', 1
        );
       
        if ($request->has('genero') && !is_null($request["genero"]) && $request->input('genero') !== '-1') {
            $genero = $request->input('genero');
            $query->where(
                'genero_id',
                $genero
            );
        }
        
        if ($request->has('gradoEstudio') && !is_null($request["gradoEstudio"]) && $request->input('gradoEstudio') !== '-1') {
            $gradoEstudio = $request->input('gradoEstudio');
            $query->where(
                'grado_estudio_id',
                $gradoEstudio
            );
        }

        if ($request->has('partido') && !is_null($request["partido"]) && $request->input('partido') !== '-1') {
            $partido = $request->input('partido');
            $query->where(
                'partido_id',
                $partido
            );
        }

        if ($request->has('grupoEdad') && !is_null($request["grupoEdad"]) && $request->input('grupoEdad') !== '-1') {
            $grupoEdad = $request->input('grupoEdad');
            $itemGrupoEdad = GrupoEdad::find($grupoEdad);
            $fechaInicio = Carbon::now()->subYears($itemGrupoEdad->edad_inicial)->format("Y-m-d");
            $fechafinal = Carbon::now()->subYears($itemGrupoEdad->edad_final)->format("Y-m-d");
            $query->where('fechaNacimiento', '<=', $fechaInicio);
            $query->where('fechaNacimiento', '>=', $fechafinal);
        }
        if ($request->has('comision') && !is_null($request["comision"]) && $request->input('comision') !== '-1') {
            $comision = $request->input('comision');
            $itemComisionMiembro = ComisionMiembro::find($comision);
            if(isset($itemComisionMiembro)){
                $itemComisionMiembro = $itemComisionMiembro->pluck('persona_id')->all();
            }
            else{
                $itemComisionMiembro = [0];
            }
            $query->whereIn('id', $itemComisionMiembro);
        }
        
        if ($request->has('search') && !is_null($request["search"])) {
            $search = $request->input('search');
            $search = str_replace(' ', '%', $search);
            $query->Where(
                function ($query) use ( $search) {
                    $query->where(DB::raw("CONCAT(`nombres`, ' ',COALESCE(`apellidos`,''))"), 'LIKE', "%".$search."%")
                    ->orWhere(DB::raw("CONCAT(COALESCE(`apellidos`,''), ' ', `nombres`)"), 'LIKE', "%".$search."%");
                }
            );
        }
        $count = $query->count();

        return response($count);
    }


    public function show($id)
    {
        $Congresista = Persona::where('id', $id)
        ->with("LugarNacimiento", "GradoEstudio", "Genero", "Profesion", 'ComisionMiembro', 'Imagenes', 'Contactos', 'Partido')
        ->get()->first()
        ->toJson(JSON_PRETTY_PRINT);
        return response($Congresista, 200);
    }

    public function getAutoriasByIdCongresista(Request $request, $id){
        $search = $request->input("search");
        $ProyectoLeyAutor = ProyectoLeyAutor::where('persona_id', $id)
        ->with("proyectoLey")
        ->whereHas('proyectoLey', function($q) use ($search){
            $q->where('titulo', 'LIKE', '%' . $search . '%');
        })
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($ProyectoLeyAutor, 200);
    }

    public function totalrecordsAutoriasByIdCongresista(Request $request, $id){
        $search = $request->input("search");
        $ProyectoLeyAutor = ProyectoLeyAutor::where('persona_id', $id)
        ->with("proyectoLey")
        ->whereHas('proyectoLey', function($q) use ($search){
            $q->where('titulo', 'LIKE', '%' . $search . '%');
        })
        ->count();
        return response($ProyectoLeyAutor, 200);
    }

    public function getPonenciasByIdCongresista(Request $request, $id){
        $search = $request->input("search");
        $ProyectoLeyPonente = ProyectoLeyPonente::where('congresista_id', $id)
        ->with("estadoProyectoLey")
        ->whereHas('estadoProyectoLey', function($q) use ($search){
            $q->whereHas('ProyectoLey', function($q2) use ($search){
                $q2->where('proyecto_leys.titulo', 'LIKE', '%' . $search . '%');
            });
        })
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($ProyectoLeyPonente, 200);
    }
    public function totalrecordsPonenciasByIdCongresista(Request $request, $id){
        $search = $request->input("search");
        $ProyectoLeyPonente = ProyectoLeyPonente::where('congresista_id', $id)
        ->with("estadoProyectoLey")
        ->whereHas('estadoProyectoLey', function($q) use ($search){
            $q->whereHas('ProyectoLey', function($q2) use ($search){
                $q2->where('proyecto_leys.titulo', 'LIKE', '%' . $search . '%');
            });
        })
        ->count();
        return response($ProyectoLeyPonente, 200);
    }

    public function getCitantesByIdCongresista(Request $request, $id){
        $search = $request->input("search");
        $ControlPoliticoCitante = ControlPoliticoCitante::where('congresista_id', $id)
        ->with("controlPolitico")
        ->whereHas('controlPolitico', function($q) use ($search){
            $q->where('control_politicos.titulo', 'LIKE', '%' . $search . '%');
        })
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($ControlPoliticoCitante, 200);
    }
    public function totalrecordsCitantesByIdCongresista(Request $request, $id){
        $search = $request->input("search");
        $ControlPoliticoCitante = ControlPoliticoCitante::where('congresista_id', $id)
        ->with("controlPolitico")
        ->whereHas('controlPolitico', function($q) use ($search){
            $q->where('control_politicos.titulo', 'LIKE', '%' . $search . '%');
        })
        ->count();
        return response($ControlPoliticoCitante, 200);
    }
}
