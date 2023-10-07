<?php

namespace App\Http\Controllers\CLIENTAPI;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;
use App\Messages;
use Carbon\Carbon;
use DB;
use Illuminate\Support\Facades\Storage;
use EloquentBuilder;
use App\Models\InformesPnud;
use App\Models\BalanceCuatrienio;
use App\Models\Opinion;
use App\Models\OpinionCongresista;
use App\Models\Podcast;
use App\Models\Multimedia;

class ContenidoMultimediaController extends Controller
{
    public function totalrecordsInformesPNUD(Request $request){
        $filter = $request->input('idFilter');
        $count = InformesPnud::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
            ->where('nombre', 'LIKE', '%' . $request->input('search') . '%')
            ->count();

        return response($count, 200);
    }
    public function getInformesPNUD(Request $request){
        $informes = InformesPnud::select('id','nombre','activo')
        ->where('activo',$request->input('idFilter'))
        ->with("documentosInforme")
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%')
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($informes,200);
    }
       
    public function totalrecordsBalanceCuatrienio(Request $request){
        $filter = $request->input('idFilter');
        $yearInicio = $request->input('yearInicio');
        $count = BalanceCuatrienio::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
            ->where('yearInicio', ($yearInicio != "-1") ? '=' : '!=', $yearInicio)
            ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
            ->count();

        return response($count, 200);
    }
    public function getBalanceCuatrienio(Request $request){
        $filter = $request->input('idFilter');
        $yearInicio = $request->input('yearInicio');
        $items = BalanceCuatrienio::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('yearInicio', ($yearInicio != "-1") ? '=' : '!=', $yearInicio)
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items, 200);
    }
    public function totalrecordsOpiniones(Request $request){
        $filter = $request->input('idFilter');
        $equipo = $request->input('equipo');
        $tipoPublicacion = $request->input('tipopublicacion');
        $count = Opinion::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
            ->where('equipo_id', ($equipo != "-1") ? '=' : '!=', $equipo)
            ->where('tipo_publicacion_id', ($tipoPublicacion != "-1") ? '=' : '!=', $tipoPublicacion)
            ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
            ->count();

        return response($count, 200);
    }
    public function getOpiniones(Request $request){
        $equipo = $request->input('equipo');
        $tipoPublicacion = $request->input('tipopublicacion');
        $opinion = Opinion::select('id','titulo','equipo_id', 'tipo_publicacion_id','fechaPublicacion','activo')
        ->with("OpinionImagen", "tipoPublicacion", "equipo")
        ->where('activo', $request->input('idFilter'))
        ->where('equipo_id', ($equipo != "-1") ? '=' : '!=', $equipo)
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->where('tipo_publicacion_id', ($tipoPublicacion != "-1") ? '=' : '!=', $tipoPublicacion)
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')        
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($opinion,200);
    }
    public function getOpinioneById($id){
        $opinion = Opinion::select('id','titulo','equipo_id','tipo_publicacion_id','fechaPublicacion','resumen','opinion','activo')
        ->with('OpinionImagen',"equipo","tipoPublicacion")   
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($opinion,200);
    }
    public function totalrecordsOpinionesCongresistas(Request $request){
        $filter = $request->input('idFilter');
        $congresista = $request->input('congresista');
        $tipoPublicacion = $request->input('tipopublicacion');
        $count = OpinionCongresista::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
            ->where('persona_id', ($congresista != "-1") ? '=' : '!=', $congresista)
            ->where('tipo_publicacion_id', ($tipoPublicacion != "-1") ? '=' : '!=', $tipoPublicacion)
            ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
            ->count();

        return response($count, 200);
    }
    public function getOpinionesCongresistas(Request $request){
        $congresista = $request->input('congresista');
        $tipoPublicacion = $request->input('tipopublicacion');
        $opinionCongresista = OpinionCongresista::select('id','titulo','persona_id', 'tipo_publicacion_id','fechaPublicacion','activo')
        ->with("OpinionCongresistaImagen", "tipoPublicacion", "Persona")
        ->where('persona_id', ($congresista != "-1") ? '=' : '!=', $congresista)
        ->where('tipo_publicacion_id', ($tipoPublicacion != "-1") ? '=' : '!=', $tipoPublicacion)
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->where('activo',$request->input('idFilter'))
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($opinionCongresista);
    }
    public function getOpinioneCongresistaById($id){
        $opinionCongresista = OpinionCongresista::select('id','titulo','persona_id','tipo_publicacion_id','fechaPublicacion','resumen','opinion','activo')
        ->with('OpinionCongresistaImagen','Persona','tipoPublicacion')    
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($opinionCongresista,200);
    }
    public function totalrecordsPodcast(Request $request){
        $filter = $request->input('idFilter');
        $count = Podcast::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->count();
        return response($count, 200);

    }
    public function getPodcast(Request $request){
        $filter = $request->input('idFilter');
        $items = Podcast::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->with("podcastImagen")
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($items, 200);
    }
    public function totalrecordsMultimedia(Request $request){
        $filter = $request->input('idFilter');
        $tipoMultimedia = $request->input('multimedia');
        $count = Multimedia::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('tipo_multimedia_id', ($tipoMultimedia != "-1") ? '=' : '!=', $tipoMultimedia)
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->count();
        return response($count, 200);

    }
    public function getMultimedia(Request $request){
        $tipoMultimedia = $request->input('multimedia');
        $multimedia = Multimedia::select('id','titulo', 'tipo_multimedia_id','fechaPublicacion','descripcion','activo')
        ->with("MultimediaArchivo", 'tipoMultimedia')
        ->where('tipo_multimedia_id', ($tipoMultimedia != "-1") ? '=' : '!=', $tipoMultimedia)
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->where('activo', $request->input('idFilter'))
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($multimedia,200);
    }
}
