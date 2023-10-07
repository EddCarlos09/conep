<?php

namespace App\Http\Controllers\CLIENTAPI;

use App\Http\Controllers\Controller;
use App\Models\ProyectoLey;
use App\Models\ProyectoLeyAutor;
use App\Models\ProyectoLeyPonente;
use App\Models\VotacionCongresista;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProyectoLeyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index (Request $request)
    {

        $query = ProyectoLey::query()->where(
            'activo', 1
        );
        if ($request->has('corporacion') && !is_null($request["corporacion"]) && $request->input('corporacion') !== '0') {
            $query->where(
                'corporacion_id',
                $request->corporacion
            );
        }
        if ($request->has('cuatrienio') && !is_null($request["cuatrienio"]) && $request->input('cuatrienio') !== '0') {
            $query->where(
                'cuatrienio_id',
                $request->cuatrienio
            );
        }
        if ($request->has('legislatura') && !is_null($request["legislatura"]) && $request->input('legislatura') !== '0') {
            $query->where(
                'legislatura_id', $request->legislatura
            );
        }
        if ($request->has('iniciativa') && !is_null($request["iniciativa"]) && $request->input('iniciativa') !== '0') {
            $query->where(
                'iniciativa_id', $request->iniciativa
            );
        }
        if ($request->has('tema') && !is_null($request["tema"]) && $request->input('tema') !== '0') {
            $tema_id = $request->input('tema');
            $query->where(
                function ($query) use (
                    $tema_id
                ) {
                    $query->where(
                        'tema_id_principal', $tema_id
                    )->orWhere(
                        'tema_id_secundario', $tema_id
                    );
                }
            );
        }
        // if ($request->has('tipo') && !is_null($request["tipo"]) && $request->input('tipo') !== '0') {
        //     $query->where(
        //         'tipo_proyecto_id', $request->tipo
        //     );
        // }
        if ($request->has('estado') && !is_null($request["estado"]) && $request->input('estado') !== '0') {
            $estado_id = $request->input('estado');
            $query->Where(
                function ($query) use (
                    $estado_id
                ) {
                    $query->WhereHas(
                        'ProyectoLeyEstado', function ($query) use (
                        $estado_id
                    ) {
                        $query->where(
                            'estado_proyecto_ley_id', $estado_id
                        );
                    }
                    );
                }
            );
        }
        if ($request->has('search') && !is_null($request["search"])) {
            $search = $request->input('search');
            $query->Where(
                function ($query) use (
                    $search
                ) {
                    $query->Where(
                        'numero_camara', 'like', '%' . $search . '%'
                    )->orWhere(
                        'titulo', 'like', '%' . $search . '%'
                    )->orWhere(
                        function ($query) use (
                            $search
                        ) {
                            $query->orWhereHas(
                                'ProyectoLeyAutorLegislativos', function ($query) use ( $search ) {
                                $query->WhereHas(
                                    'Congresista', function ($query) use ( $search ) {
                                    $query->WhereHas(
                                        'persona', function ($query) use ( $search ) {
                                        $query->where(
                                            'nombres', 'like', '%' . $search . '%'
                                        )->OrWhere(
                                            'apellidos', 'like', '%' . $search . '%'
                                        );
                                    });
                                });
                            });
                        }
                    )->orWhere(function ($query) use($search){
                        $query->orWhereHas('ProyectoLeyAutorPersonas', function ($query) use($search){
                            $query->WhereHas(
                                'persona', function ($query) use ( $search  ) {
                                $query->where(
                                    'nombres', 'like', '%' . $search . '%'
                                )->OrWhere(
                                    'apellidos', 'like', '%' . $search . '%'
                                );
                            });
                        });
                    });
                }
            );
        }

        if ($request->has('esLey') && !is_null($request["esLey"])) {
            $query->where(
                'esLey', $request->esLey
            );
        }

        $items = $query->with(
            [
                'Legislatura',
                'Cuatrienio',
                'TipoProyectoLey',
                'Iniciativa',
                'ProyectoLeyAutorPersonas',
                'ProyectoLeyEstado'
            ]
        )->skip(($request->input('page') - 1) * $request->input('rows'))->take($request->input('rows'))->orderBy(
            'id', 'desc'
        )->get()->toJson(JSON_PRETTY_PRINT);

        return response($items);
    }

    public function getRecientesEditados(){
        $items = ProyectoLey::with('Legislatura','Cuatrienio','TipoProyectoLey','Iniciativa','ProyectoLeyAutorPersonas','ProyectoLeyEstado')
        ->where('activo', 1)
        ->orderBy('updated_at','desc')
        ->limit(5)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items, 200);
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
        $item = ProyectoLey::where('id', $id)
            ->with(['Legislatura',
                'Cuatrienio',
                'TipoProyectoLey',
                'Iniciativa',
                'TemaPrincipal',
                'TemaSecundario',
                'ProyectoLeyAutorPersonas',
                'ProyectoLeyDocumentos',
                'ProyectoLeyEstado'])
            ->get()
            ->first();

        return response($item);
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
        $search = $request->input('search');

        $cuatrienio = $request->input('cuatrienio');
        $legislatura = $request->input('legislatura');
        $iniciativa = $request->input('iniciativa');
        $tema = $request->input('tema');
        $estado = $request->input('estado');
        $tipo = $request->input('tipo');
        $esLey = $request->input('esLey');

        $counts = ProyectoLey::select([
                                         'id',
                                         'iniciativa_id',
                                         'legislatura_id',
                                         'cuatrienio_id',
                                         'tipo_proyecto_id',
                                         'titulo',
                                         'numero_camara',
                                         'tema_id_principal',
                                         'tema_id_secundario',
                                         'sinopsis',
                                         'activo',
                                     ])
                            ->where('activo', '1')
                            ->where('cuatrienio_id', ($cuatrienio != "0") ? '=' : '!=', $cuatrienio)
                            ->where('legislatura_id', ($legislatura != "0") ? '=' : '!=', $legislatura)
                            ->where('iniciativa_id', ($iniciativa != "0") ? '=' : '!=', $iniciativa)
                            ->where('tema_id_principal', ($tema != "0") ? '=' : '!=', $tema)
                            ->where('tema_id_secundario', ($tema != "0") ? '=' : '!=', $tema)
                            //->where('tipo_proyecto_id', ($tipo != "0") ? '=' : '!=', $tipo)
                            ->where('esLey', $esLey)
                            ->where('titulo', 'LIKE', '%' . $request->input('search') . '%' )
                            ->with('Legislatura', 'Cuatrienio', 'TipoProyectoLey', 'EstadoProyectoLey', 'Iniciativa')
                            ->orderBy('id','desc')
                            ->count();

        return response($counts);
    }

    public function getAutoresFilter(Request $request){
        $nombre = $request->input('nombre');
        $proyecto = $request->input('proyecto');
        $items = ProyectoLeyAutor::select('proyecto_ley_autors.congresista_id')
        ->join('congresistas', 'proyecto_ley_autors.congresista_id', 'congresistas.id')
        ->where('congresistas.activo','1')
        ->where('proyecto_ley_autors.proyecto_ley_id',$proyecto)
        ->where('congresistas.partido_id', ($partido != "0") ? '=' : '!=', $partido)
        ->where('congresistas.nombre', 'LIKE', '%' . $nombre . '%' )
        ->with('congresista')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items, 200);
    }

    public function getCountVotos(Request $request){
        $votacion = $request->input('votacion');

        $countVotos = VotacionCongresista::select(DB::raw('tipo_respuesta_votacion_id, count(*) as conteo'))
        ->where('votacion_id', ($votacion != "0") ? '=' : '!=', $votacion)
        ->groupBy('tipo_respuesta_votacion_id')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($countVotos, 200);
    }
}
