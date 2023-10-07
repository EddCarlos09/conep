<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Alcance;
use App\Models\BalanceCuatrienio;
use App\Models\BlogNd;
use App\Models\CargoIntegrante;
use App\Models\CargoLegislativo;
use App\Models\Circunscripcion;
use App\Models\Comision;
use App\Models\ComisionCargoCongresista;
use App\Models\ComisionMiembro;
use App\Models\ComisionTipoCongresista;
use App\Models\Congresista;
use App\Models\CongresoVisibleEquipo;
use App\Models\ControlPolitico;
use App\Models\Corporacion;
use App\Models\Cuatrienio;
use App\Models\Curul;
use App\Models\DatosContacto;
use App\Models\Departamento;
use App\Models\EstadoControlPolitico;
use App\Models\EstadoProyectoLey;
use App\Models\Genero;
use App\Models\GlosarioLegislativo;
use App\Models\GradoEstudio;
use App\Models\GrupoEdad;
use App\Models\Iniciativa;
use App\Models\Legislatura;
use App\Models\Municipio;
use App\Models\NivelDificultadBlogNd;
use App\Models\OpinionCongresista;
use App\Models\Partido;
use App\Models\Persona;
use App\Models\Profesion;
use App\Models\ProyectoLey;
use App\Models\Secretario;
use App\Models\Tema;
use App\Models\TemaBlogNd;
use App\Models\TemaControlPolitico;
use App\Models\TipoActividadAgendaLegislativa;
use App\Models\TipoCitacion;
use App\Models\TipoComision;
use App\Models\TipoFechaProyectoLey;
use App\Models\TipoInvestigacion;
use App\Models\TipoLegislativo;
use App\Models\TipoMultimedia;
use App\Models\TipoProyecto;
use App\Models\TipoPublicacion;
use App\Models\TipoPublicacionProyectoLey;
use App\Models\TipoRespuestaVotacion;
use App\Models\TipoSucursal;
use App\Models\TipoUsuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\TipoVotacion;
use App\Models\ClaseVotacion;
use App\Models\ProyectoLeyEstado;

class UtilsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getTipoLegislativo()
    {
        //
    }

    public function getComboDatosContacto()
    {
        $items = DatosContacto::select(
            'id',
            'nombre'
        )->with("datosContactoImagen")->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboComisionTipoCongresista()
    {
        $items = ComisionTipoCongresista::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboGradoEstudio()
    {
        $items = GradoEstudio::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboCuatrienio()
    {
        $items = Cuatrienio::select([
            'id',
            'nombre',
            'fechaInicio',
            'fechaFin'
        ])->where(
                'activo',
                1
            )->orderBy('fechaInicio')->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboPartido()
    {
        $items = Partido::select(
            'id',
            'nombre'
        )->with("partidoImagen")->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboPartidoPorCongresistaEnComision(Request $request)
    {
        $idcomision = $request->input('idcomision');
        $mesa = $request->input('mesa');
        $items = Partido::select('partidos.id','partidos.nombre')
        ->with("partidoImagen")
        ->join('congresistas','congresistas.partido_id','partidos.id')
        ->join('comision_miembros','comision_miembros.congresista_id','congresistas.id')
        ->where('partidos.activo',1)
        ->where('comision_miembros.comision_id', $idcomision)
        ->where('comision_miembros.cargo_legislativo_id_comision', ($mesa == '1') ? '!=' : '=', NULL)
        ->distinct()
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items,200);
    }
    public function getComboPartidoPorCongresistaEnProyecto(Request $request)
    {
//        $proyecto = $request->input('proyecto');
//        $items = Partido::select('partidos.id','partidos.nombre')
//        ->with("partidoImagen")
//        ->join('congresistas','congresistas.partido_id','partidos.id')
//        ->join('proyecto_ley_autors','proyecto_ley_autors.congresista_id','congresistas.id')
//        ->where('partidos.activo',1)
//        ->where('proyecto_ley_autors.proyecto_ley_id', $proyecto)
//        ->get()
//        ->toJson(JSON_PRETTY_PRINT);
//
//        return response($items,200);
    }
    public function getComboCorporacion()
    {
        $items = Corporacion::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboTipoComision(Request $request)
    {
        $idCorporacion = "0";
        if ($request->input('idcorporacion'))
        {
            $idCorporacion = $request->input('idcorporacion');
        }
        $items = TipoComision::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboComisiones(Request $request)
    {
        $idTipoComision = "0";
        $idCorporacion = "0";
        if ($request->input('idtipocomision'))
        {
            $idTipoComision = $request->input('idtipocomision');
        }
        if ($request->input('idcorporacion'))
        {
            $idCorporacion = $request->input('idcorporacion');
        }
        $items = Comision::select('id','nombre')
        ->where('tipo_comision_id',($idTipoComision != "0") ? "=" : "!=",$idTipoComision)
        // ->where('corporacion_id',($idCorporacion != "0") ? "=" : "!=",$idCorporacion)
        ->where('activo',1)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items,200);
    }
    public function getComboLegislatura(Request $request)
    {
        $cuatrienio = $request->get('cuatrienio');
        if($cuatrienio !== null){
            $items = Legislatura::select('id', 'nombre')
            ->where('cuatrienio_id', $cuatrienio)
            ->where('activo', 1)
            ->get()
            ->toJson(JSON_PRETTY_PRINT);

            return \response(
                $items,
                200
            );
        }else{
            $items = Legislatura::select(
                'id',
                'nombre'
            )->where(
                    'activo',
                    1
                )->get()->toJson(JSON_PRETTY_PRINT);

            return \response(
                $items,
                200
            );
        }
    }
    public function getComboCargoCongresista()
    {
        $items = CargoLegislativo::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->orderBy('id','desc')->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboCargoMiembrosCongresista()
    {
        $items = ComisionCargoCongresista::select('id','nombre')
        ->where('activo',1)
        ->where('comision_tipo_congresista_id','!=',1)
        ->orderBy('id','desc')
        ->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboCargoMesaDirectivaCongresista()
    {
        $items = ComisionCargoCongresista::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->where(
                'comision_tipo_congresista_id',
                1
            )->orderBy('id','desc')->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboCongresistasComision(Request $request)
    {
        $corporacion_id = $request->input('corporacion');
        $cuatrienio_id = $request->input('cuatrienio');
        $items = Congresista::select(
            'id',
            'persona_id'
        )->with("persona")->where(
                'activo',
                1
            )->where(
                'corporacion_id',
                $corporacion_id
            )
            ->where('cuatrienio_id', $cuatrienio_id)
            ->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboComisionMiembro(Request $request){
        $comision = $request->input('idComision');
        $cuatrienio = $request->get('idCuatrienio');
        // $imagenes;
        $items = ComisionMiembro::with("congresista")
        ->where('comision_id', ($comision != "0") ? '=' : '!=', $comision)
        ->where('cuatrienio_id', ($cuatrienio != "0") ? '=' : '!=', $cuatrienio)
        ->where('activo', 1)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($items, 200);
    }
    public function getComboSecretariosComision(Request $request)
    {
        $items = Secretario::select(
            'id',
            'nombre'
        )->with("secretarioImagen")->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboCongresistas()
    {
        $items = Congresista::select(
            'id',
            'nombre'
        )->with("persona")->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboTipoCitacion()
    {
        $items = TipoCitacion::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getDataCuruls(Request $request)
    {
        $items = Congresista::select(
            'id',
            'corporacion_id',
            'cuatrienio_id',
            'partido_id',
            'curul_id',
        )->with(
                'partido',
                'curul',
                'cuatrienio',
                'corporacion',
                'persona'
            )->where(
                'activo',
                1
            )->where(
                'cuatrienio_id',
                $request->get('cuatrienio')
            )->where(
                'corporacion_id',
                $request->get('corporacion')
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }

    public function getCurules(Request $request)
    {
        $cuatrienio = $request->get('cuatrienio');
        $corporacion = $request->get('corporacion');
        $items = Curul::with(
            [
                'congresista' => function ($q) use ($cuatrienio, $corporacion)
                {
                    $q->where('cuatrienio_id',$cuatrienio);
                    $q->where('corporacion_id',$corporacion);
                }
            ]
        )
        ->where('activo',1)
        ->where('corporacion_id',$corporacion)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getCurulesInVotacion(Request $request)
    {
        $votacion = $request->get('votacion');
        $cuatrienio = $request->get('cuatrienio');
        $corporacion = $request->get('corporacion');
        $items = Curul::with(
            [
                'congresista' => function ($q) use ($cuatrienio, $corporacion, $votacion)
                {
                    $q->where('congresistas.cuatrienio_id',$cuatrienio);
                    $q->where('congresistas.corporacion_id',$corporacion);
                    $q->join('votacion_congresistas','votacion_congresistas.congresista_id', 'congresistas.id');
                    $q->where('votacion_congresistas.votacion_id',$votacion);
                    // Se añadi tipo de respuesta elegida desde react
                }
            ]
        )
        ->where('curuls.activo',1)
        ->where('curuls.corporacion_id',$corporacion)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items,200);
    }

    public function getComboNivelBlog()
    {
        $items = NivelDificultadBlogNd::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }

    public function getComboTemaBlog()
    {
        $items = TemaBlogNd::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }

    public function getComboCargoIntegrante()
    {
        $items = CargoIntegrante::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->orderBy('id','desc')->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }

    public function getComboEstadoControlPolitico()
    {
        $items = EstadoControlPolitico::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }

    public function getComboTemaFilter()
    {
        $items = Tema::select([
            'id',
            'nombre'
        ])->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response($items);
    }

    public function getComboEstadoProyecto()
    {
        $items = EstadoProyectoLey::select([
            'id',
            'nombre'
        ])->where(
                'activo',
                1
            )->orderBy('nombre')->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }

    public function getComboEquipoCVByType(Request $request)
    {
        $EquipoOpiniones = 1;
        $EquiposBalancesInformes = 3;

        switch ($request->get("tipo")) {
            case $EquipoOpiniones:
                $items = CongresoVisibleEquipo::select('congreso_visible_equipos.id','congreso_visible_equipos.nombre')
                ->join('opinions', 'congreso_visible_equipos.id','opinions.equipo_id')
                ->where('congreso_visible_equipos.activo',1)
                ->distinct()
                ->get()
                ->toJson(JSON_PRETTY_PRINT);

                return response($items, 200);
                break;
            case $EquiposBalancesInformes:
                $items = CongresoVisibleEquipo::select('congreso_visible_equipos.id','congreso_visible_equipos.nombre')
                ->join('balance_cuatrienio_informes', 'congreso_visible_equipos.id','balance_cuatrienio_informes.equipo_id')
                ->where('congreso_visible_equipos.activo',1)
                ->distinct()
                ->get()
                ->toJson(JSON_PRETTY_PRINT);

                return response($items, 200);
                break;
            default:
                return response(0, 200);
                break;
        }
    }
    public function getComboGlosarioLegislativoByType(Request $request)
    {
        $ConceptosInformes= 4;

        switch ($request->get("tipo")) {
            case $ConceptosInformes:
                $items = GlosarioLegislativo::select('glosario_legislativos.id','glosario_legislativos.palabra')
                ->join('balance_cuatrienio_informe_conceptos', 'glosario_legislativos.id','balance_cuatrienio_informe_conceptos.glosario_legislativo_id')
                ->where('glosario_legislativos.activo',1)
                ->distinct()
                ->get()
                ->toJson(JSON_PRETTY_PRINT);

                return response($items, 200);
                break;
            default:
                return response(0, 200);
                break;
        }
    }
    public function getComboCongresistaByType(Request $request)
    {
        $CongresistasEnOpinionesCongresista = 2;

        switch ($request->get("tipo")) {
            case $CongresistasEnOpinionesCongresista:
                $items = Congresista::select('congresistas.id','congresistas.nombre')
                ->join('opinion_congresistas', 'congresistas.id','opinion_congresistas.congresista_id')
                ->where('congresistas.activo',1)
                ->distinct()
                ->get()
                ->toJson(JSON_PRETTY_PRINT);

                return response($items, 200);
                break;
            default:
                return response(0, 200);
                break;
        }
    }

    public function getComboEquipoCV()
    {
        $items = CongresoVisibleEquipo::select(
            'id',
            'nombre'
        )
        ->where('activo',1)->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }

    public function getComboTipoProyecto()
    {
        $items = TipoProyecto::select([
            'id',
            'nombre'
        ])->where(
                'activo',
                1
            )->orderBy('nombre')->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }

    public function getComboBalanceCuatrienioYearInicio()
    {
        $items = BalanceCuatrienio::select([
            'yearInicio as id',
            'yearInicio'
        ])->where(
                'activo',
                1
            )->distinct()->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }

    public function getComboTipoComisionFilter(Request $request)
    {
        $query = TipoComision::query();
        if ($request->has('id'))
        {
            if (!is_null($request["id"]))
            {
                $query->where(
                    'id',
                    $request->id
                );
            }
        }
        if ($request->has('corporacion_id'))
        {
            if (!is_null($request["corporacion_id"]))
            {
                $query->where(
                    'corporacion_id',
                    $request->corporacion_id
                );
            }
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('activo'))
        {
            if (!is_null($request["activo"]))
            {
                $query->where(
                    'activo',
                    $request->activo
                );
            }
        }
        $result = $query->get();

        return response(
            $result,
            200
        );
    }

    public function getCongresistasFilter(Request $request)
    {
        $query = Congresista::query();

        if ($request->has('id'))
        {
            if (!is_null($request["id"]))
            {
                $query->whereIn(
                    'congresista.id',
                    json_decode($request->id)
                );
            }
        }

        if ($request->has('nombre'))
        {
            $search = $request->input('nombre');
            $query->orWhereHas('persona', function ($query) use ($search){
                $query->where('nombres', 'like', '%' . $search . '%')
                    ->orWhere('apellidos', 'LIKE', '%' . $search . '%');
            });
            $query->orWhereHas('corporacion', function ($query) use ($search){
                $query->where('nombre', 'like', '%' . $search . '%');
            });
        }

        if ($request->has('activo'))
        {
            if (!is_null($request["activo"]))
            {
                $query->where(
                    'activo',
                    $request->activo
                );
            }
        }

        $result = $query->with(
            [
                "persona",
                "corporacion",
                "persona.Imagenes",
            ]
        )->get();
        return response($result);
    }


    public function getComboTipoPublicacion()
    {
        $items = TipoPublicacion::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }

    public function getComboGlosarioLegislativo()
    {
        $items = GlosarioLegislativo::select(
            'id',
            'palabra'
        )->where(
                'activo',
                1
            )->orderBy(
                'palabra',
                'asc'
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboComisionesFilter(Request $request)
    {
        $query = Comision::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->where(
                'id',
                $request->id
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('corporacion_id') && !is_null($request["corporacion_id"]))
        {
            $query->where(
                'corporacion_id',
                $request->corporacion_id
            );
        }
        if ($request->has('tipo_comision_id') && !is_null($request["tipo_comision_id"]))
        {
            $query->where(
                'tipo_comision_id',
                $request->tipo_comision_id
            );
        }

        // if ($request->has('cuatrienio_id') && !is_null($request["cuatrienio_id"]))
        // {
        //     $query->where('cuatrienio_id' , $request->cuatrienio_id);
        // }

        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $query->with(
            [
                "comisionImagen",
                "corporacion"
            ]
        );
        $result = $query->orderBy("nombre")->get();

        return response(
            $result,
            200
        );
    }

    public function getComboTipoMultimedia()
    {
        $items = TipoMultimedia::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }

    public function getComboTipoActividadAgenda()
    {
        $items = TipoActividadAgendaLegislativa::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }

    public function getComboTipoPublicacionProyectoLeyFilter(Request $request)
    {
        $query = TipoPublicacionProyectoLey::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->where(
                'id',
                $request->id
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->get();

        return response(
            $result,
            200
        );
    }

    public function getComboIniciativaFilter(Request $request)
    {
        $query = Iniciativa::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->where(
                'id',
                $request->id
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->orderBy('nombre')->get();

        return response(
            $result
        );
    }

    public function getComboTipoFechaProyectoLeyFilter(Request $request)
    {
        $query = TipoFechaProyectoLey::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->where(
                'id',
                $request->id
            );
        }
        if ($request->has('proyecto_ley_id') && !is_null($request["proyecto_ley_id"]))
        {
            $query->where(
                'proyecto_ley_id',
                $request->proyecto_ley_id
            );
        }
        if ($request->has('fecha'))
        {
            $query->where(
                DB::raw("(DATE_FORMAT(fecha,'%d/%m/%Y'))"),
                'LIKE',
                '%' . $request->fecha . '%'
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->get();

        return response(
            $result,
            200
        );
    }

    public function getComboTemaProyectoLeyFilter(Request $request)
    {
        $query = Tema::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->where(
                'id',
                $request->id
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->orderBy('nombre')->get();

        return response(
            $result,
            200
        );
    }

    public function getComboTemaControlPoliticoFilter(Request $request)
    {
        $query = TemaControlPolitico::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->where(
                'id',
                $request->id
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->get();

        return response(
            $result,
            200
        );
    }

    public function getComboGenero()
    {
        $items = Genero::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }

    public function getComboCircunscripcion()
    {
        $items = Circunscripcion::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }

    public function getComboLegislaturaFilter(Request $request)
    {
        $query = Legislatura::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('fechaInicio'))
        {
            $query->where(
                DB::raw("(DATE_FORMAT(fechaInicio,'%d/%m/%Y'))"),
                'LIKE',
                '%' . $request->fechaInicio . '%'
            );
        }
        if ($request->has('fechaFin'))
        {
            $query->where(
                DB::raw("(DATE_FORMAT(fechaFin,'%d/%m/%Y'))"),
                'LIKE',
                '%' . $request->fechaFin . '%'
            );
        }
        if ($request->has('cuatrienio_id') && !is_null($request["cuatrienio_id"]))
        {
            $query->whereIn(
                'cuatrienio_id',
                json_decode($request->cuatrienio_id)
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->orderBy('fechaInicio')->get();

        return response($result);
    }

    public function getComboTipoUsuarioFilter(Request $request)
    {
        $query = TipoUsuario::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->get();

        return response(
            $result,
            200
        );
    }

    public function getComboProyectosDeLeyByLegislaturaCuatrienio(Request $request)
    {
        $items = ProyectoLey::select(
            'id',
            'titulo'
        )->where(
                'activo',
                1
            )->where(
                'legislatura_id',
                $request->get('legislatura')
            )->where(
                'cuatrienio_id',
                $request->get('cuatrienio')
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboTipoRespuestaVotacion(){
        $items = TipoRespuestaVotacion::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }
    public function getComboGruposEdad(Request $request)
    {
        $items = GrupoEdad::select(
            'id',
            'nombre'
        )->where(
                'activo',
                1
            )->get()->toJson(JSON_PRETTY_PRINT);

        return response(
            $items,
            200
        );
    }

    public function getComboDepartamento()
    {
        $items = Departamento::select('id','nombre')
        ->where('activo',1)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items,200);
    }

    public function getProyectosLeyComision(Request $request)
    {
        $comision = $request->get('comision');
        $search = $request->get('search');
    }

    public function getComboMunicipioFilter(Request $request)
    {
        $query = Municipio::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }

        $result = $query->orderBy('nombre')->get(['id', 'nombre', 'activo']);

        return response($result);
    }

    public function getComboProfesionFilter(Request $request)
    {
        $query = Profesion::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->orderBy('nombre')->get(['id', 'nombre', 'activo']);

        return response($result);
    }
    public function getComboGeneroFilter(Request $request)
    {
        $query = Genero::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->orderBy('nombre')->get(['id', 'nombre', 'activo']);

        return response($result);
    }
    public function getComboGradoEstudioFilter(Request $request)
    {
        $query = GradoEstudio::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->orderBy('nombre')->get(['id', 'nombre', 'activo']);

        return response($result);
    }
    public function getComboPartidoFilter(Request $request)
    {
        $query = Partido::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->orderBy('nombre')->get(['id', 'nombre', 'activo']);

        return response($result);
    }
    public function getComboDepartamentoFilter(Request $request)
    {
        $query = Departamento::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->orderBy('nombre')->get(['id', 'nombre', 'activo']);

        return response($result);
    }
    public function getComboTipoSucursalFilter(Request $request)
    {
        $query = TipoSucursal::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->orderBy('nombre')->get();

        return response(
            $result,
            200
        );
    }
    public function getControlPoliticoFilter(Request $request){
        $nombre = $request->input('nombre');
        $comision = $request->input('comision');
        $items = ControlPolitico::where('activo', '1')
        ->where('titulo', 'LIKE', '%' . $nombre . '%' )
        ->where('comision_id',$comision)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items, 200);
    }
    public function getComboOpinionCongresistaAnno(Request $request){

        $items = OpinionCongresista::get([
                                         DB::raw('YEAR(fechaPublicacion) as fechaPublicacion')
                                ])->unique("fechaPublicacion")->toJson(JSON_PRETTY_PRINT);

        return response($items);
    }
    public function getComboBlogNdAnno(Request $request){

        $items = BlogNd::get([
                             DB::raw('YEAR(fecha_publicacion) as fecha_publicacion')
                         ])->unique("fecha_publicacion")->toJson(JSON_PRETTY_PRINT);

        return response($items);
    }
    public function getComboCargoLegislativo(){
        $items = CargoLegislativo::select('id','nombre')
        ->where('activo',1)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items,200);
    }
    public function getComboTipoInvestigacion(){
        $items = TipoInvestigacion::select('id','nombre')
        ->where('activo',1)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items,200);
    }
    public function getAllProyectosLeySearch(Request $request){
        $query = ProyectoLey::query();
        if ($request->has('search') && !is_null($request["search"]))
        {
            $search = $request->input('search');
            $query->Where(function($query) use ($search){
                $query->Where('numero_camara', 'like', '%'. $search .'%')
                      ->orWhere(function ($query) use ($search){
                            $query->orWhereHas('Legislatura', function ($query) use ($search) {
                                $query->where('nombre', 'like', '%'. $search .'%');
                            })->orWhereHas('Cuatrienio', function ($query) use ($search) {
                                $query->where('nombre', 'like', '%'. $search .'%');
                            })->orWhereHas('TipoProyectoLey', function ($query) use ($search) {
                                $query->where('nombre', 'like', '%'. $search .'%');
                            });
                      });
            });
        }
        $items = $query->with(['Legislatura', 'Cuatrienio', 'TipoProyectoLey'])
        ->skip(($request->input('page') - 1) * $request->input('rows'))->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($items);
    }
    public function getAllProyectosLeySearchtotalrecords(Request $request)
    {
        $search = $request->input('search');

        $count = ProyectoLey::select([
             'id',
             'iniciativa_id',
             'legislatura_id',
             'cuatrienio_id',
             'titulo',
             'numero_camara',
             'activo'
        ])
        ->where('activo', 1)
        ->where(function($query) use ($search){
            $query->Where('numero_camara', 'like', '%'. $search .'%');
        })
        ->orWhere(function ($query) use ($search){
            $query->orWhereHas('Legislatura', function ($query) use ($search) {
                $query->where('nombre', 'like', '%'. $search .'%');
            })
            ->orWhereHas('Cuatrienio', function ($query) use ($search) {
                $query->where('nombre', 'like', '%'. $search .'%');
            })
            ->orWhereHas('TipoProyectoLey', function ($query) use ($search) {
                $query->where('nombre', 'like', '%'. $search .'%');
            });
        })
        ->with(['Legislatura', 'Cuatrienio'])
        ->count();
        return response($count, 200);
    }
    public function getAllPersonasNoCongresistas(Request $request){
        $filter = $request->input('idFilter');
        $cuatrienio = $request->input('cuatrienio');

        $items = Persona::select('personas.id','personas.nombres', 'personas.apellidos', 'personas.municipio_id_nacimiento', 'congresistas.id as congresista_id', 'congresistas.cuatrienio_id')
        ->with("LugarNacimiento", "Profesion", "Imagenes")
            ->leftJoin('congresistas', function ($join) use ($cuatrienio){
                $join->on('personas.id', '=', 'congresistas.persona_id');
                $join->where('congresistas.cuatrienio_id', $cuatrienio);
            })
        ->where('personas.activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('personas.nombres', 'LIKE', '%' . $request->input('search') . '%' )
        ->where('personas.apellidos', 'LIKE', '%' . $request->input('search') . '%' )
        ->where('congresistas.id', "=", null)
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('personas.id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items, 200);
    }
    public function totalrecordsPersonasNoCongresistas(Request $request){
        $filter = $request->input('idFilter');
        $cuatrienio = $request->input('cuatrienio');
        $count = Persona::with("LugarNacimiento", "Profesion", "Imagenes")
        ->with("LugarNacimiento", "Profesion", "Imagenes")
        ->leftJoin('congresistas', function ($join) use ($cuatrienio){
            $join->on('personas.id', '=', 'congresistas.persona_id');
            $join->where('congresistas.cuatrienio_id', $cuatrienio);
        })
        ->where('personas.activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('personas.nombres', 'LIKE', '%' . $request->input('search') . '%' )
        ->where('personas.apellidos', 'LIKE', '%' . $request->input('search') . '%' )
        ->where('congresistas.id', "=", null)
        ->count();

        return response($count, 200);
    }
    public function getComboPersonas(Request $request){
        $filter = $request->input('idFilter');

        $items = Persona::select('id','nombres', 'apellidos', 'municipio_id_nacimiento')
        ->with("LugarNacimiento", "Profesion", "Imagenes")
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('nombres', 'LIKE', '%' . $request->input('search') . '%' )
        ->where('apellidos', 'LIKE', '%' . $request->input('search') . '%' )
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items, 200);
    }
    public function totalrecordsComboPersonas(Request $request){
        $filter = $request->input('idFilter');
        $count = Persona::with("LugarNacimiento", "Profesion", "Imagenes")
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('nombres', 'LIKE', '%' . $request->input('search') . '%' )
        ->where('apellidos', 'LIKE', '%' . $request->input('search') . '%' )
        ->count();

        return response($count, 200);
    }
    public function getComboAlcanceFilter(Request $request)
    {
        $query = Alcance::query();

        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->orderBy('nombre')->get(['id', 'nombre', 'activo']);

        return response($result);
    }
    public function getProyectoLeyFilter(Request $request)
    {
        $query = ProyectoLey::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('search'))
        {
            $search = $request->input('search');
            $query->Where(
                function ($query) use
                (
                    $search
                )
                {
                    $query->where(
                        'titulo',
                        'like',
                        '%' . $search . '%'
                    )->orWhere(
                        'alias',
                        'LIKE',
                        '%' . $search . '%'
                    )->orWhere(
                        'numero_camara',
                        'LIKE',
                        '%' . $search . '%'
                    );
                }
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->skip(
            ($request->input('page') - 1) * $request->input('rows')
            )->take($request->input('rows')
            )->orderBy(
                'id',
                'desc'
            )->get([
                'id',
                'titulo',
                'alias',
                'fecha_radicacion',
                'numero_camara',
                'activo'
            ])->toJson(JSON_PRETTY_PRINT);

        return response($result);
    }
    public function getProyectoLeyFilterTotalRecords(Request $request)
    {
        $query = ProyectoLey::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('nombre'))
        {
            $query->where(
                'nombre',
                'LIKE',
                '%' . $request->nombre . '%'
            );
        }
        if ($request->has('search'))
        {
            $search = $request->input('search');
            $query->Where(
                function ($query) use
                (
                    $search
                )
                {
                    $query->where(
                        'titulo',
                        'like',
                        '%' . $search . '%'
                    )->orWhere(
                        'alias',
                        'LIKE',
                        '%' . $search . '%'
                    )->orWhere(
                        'numero_camara',
                        'LIKE',
                        '%' . $search . '%'
                    );
                }
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }
        $result = $query->get([
                   'id',
               ])->count();

        return response($result);
    }
    public function getComisionFilterPagination(Request $request)
    {
        $query = Comision::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('search'))
        {
            $search = $request->input('search');
            $query->Where(function ($query) use ($search){
                $query->where('nombre', 'like', '%' . $search . '%')
                    ->orWhere('descripcion', 'like', '%' . $search . '%');

                $query->orWhereHas('corporacion', function ($query) use ($search){
                    $query->where('nombre', 'like', '%' . $search . '%');
                });

            } );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }

        $result = $query->with(['corporacion'])->skip(
            ($request->input('page') - 1) * $request->input('rows')
        )->take($request->input('rows')
        )->orderBy(
            'id',
            'desc'
        )->get([
                   'id',
                   'corporacion_id',
                   'descripcion',
                   'nombre',
                   'activo'
               ])->toJson(JSON_PRETTY_PRINT);
        return response($result);
    }
    public function getComisionFilterPaginationTotalRecord(Request $request)
    {
        $query = Comision::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('search'))
        {
            $search = $request->input('search');
            $query->Where(function ($query) use ($search){
                $query->where('nombre', 'like', '%' . $search . '%')
                      ->orWhere('descripcion', 'like', '%' . $search . '%');

                $query->orWhereHas('corporacion', function ($query) use ($search){
                    $query->where('nombre', 'like', '%' . $search . '%');
                });

            } );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }

        $result = $query->get([
                   'id'
               ])->count();

        return response($result);
    }
    public function getPonenteFilterPagination(Request $request)
    {
        $query = Congresista::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('cuatrienio_id') && !is_null($request["cuatrienio_id"]))
        {
            $query->where(
                'cuatrienio_id',
                $request->cuatrienio_id
            );
        }
        if ($request->has('search'))
        {
            $search = $request->input('search');
            $query->Where(function ($query) use ($search){
                $query->WhereHas('persona', function ($query) use ($search){
                    $query->where('nombres', 'like', '%' . $search . '%')
                          ->orWhere('apellidos', 'LIKE', '%' . $search . '%');
                });
                $query->orWhereHas('corporacion', function ($query) use ($search){
                    $query->where('nombre', 'like', '%' . $search . '%');
                });
                $query->orWhereHas('partido', function ($query) use ($search){
                    $query->where('nombre', 'like', '%' . $search . '%');
                });
            } );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }

        $result = $query->with(['persona', 'partido', 'corporacion'])->skip(
            ($request->input('page') - 1) * $request->input('rows')
        )->take($request->input('rows')
        )->orderBy(
            'id',
            'desc'
        )->get([
                   'id',
                   'persona_id',
                   'corporacion_id',
                   'partido_id',
                   'activo'
               ])->toJson(JSON_PRETTY_PRINT);

        return response($result);
    }
    public function getPonenteFilterPaginationTotalRecord(Request $request)
    {
        $query = Congresista::query();
        if ($request->has('id') && !is_null($request["id"]))
        {
            $query->whereIn(
                'id',
                json_decode($request->id)
            );
        }
        if ($request->has('cuatrienio_id') && !is_null($request["cuatrienio_id"]))
        {
            $query->where(
                'cuatrienio_id',
                $request->cuatrienio_id
            );
        }
        if ($request->has('search'))
        {
            $search = $request->input('search');
            $query->Where(function ($query) use ($search){
                $query->WhereHas('persona', function ($query) use ($search){
                    $query->where('nombres', 'like', '%' . $search . '%')
                          ->orWhere('apellidos', 'LIKE', '%' . $search . '%');
                });
                $query->orWhereHas('corporacion', function ($query) use ($search){
                    $query->where('nombre', 'like', '%' . $search . '%');
                });
                $query->orWhereHas('partido', function ($query) use ($search){
                    $query->where('nombre', 'like', '%' . $search . '%');
                });
            } );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'activo',
                $request->activo
            );
        }

        $count = $query->with(['persona', 'partido', 'corporacion'])->skip(
            ($request->input('page') - 1) * $request->input('rows')
        )->take($request->input('rows')
        )->orderBy(
            'id',
            'desc'
        )->get([
                   'id',
                   'persona_id',
                   'corporacion_id',
                   'partido_id',
                   'activo'
               ])->count();

        return response($count);
    }
    // En autor, se obtiene a las personas, se utiliza en proyecto de ley
    public function getAutorFilterPagination(Request $request)
    {
        $query = Persona::query();
        $query->leftJoin('municipios', 'personas.municipio_id_nacimiento', 'municipios.id');

        if ($request->get('search') != null)
        {
            $search = $request->input('search');
            $search = str_replace(' ', '%', $search);
            $query->Where(
                function ($query) use
                (
                    $search
                )
                {
                    $query->where(DB::raw("CONCAT(`nombres`, ' ',COALESCE(`apellidos`,''))"), 'LIKE', "%".$search."%")
                    ->orWhere(DB::raw("CONCAT(COALESCE(`apellidos`,''), ' ', `nombres`)"), 'LIKE', "%".$search."%")
                    ->orWhere(DB::raw("(DATE_FORMAT(fechaNacimiento,'%d/%m/%Y'))"),'LIKE','%' . $search . '%');
                }
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where('personas.activo',$request->activo);
        }

        $result = $query->with(['Imagenes'])
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('personas.id','desc')
        ->select([
            'personas.id',
            'personas.nombres',
            'personas.apellidos',
            'personas.fechaNacimiento',
            DB::raw('CONCAT(municipios.nombre) as lugar_nacimiento')
       ])->groupBy('personas.id')->get();

        return response($result);
    }
    public function getComboTipoVotacion(Request $request){
        $items = TipoVotacion::select('id','nombre', 'procedimental', 'descripcion')
        ->where('activo',1)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($items, 200);
    }

    public function getComboClaseVotacion(Request $request){
        $items = ClaseVotacion::select('id','nombre', 'descripcion')
        ->where('activo',1)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($items, 200);
    }

    public function getAutorFilterPaginationTotalRecord(Request $request)
    {
        $query = Persona::query();
        $query->leftJoin(
                'municipios',
                'personas.municipio_id_nacimiento',
                'municipios.id'
        );
        if ($request->has('search'))
        {
            $search = $request->input('search');
            $search = str_replace(' ', '%', $search);
            $query->Where(
                function ($query) use ($search)
                {
                    $query->where(DB::raw("CONCAT(`nombres`, ' ',COALESCE(`apellidos`,''))"), 'LIKE', "%".$search."%")
                    ->orWhere(DB::raw("CONCAT(COALESCE(`apellidos`,''), ' ', `nombres`)"), 'LIKE', "%".$search."%")
                    ->orWhere(DB::raw("(DATE_FORMAT(fechaNacimiento,'%d/%m/%Y'))"),'LIKE','%' . $search . '%');
                }
            );
        }
        if ($request->has('activo') && !is_null($request["activo"]))
        {
            $query->where(
                'personas.activo',
                $request->activo
            );
        }
        $count = $query->with(['Imagenes'])
           ->select(
            [
                'personas.id',
                'personas.nombres',
                'personas.apellidos',
                'personas.fechaNacimiento',
                DB::raw('CONCAT(municipios.nombre) as lugar_nacimiento')
            ]
        )->distinct()->count('personas.id');

        return response($count);
    }

    public function getEstadosByProyectoId(Request $request){
        $items = ProyectoLeyEstado::with("TipoEstado")
        ->where('proyecto_ley_id', $request->input("proyecto") === "0" ? "!=" : "=", $request->input("proyecto"))
        ->where('activo',1)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($items, 200);
    }
}
