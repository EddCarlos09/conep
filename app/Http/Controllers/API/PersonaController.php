<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Partido;
use App\Models\Persona;
use App\Models\PersonaDatoContacto;
use App\Models\PersonaImagen;
use App\Models\PersonaTrayectoriaPrivada;
use App\Models\PersonaTrayectoriaPublica;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PersonaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Persona::query();

        if ($request->has('genero_id') && !is_null($request["genero_id"]))
        {
            $query->where(
                'genero_id',
                $request->genero_id
            );
        }

        if ($request->has('profesion_id') && !is_null($request["profesion_id"]))
        {
            $query->where(
                'profesion_id',
                $request->profesion_id
            );
        }

        if ($request->has('grado_estudio_id') && !is_null($request["grado_estudio_id"]))
        {
            $query->where(
                'grado_estudio_id',
                $request->grado_estudio_id
            );
        }

        if ($request->has('lugar_nacimiento_id') && !is_null($request["lugar_nacimiento_id"]))
        {
            $query->where(
                'municipio_id_nacimiento',
                $request->lugar_nacimiento_id
            );
        }
        if ($request->has('idFilter') && !is_null($request["idFilter"]))
        {
            $query->where(
                'activo',
                $request->idFilter
            );
        }

        if ($request->has('partido_id') && !is_null($request["partido_id"]))
        {
            $query->where(
                'partido_id',
                $request->partido_id
            );
        }

        if ($request->has('search') && !is_null($request["search"]))
        {
            $search = $request->input('search');

            $query->Where(function($query) use ($search){
                $query->where(DB::raw("CONCAT(`nombres`, ' ',COALESCE(`apellidos`,''))"), 'LIKE', "%".$search."%")
                    ->orWhere(DB::raw("CONCAT(COALESCE(`apellidos`,''), ' ', `nombres`)"), 'LIKE', "%".$search."%")
                    ->orWhere(DB::raw("nombreSuplente"), 'LIKE', "%".$search."%")
                      ->orWhere(DB::raw("(DATE_FORMAT(fechaNacimiento,'%Y-%m-%d'))"), 'LIKE', '%' . $search . '%')
                      ->orWhere(DB::raw("(DATE_FORMAT(fecha_fallecimiento,'%Y-%m-%d'))"), 'LIKE', '%' . $search . '%')
                      ->orWhere(function ($query) use ($search){
                          $query->orWhereHas('LugarNacimiento', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          })->orWhereHas('GradoEstudio', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          })->orWhereHas('Genero', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          })->orWhereHas('Profesion', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          });
                      });
            });
        }

        $items = $query->select(
            [
                'id',
                'nombres',
                'apellidos',
                'fechaNacimiento',
                'municipio_id_nacimiento',
                'profesion_id',
                'partido_id',
                'genero_id',
                'fecha_fallecimiento',
                'grado_estudio_id',
                'nombreSuplente',
                'activo'
            ])
            ->with(['LugarNacimiento', 'GradoEstudio', 'Genero', 'Profesion', 'Imagenes', 'Partido'])
            ->skip(($request->input('page') - 1) * $request->input('rows'))
            ->take($request->input('rows'))
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
        $validator = Validator::make($request->all(), Persona::rulesPost(), Persona::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $item = new Persona();
            $request->request->add(['usercreated' => $request->user]);
            $result = $item->create($request->all());
            $id = $result->id;

            // Imágenes
            $files = $request->file('imagen');
            if($request->hasFile('imagen'))
            {
                $nombre = $id;
                foreach ($files as $file) {
                    // Se crea registro
                    $imagen= new PersonaImagen;
                    $imagen->usercreated = $request->user;
                    $imagen->persona_id = $id;
                    $imagen->activo = 1;
                    $path = $file->storeAs(
                        '/persona/'.$nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $imagen->imagen = $path;
                    $imagen->save();
                }
            }

            // Damos de alta datos de contacto
            if(!is_null($request->persona_dato_contactos))
            {
                $count = count($request->persona_dato_contactos);
                for ($i=0; $i < $count; $i++) {
                    $item = $request->persona_dato_contactos[$i];
                    if($item["activo"]){
                        $item_persona_dato_contacto = new PersonaDatoContacto();
                        $item_persona_dato_contacto->fill($item);
                        $item_persona_dato_contacto->persona_id = $result->id;
                        $item_persona_dato_contacto->usercreated = $request->user;
                        $item_persona_dato_contacto->save();
                    }
                }
            }

            // Damos de alta la trayectoria pública
            if(!is_null($request->persona_trayectoria_publica))
            {
                $count = count($request->persona_trayectoria_publica);
                for ($i=0; $i < $count; $i++) {
                    $item = $request->persona_trayectoria_publica[$i];
                    if($item["activo"]){
                        $item_persona_trayectoria_publica = new PersonaTrayectoriaPublica();
                        $item_persona_trayectoria_publica->fill($item);
                        $item_persona_trayectoria_publica->persona_id = $result->id;
                        $item_persona_trayectoria_publica->usercreated = $request->user;
                        $item_persona_trayectoria_publica->save();
                    }
                }
            }

            // Damos de alta la trayectoria privada
            if(!is_null($request->persona_trayectoria_privada))
            {
                $count = count($request->persona_trayectoria_privada);
                for ($i=0; $i < $count; $i++) {
                    $item = $request->persona_trayectoria_privada[$i];
                    if($item["activo"])
                    {
                        $item_persona_trayectoria_privada = new PersonaTrayectoriaPrivada();
                        $item_persona_trayectoria_privada->fill($item);
                        $item_persona_trayectoria_privada->persona_id = $result->id;
                        $item_persona_trayectoria_privada->usercreated = $request->user;
                        $item_persona_trayectoria_privada->save();
                    }
                }
            }

            DB::commit();
            return response()->json(['message' => 'OK'],202);
        }
        catch (QueryException $ex)
        {
            DB::rollback();
            return response()->json(['message' => 'Error'],422);
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
        $item = Persona::select([
                                    'id',
                                    'nombres',
                                    'apellidos',
                                    'fechaNacimiento',
                                    'municipio_id_nacimiento',
                                    'profesion_id',
                                    'genero_id',
                                    'partido_id',
                                    'fecha_fallecimiento',
                                    'perfil_educativo',
                                    'grado_estudio_id',
                                    'nombreSuplente',
                                    'activo',
                                ])
                       ->where('id', $id)
                       ->with(['Imagenes', 'Contactos', 'Partido'])
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
        $validator = Validator::make($request->all(), Persona::rulesPut(), Persona::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $itemOriginal = Persona::find($id);

            if($request->hasFile('imagen'))
            {
                $imagenesAnteriores = PersonaImagen::select('id')
                                                       ->where('persona_id', $itemOriginal->id)
                                                       ->where('activo', 1)
                                                       ->get();
                $files = $request->file('imagen');

                if($imagenesAnteriores != null)
                {
                    foreach ($imagenesAnteriores as $key => $imagenAnterior)
                    {
                        $imgAnterior = PersonaImagen::find($imagenesAnteriores[$key]->id);
                        if(Storage::disk('public')->exists($imgAnterior->imagen))
                            Storage::disk('public')->delete($imgAnterior->imagen);
                        $imgAnterior->usermodifed = $request->user;
                        $imgAnterior->activo = 0;
                        $imgAnterior->save();
                    }
                }
                $nombre = $id;
                foreach ($files as $file)
                {
                    // Se crea registro
                    $imagen = new PersonaImagen;
                    $imagen->usercreated = $request->user;
                    $imagen->persona_id = $id;
                    $imagen->activo = 1;
                    $path = $file->storeAs(
                        '/persona/'.$nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $imagen->imagen = $path;
                    $imagen->save();
                }
            }
            $request->request->add(['usermodifed' => $request->user]);
            $itemOriginal->fill($request->all());
            $itemOriginal->save();

            // Checamos la trayectoria pública
            if ($request->has('persona_trayectoria_publica'))
            {
                // Solamente los que se devuelvan activos desde la vista
                $items = array_filter(
                    $request->persona_trayectoria_publica,
                    function ($item)
                    {
                        if ($item["activo"])
                        {
                            return $item;
                        }
                    }
                );
                // Ponemos todos las trayectorias publicas a activo 0
                PersonaTrayectoriaPublica::where(
                    [
                        [
                            'persona_id',
                            $itemOriginal->id
                        ]
                    ]
                )->update(['activo' => 0]);
                // Recorremos el listado de items que se trae de la vista
                foreach ($items as $item)
                {
                    $item_trayectoria_publica = PersonaTrayectoriaPublica::where(
                        [
                            [
                                'id',
                                $item["id"]
                            ],
                            [
                                'persona_id',
                                $itemOriginal->id
                            ]
                        ]
                    )->first();
                    // Checamos si existe en la bd el item
                    if ($item_trayectoria_publica != null)
                    {
                        // Si existe actualizamos el activo y su fecha de modificación
                        $item_trayectoria_publica->fill($item);
                        $item_trayectoria_publica->usermodifed = $request->user;
                    }
                    else
                    {
                        // Como no existe creamos un nuevo item
                        // Y lo agregamos a la bd
                        $item_trayectoria_publica = new PersonaTrayectoriaPublica();
                        $item_trayectoria_publica->fill($item);
                        $item_trayectoria_publica->usercreated = $request->user;
                    }
                    $item_trayectoria_publica->persona_id = $itemOriginal->id;
                    $item_trayectoria_publica->activo = 1;
                    $item_trayectoria_publica->save();
                }
                //Borramos los que esten activo 0
                PersonaTrayectoriaPublica::where(
                    [
                        [
                            'persona_id',
                            $itemOriginal->id
                        ],
                        [
                            'activo',
                            0
                        ]
                    ]
                )->delete();
            }
            // Checamos la trayectoria privada
            if ($request->has('persona_trayectoria_privada'))
            {
                // Solamente los que se devuelvan activos desde la vista
                $items = array_filter(
                    $request->persona_trayectoria_privada,
                    function ($item)
                    {
                        if ($item["activo"])
                        {
                            return $item;
                        }
                    }
                );
                // Ponemos todos las trayectorias privadas a activo 0
                PersonaTrayectoriaPrivada::where(
                    [
                        [
                            'persona_id',
                            $itemOriginal->id
                        ]
                    ]
                )->update(['activo' => 0]);
                // Recorremos el listado de items que se trae de la vista
                foreach ($items as $item)
                {
                    $item_trayectoria_privada = PersonaTrayectoriaPrivada::where(
                        [
                            [
                                'id',
                                $item["id"]
                            ],
                            [
                                'persona_id',
                                $itemOriginal->id
                            ]
                        ]
                    )->first();
                    // Checamos si existe en la bd el item
                    if ($item_trayectoria_privada != null)
                    {
                        // Si existe actualizamos el activo y su fecha de modificación
                        $item_trayectoria_privada->fill($item);
                        $item_trayectoria_privada->usermodifed = $request->user;
                    }
                    else
                    {
                        // Como no existe creamos un nuevo item
                        // Y lo agregamos a la bd
                        $item_trayectoria_privada = new PersonaTrayectoriaPrivada();
                        $item_trayectoria_privada->fill($item);
                        $item_trayectoria_privada->usercreated = $request->user;
                    }
                    $item_trayectoria_privada->persona_id = $itemOriginal->id;
                    $item_trayectoria_privada->activo = 1;
                    $item_trayectoria_privada->save();
                }
                //Borramos los que esten activo 0
                PersonaTrayectoriaPrivada::where(
                    [
                        [
                            'persona_id',
                            $itemOriginal->id
                        ],
                        [
                            'activo',
                            0
                        ]
                    ]
                )->delete();
            }
            // Checamos los contactos
            if ($request->has('persona_dato_contactos'))
            {
                // Solamente los que se devuelvan activos desde la vista
                $items = array_filter(
                    $request->persona_dato_contactos,
                    function ($item)
                    {
                        if ($item["activo"])
                        {
                            return $item;
                        }
                    }
                );
                // Ponemos todos los contactos a activo 0
                PersonaDatoContacto::where(
                    [
                        [
                            'persona_id',
                            $itemOriginal->id
                        ]
                    ]
                )->update(['activo' => 0]);
                // Recorremos el listado de items que se trae de la vista
                foreach ($items as $item)
                {
                    $item_contacto = PersonaDatoContacto::where(
                        [
                            [
                                'id',
                                $item["id"]
                            ],
                            [
                                'persona_id',
                                $itemOriginal->id
                            ]
                        ]
                    )->first();

                    // Checamos si existe en la bd el item
                    if ($item_contacto != null)
                    {
                        // Si existe actualizamos el activo y su fecha de modificación
                        $item_contacto->fill($item);
                        $item_contacto->usermodifed = $request->user;
                    }
                    else
                    {
                        // Como no existe creamos un nuevo item
                        // Y lo agregamos a la bd
                        $item_contacto = new PersonaDatoContacto();
                        $item_contacto->fill($item);
                        $item_contacto->usercreated = $request->user;
                    }
                    $item_contacto->persona_id = $itemOriginal->id;
                    $item_contacto->activo = 1;
                    $item_contacto->save();
                }
                //Borramos los que esten activo 0
                PersonaDatoContacto::where(
                    [
                        [
                            'persona_id',
                            $itemOriginal->id
                        ],
                        [
                            'activo',
                            0
                        ]
                    ]
                )->delete();
            }

            DB::commit();

            return response()->json(
                ['message' => 'OK'],
                202
            );
        }
        catch (QueryException $ex)
        {
            DB::rollback();
            return response()->json(['message' => 'Error'],422);
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
        $item = Persona::find($id);
        $item->activo = !$item->activo;
        $item->save();
        return response($item);
    }

    /**
     * Display a totalrecords of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function totalrecords(Request $request)
    {
        $query = Persona::query();

        if ($request->has('genero_id') && !is_null($request["genero_id"]))
        {
            $query->where(
                'genero_id',
                $request->genero_id
            );
        }

        if ($request->has('profesion_id') && !is_null($request["profesion_id"]))
        {
            $query->where(
                'profesion_id',
                $request->profesion_id
            );
        }

        if ($request->has('partido_id') && !is_null($request["partido_id"]))
        {
            $query->where(
                'partido_id',
                $request->partido_id
            );
        }

        if ($request->has('grado_estudio_id') && !is_null($request["grado_estudio_id"]))
        {
            $query->where(
                'grado_estudio_id',
                $request->grado_estudio_id
            );
        }

        if ($request->has('lugar_nacimiento_id') && !is_null($request["lugar_nacimiento_id"]))
        {
            $query->where(
                'municipio_id_nacimiento',
                $request->lugar_nacimiento_id
            );
        }

        if ($request->has('idFilter') && !is_null($request["idFilter"]))
        {
            $query->where(
                'activo',
                $request->idFilter
            );
        }

        if ($request->has('search') && !is_null($request["search"]))
        {
            $search = $request->input('search');
            $search = str_replace(' ', '%', $search);
            $query->Where(function($query) use ($search){
                $query->where(DB::raw("CONCAT(`nombres`, ' ',COALESCE(`apellidos`,''))"), 'LIKE', "%".$search."%")
                    ->orWhere(DB::raw("CONCAT(COALESCE(`apellidos`,''), ' ', `nombres`)"), 'LIKE', "%".$search."%")
                    ->orWhere(DB::raw("nombreSuplente"), 'LIKE', "%".$search."%")
                      ->orWhere(DB::raw("(DATE_FORMAT(fechaNacimiento,'%Y-%m-%d'))"), 'LIKE', '%' . $search . '%')
                      ->orWhere(DB::raw("(DATE_FORMAT(fecha_fallecimiento,'%Y-%m-%d'))"), 'LIKE', '%' . $search . '%')
                      ->orWhere(function ($query) use ($search){
                          $query->orWhereHas('LugarNacimiento', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          })->orWhereHas('GradoEstudio', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          })->orWhereHas('Genero', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          })->orWhereHas('Profesion', function ($query) use ($search) {
                              $query->where('nombre', 'like', '%'. $search .'%');
                          });
                      });
            });
        }

        $count = $query->select(
            [
                'id',
                'nombres',
                'apellidos',
                'fechaNacimiento',
                'municipio_id_nacimiento',
                'profesion_id',
                'genero_id',
                'fecha_fallecimiento',
                'grado_estudio_id',
                'nombreSuplente',
                'activo'
            ])
           ->with(['LugarNacimiento', 'GradoEstudio', 'Genero', 'Profesion', 'Imagenes'])
           ->get()->count();

        return response($count);
    }
}
