<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\Partido;
use App\Models\PartidoImagen;
use App\Models\PartidoDatosContacto;
use Validator;
use DB;

class PartidosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $partido = Partido::select('id','nombre','activo')
        ->where('activo', ($request->input('idFilter') != "-1") ? '=' : '!=', $request->input('idFilter'))
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($partido, 200);
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), Partido::$rulesPost, Partido::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try 
        {
            $partido = new Partido;
            $request->request->add(['usercreated' => $request->user]);
            $result = $partido->create($request->all());
            $id = $result->id;
            if($result != null)
            {
                $files = $request->file('imagen');
                if($request->hasFile('imagen'))
                {
                    $nombre = $id;                    
                    foreach ($files as $file) 
                    {
                        // Se crea registro
                        $imagenPartido = new PartidoImagen;
                        $imagenPartido->usercreated = $request->user;
                        $imagenPartido->partido_id = $id;
                        $imagenPartido->activo = 1;
                        $path = $file->storeAs(
                            '/partidos/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );                
                        $imagenPartido->imagen = $path;
                        $imagenPartido->save();
                    }   
                }
            }
            DB::commit();
            return response()->json(['message' => 'OK'], 201);
        } 
        catch (\Exception $e) 
        {
            DB::rollback();
            return response()->json(['message' => 'Error'], 422);
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
        $partido = Partido::select('id','nombre','activo')
        ->with('partidoImagen')
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
        $validator = Validator::make($request->all(), Partido::$rulesPut, Partido::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try 
        {
            $partido = Partido::find($id);                
            $files = $request->file('imagen');
            if($request->hasFile('imagen'))
            {
                $imagenesAnteriores = PartidoImagen::select('id')
                ->where('partido_id', $partido->id)
                ->where('activo', 1)
                ->get();
                $files = $request->file('imagen');

                if($imagenesAnteriores != null)
                {
                    foreach ($imagenesAnteriores as $key => $imagenAnterior) 
                    {
                        $imgAnterior = PartidoImagen::find($imagenesAnteriores[$key]->id);
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
                    $imagenPartido = new PartidoImagen;
                    $imagenPartido->usercreated = $request->user;
                    $imagenPartido->partido_id = $id;
                    $imagenPartido->activo = 1;
                    $path = $file->storeAs(
                        '/partidos/'.$nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );                
                    $imagenPartido->imagen = $path;
                    $imagenPartido->save();
                }  
            }
            $request->request->add(['usermodifed' => $request->user]);
            $partido->fill($request->all());

            $partido->save();
            DB::commit();
            return response()->json(['message' => 'OK'], 202);
        } 
        catch (\Exception $e) 
        {
            DB::rollback();
            return response()->json(['message' => 'Error'], 422);
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
        $partido = Partido::find($id);
        $partido->activo=!$partido->activo;
        $partido->save();
        return response($partido, 200);
    }
        /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function totalrecords(Request $request)
    {
        $count = Partido::where('activo', $request->input('idFilter'))
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%' )
        ->count();
        return response($count, 200);
    }
}
