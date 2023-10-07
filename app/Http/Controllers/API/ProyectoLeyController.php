<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Notificacion;
use App\Models\Notificacion_usuario_cuenta;
use App\Models\ProyectoLey;
use App\Models\ProyectoLeyDocumento;
use App\Models\ProyectoLeyAutor;
use App\Models\ProyectoLeyEstado;
use App\Models\UsuarioCuenta;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProyectoLeyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = ProyectoLey::query();

        if ($request->has('idFilter') && !is_null($request["idFilter"]))
        {
            $query->where(
                'activo',
                $request->idFilter
            );
        }

        if ($request->has('tipo_id') && !is_null($request["tipo_id"]))
        {
            $query->where(
                'tipo_proyecto_id',
                $request->tipo_id
            );
        }

        if ($request->has('iniciativa_id') && !is_null($request["iniciativa_id"]))
        {
            $query->where(
                'iniciativa_id',
                $request->iniciativa_id
            );
        }

        if ($request->has('tema_id') && !is_null($request["tema_id"]))
        {
            $tema_id = $request->input('tema_id');
            $query->where(
                function ($query) use
                (
                    $tema_id
                )
                {
                    $query->where(
                        'tema_id_principal',
                        $tema_id
                    )->orWhere(
                        'tema_id_secundario',
                        $tema_id
                    );
                }
            );
        }

        if ($request->has('legislatura_id') && !is_null($request["legislatura_id"]))
        {
            $query->where(
                'legislatura_id',
                $request->legislatura_id
            );
        }

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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ProyectoLey::rulesPost(), ProyectoLey::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $item = new ProyectoLey();
            $user = $request->user;
            $request->request->add(['usercreated' => $request->user]);
            $result = $item->create($request->all());

            // Damos de alta los estatus del proyecto de ley por estado
            if(!is_null($request->proyecto_ley_estado))
            {
                $count = count($request->proyecto_ley_estado);
                for ($i=0; $i < $count; $i++) {
                    $item_estado = $request->proyecto_ley_estado[$i];

                    if($item_estado["activo"])
                    {
                        // Damos de alta los estados del proyecto de ley
                        $item_proyecto_ley_estado = new ProyectoLeyEstado();
                        $item_proyecto_ley_estado->fill($item_estado);
                        $item_proyecto_ley_estado->proyecto_ley_id = $result->id;
                        $item_proyecto_ley_estado->usercreated = $user;
                        $item_proyecto_ley_estado->activo = 1;
                        $item_proyecto_ley_estado->save();
                    }
                }
            }

            // Checamos los autores personas
            if($request->has('proyecto_ley_autor_personas')){
                // Lo que la vista nos trae son los ids de las personas
                $personas_ids = [];
                foreach ($request->input('proyecto_ley_autor_personas') as $autor_persona) {
                    $personas_ids[] = $autor_persona['persona_id'];
                }
                if(count($personas_ids) > 0){
                    // Generamos un array de las personas por insertar
                    $personas_insert = [];
                    foreach ($personas_ids as $persona_id){
                        $item_insert = [
                            'proyecto_ley_id' =>  $result->id,
                            'persona_id' => $persona_id,
                            'activo' => 1,
                            'usercreated' => $request->user,
                            'created_at' => Carbon::now()
                        ];
                        $personas_insert[] = $item_insert;
                    }
                    // Insertamos a los autores personas
                    ProyectoLeyAutor::insert($personas_insert);
                }
            }

            // Creamos la notificación hacia los demás usuarios.
            $item_notificacion = [
                'proyecto_ley_id' => $result->id,
                'titulo' => "Creado",
                'tipo' => 1,
                'color' => '#00b963',
                'icono' => 'la la-check-circle',
                'mensaje' =>  'Se ha creado un nuevo proyecto de ley: ' . $result->titulo,
                'usercreated' => $request->user,
                'created_at' => Carbon::now()
            ];
            $notificacion = Notificacion::create($item_notificacion);
            UsuarioCuenta::all()
                ->where('email', '!=', $user)
                ->each(function(UsuarioCuenta $usuario_cuenta) use ($notificacion){
                    Notificacion_usuario_cuenta::insert([
                        'notificacion_id' => $notificacion->id,
                        'usuario_cuenta_id' => $usuario_cuenta->id,
                        'created_at' => Carbon::now()
                    ]);
                });

            DB::commit();
            return response()->json(['message' => 'OK'],202);
        }
        catch (QueryException $ex)
        {
            DB::rollback();
            return response()->json(['message' => $ex],422);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $item = ProyectoLey::select(
            [
                'id',
                'cuatrienio_id',
                'legislatura_id',
                'titulo',
                'alias',
                'fecha_radicacion',
                'numero_camara',
                'iniciativa_id',
                'tipo_proyecto_id',
                'tema_id_principal',
                'tema_id_secundario',
                'sinopsis',
                'activo',
            ]
        )->where(
                'id',
                $id
            )->with(
                [
                    'ProyectoLeyEstado',
                    'ProyectoLeyAutorPersonas'
                ]
            )->get()->first();

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
        $validator = Validator::make($request->all(), ProyectoLey::rulesPut(), ProyectoLey::$rulesPutMessages);
        if ($validator->fails())
        {
            return response()->json(
                $validator->errors(),
                422
            );
        }

        DB::beginTransaction();
        try
        {
            $proyecto_ley = ProyectoLey::find($id);
            $user = $request->user;
            $request->request->add(['usermodifed' => $request->user]);
            $proyecto_ley->fill($request->all());
            $proyecto_ley->save();

            // Checamos los estados
            if ($request->has('proyecto_ley_estado')){
                // Solamente los que se devuelvan activos desde la vista
                // Aunque si no mal recuerdo en la vista se elimina del array directamente, no se cambia el activo
                $estados = array_filter(
                    $request->proyecto_ley_estado,
                    static function ($item)  {
                        if($item["activo"]){
                            return $item;
                        }
                    }
                );

                // Ponemos todos los estados  a activo 0, en relación al proyecto de ley
                ProyectoLeyEstado::where
                (
                    [
                        ['proyecto_ley_id', $proyecto_ley->id]
                    ]
                )->update(['activo'=> 0]);

                /* Recorremos el listado de estados que se trae de la vista */
                foreach ($estados as $estado)
                {
                    // Continuamos con el estado del proyecto de ley
                    $item_estado = ProyectoLeyEstado::where
                    (
                        [
                            ['id', $estado["id"]],
                            ['proyecto_ley_id', $proyecto_ley->id]
                        ]
                    )->first();

                    // Checamos si existe en la bd
                    $borrar_archivo_estado = false;
                    if($item_estado != null){
                        // Si existe actualizamos el activo y su fecha de modificación
                        $item_estado->fill($estado);
                        $item_estado->usermodifed = $request->user;
                    }
                    else{
                        // Como no existe creamos un nuevo item
                        // Y lo agregamos a la bd
                        $item_estado = new ProyectoLeyEstado();
                        $item_estado->fill($estado);
                        $item_estado->usercreated = $request->user;
                    }

                    $item_estado->proyecto_ley_id = $proyecto_ley->id;
                    $item_estado->activo = 1;
                    $item_estado->save();
                }
                //Borramos los que esten activo 0
                // Primero obtemos aquellos que esten en activo 0
                $estados_desactivados = ProyectoLeyEstado::select(
                    [
                        'id',
                    ]
                )->where(
                        'activo',
                        '=',
                        0
                    )->where(
                        'proyecto_ley_id',
                        '=',
                        $proyecto_ley->id
                    )->get();

                // Por último borramos los registros de la tabla
                ProyectoLeyEstado::where
                (
                    [
                        ['proyecto_ley_id', $proyecto_ley->id],
                        ['activo', 0]
                    ]
                )->delete();
            }

            // Checamos los autores personas
            if($request->has('proyecto_ley_autor_personas')){
                    // Lo que la vista nos trae son los ids de las personas
                    $personas_ids = [];
                    foreach ($request->proyecto_ley_autor_personas as $autor_persona) {
                        $personas_ids[] = $autor_persona['persona_id'];
                    }
                    if(count($personas_ids) > 0){
                        ProyectoLeyAutor::where
                        (
                            [
                                ['proyecto_ley_id', $proyecto_ley->id]
                            ]
                        )->update(['activo'=> 0]);

                        // Actualizamos los registros que esten en la tabla autores legislativos
                        ProyectoLeyAutor::where(
                            'proyecto_ley_id',
                            $proyecto_ley->id
                        )->whereIn(
                            'persona_id',
                            $personas_ids
                        )->update(
                            [
                                'activo' => 1,
                                'usermodifed' => $request->user
                            ]
                        );

                        // Obtenemos a las personas  que se actualizaron
                        $personas_ids_actualizados = ProyectoLeyAutor::where(
                            'proyecto_ley_id',
                            $proyecto_ley->id
                        )->where(
                            'activo',
                            1
                        )->pluck('persona_id')->all();


                        // Obtenemos a las personas  que faltan por insertar
                        $personas_ids_por_insertar = array_diff(
                            $personas_ids,
                            $personas_ids_actualizados
                        );

                        // Generamos un array de las personas que faltan por insertar
                        $personas_insert = [];
                        foreach ($personas_ids_por_insertar as $personas_id_por_insertar){
                            $item_insert = [
                                'proyecto_ley_id' =>  $proyecto_ley->id,
                                'persona_id' => $personas_id_por_insertar,
                                'activo' => 1,
                                'usercreated' => $request->user,
                                'created_at' => Carbon::now()
                            ];
                            $personas_insert[] = $item_insert;
                        }

                        // Insertamos el resto de los autores personas
                        ProyectoLeyAutor::insert($personas_insert);
                    }
            }
            else{
                ProyectoLeyAutor::where
                (
                    [
                        ['proyecto_ley_id', $proyecto_ley->id]
                    ]
                )->update(['activo'=> 0]);
            }
            // Al final los autores personas que esten en activo 0 y que sean de ese
            // proyecto de ley, se eliminan
            ProyectoLeyAutor::where
            (
                [
                    ['proyecto_ley_id', $proyecto_ley->id],
                    ['activo', 0]
                ]
            )->delete();

            // Creamos la notificación hacia los demás usuarios.
            $item_notificacion = [
                'proyecto_ley_id' => $proyecto_ley->id,
                'titulo' => "Editado",
                'tipo' => 2,
                'color' => "rgba(255, 193, 7, 1)",
                'icono' => "la la-edit",
                'mensaje' =>  'Se ha editado el proyecto de ley: ' . $proyecto_ley->titulo,
                'usercreated' => $request->user,
                'created_at' => Carbon::now()
            ];
            $notificacion = Notificacion::create($item_notificacion);
            UsuarioCuenta::all()
                ->where('email', '!=', $user)
                ->each(function(UsuarioCuenta $usuario_cuenta) use ($notificacion){
                    Notificacion_usuario_cuenta::insert([
                        'notificacion_id' => $notificacion->id,
                        'usuario_cuenta_id' => $usuario_cuenta->id,
                        'created_at' => Carbon::now()
                    ]);
                });

            DB::commit();

            return response()->json(
                ['message' => 'OK'],
                202
            );
        } catch (QueryException $ex)
        {
            DB::rollback();
            return response()->json(
                ['message' => $ex],
                422
            );
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
        $item = ProyectoLey::find($id);
        $item->activo = !$item->activo;
        $item->save();
        return response($item);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function setLey($id)
    {
        $item = ProyectoLey::find($id);
        $item->esLey = !$item->esLey;
        $item->save();
        return response($item);
    }

     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $search = $request->input('search');

        $count = ProyectoLey::select([
             'id',
             'iniciativa_id',
             'legislatura_id',
             'cuatrienio_id',
             'tipo_proyecto_id',
             'titulo',
             'numero_camara',
             'tema_proyecto_ley_id',
             'sinopsis',
             'activo',
        ])
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
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
        ->with(['Legislatura', 'Cuatrienio', 'TipoProyectoLey'])
        ->count();

        return response($count);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function indexDocumentos(Request $request)
    {
        $query = ProyectoLeyDocumento::query();

        if ($request->has('idFilter') && !is_null($request["idFilter"]))
        {
            $query->where(
                'activo',
                $request->idFilter
            );
        }

        if ($request->has('proyecto_ley_id') && !is_null($request["proyecto_ley_id"]))
        {
            $query->where(
                'proyecto_ley_id',
                $request->proyecto_ley_id
            );
        }


        if ($request->has('search') && !is_null($request["search"]))
        {
            $search = $request->input('search');
            $query->Where(function($query) use ($search){
                $query->Where('url_archivo', 'like', '%'. $search .'%');
            });
        }

        $items = $query
                ->skip(($request->input('page') - 1) * $request->input('rows'))->take($request->input('rows'))
                ->orderBy('id','desc')
                ->get()
                ->toJson(JSON_PRETTY_PRINT);
        return response($items);
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeDocumento(Request $request)
    {
        // $validator = Validator::make($request->all(), ProyectoLeyDocumento::$rules,  ProyectoLeyDocumento::$messages);
        // if ($validator->fails())
        //     return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $documento = new ProyectoLeyDocumento();
            $user = $request->user;
            $request->request->add(['usercreated' => $request->user]);
            $request->request->add(['activo' => 1]);
            $result = $documento->create($request->all());
            

            if($result != null){
                $id = $result->id;

                $archivo = $request->file('archivo');

                if($archivo != null){
                    $path = $archivo->storeAs(
                        '/documentosproyectos/'.$result->id, // Directorio
                        $archivo->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $item = ProyectoLeyDocumento::find($id);
                    $item->url_archivo = $path;
                    $item->save();  
                }
            }

            DB::commit();
            return response()->json(['message' => 'OK'], 201);
        }
        catch (\Throwable $e) 
        {            
            DB::rollback();
            return response()->json(['message' => $e], 422);
        }
    }

     /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroyDocumento($id)
    {
        $item = ProyectoLeyDocumento::find($id);
        $item->activo = !$item->activo;
        $item->save();
        return response($item);
    }
    public function totalrecordsDocumento(Request $request)
    {
        $query = ProyectoLeyDocumento::query();

        if ($request->has('idFilter') && !is_null($request["idFilter"]))
        {
            $query->where(
                'activo',
                $request->idFilter
            );
        }

        if ($request->has('proyecto_ley_id') && !is_null($request["proyecto_ley_id"]))
        {
            $query->where(
                'proyecto_ley_id',
                $request->proyecto_ley_id
            );
        }


        if ($request->has('search') && !is_null($request["search"]))
        {
            $search = $request->input('search');
            $query->Where(function($query) use ($search){
                $query->Where('url_archivo', 'like', '%'. $search .'%');
            });
        }

        $count = $query
                ->count();

        return response($count);
    }
}
