<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\GrupoEdad;
use App\Models\GrupoEdadImagen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class GrupoEdadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $items = GrupoEdad::select('id','nombre','edad_inicial','edad_final','activo')
        ->where('activo',($filter != "-1") ? '=' : '!=',$filter)
        ->where('nombre','LIKE','%' . $request->input('search') . '%')
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),GrupoEdad::$rulesPost,GrupoEdad::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try
        {
            $item = new GrupoEdad();
            $request->request->add(['usercreated' => $request->user]);
            $result = $item->create($request->all());
            $files = $request->file('imagen');
            if ($request->hasFile('imagen'))
            {
                $id = $result->id;
                $nombre = $id;
                foreach ($files as $file)
                {
                    // Se crea registro
                    $imagen = new GrupoEdadImagen();
                    $imagen->usercreated = $request->user;
                    $imagen->grupo_edad_id = $id;
                    $imagen->activo = 1;
                    $path = $file->storeAs(
                        '/grupo-edad/' . $nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $imagen->imagen = $path;
                    $imagen->save();
                }
            }
            DB::commit();
            return response()->json(['message' => 'OK'],202);
        }
        catch (\Exception $e)
        {
            DB::rollback();
            return response()->json(['message' => 'Error'],204);
        }
    }
    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $item = GrupoEdad::select('id', 'nombre', 'edad_inicial', 'edad_final', 'activo')
            ->with('GrupoEdadImagen')->where('id', $id)
            ->get()
            ->first();
        return response($item, 200);
    }
    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request,$id)
    {
        $validator = Validator::make($request->all(),GrupoEdad::$rulesPut,GrupoEdad::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try
        {
            $itemOriginal = GrupoEdad::find($id);
            $request->request->add(['usermodifed' => $request->user]);
            if ($request->hasFile('imagen')) {
                $imagenesAnteriores = GrupoEdadImagen::select('id')
                    ->where('grupo_edad_id', $itemOriginal->id)
                    ->where('activo', 1)
                    ->get();
                $files = $request->file('imagen');

                if ($imagenesAnteriores != null)
                {
                    foreach ($imagenesAnteriores as $key => $imagenAnterior)
                    {
                        $imgAnterior = GrupoEdadImagen::find($imagenesAnteriores[$key]->id);
                        if (Storage::disk('public')->exists($imgAnterior->imagen))
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
                    $imagen = new GrupoEdadImagen();
                    $imagen->usercreated = $request->user;
                    $imagen->grupo_edad_id = $id;
                    $imagen->activo = 1;
                    $path = $file->storeAs(
                        '/grupo-edad/' . $nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $imagen->imagen = $path;
                    $imagen->save();
                }
            }
            $itemOriginal->fill($request->all());
            $itemOriginal->save();
            DB::commit();
            return response()->json(['message' => 'OK'],202);
        }
        catch (\Exception $e)
        {
            DB::rollback();
            return response()->json(['message' => 'Error'],204);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $item = GrupoEdad::find($id);
        $item->activo = !$item->activo;
        $item->save();
        return response($item,200);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $count = GrupoEdad::where('activo',($filter != "-1") ? '=' : '!=',$filter)
        ->where('nombre','LIKE','%' . $request->input('search') . '%')
        ->count();
        return response($count,200);
    }
}
