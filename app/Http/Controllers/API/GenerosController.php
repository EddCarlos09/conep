<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Genero;
use App\Models\GeneroImagen;
use Validator;
use App\Messages;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use DB;

class GenerosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $generoIndex = Genero::select('id','nombre','activo')
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($generoIndex, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), Genero::$rulesPost,  Genero::$messagesPost);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try{
            $genero = new Genero;
            $request->request->add(['usercreated' => $request->user]);
            $result = $genero->create($request->all());
            $id = $result->id;
            if($result != null){
                $files = $request->file('imagen');
                if($request->hasFile('imagen'))
                {
                    $nombre = $id;                    
                    foreach ($files as $file) {
                        // Se crea registro
                        $generoImagen = new GeneroImagen;
                        $generoImagen->usercreated = $request->user;
                        $generoImagen->genero_id = $id;
                        $generoImagen->activo = 1;
                        $path = $file->storeAs(
                            '/generos/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );                
                        $generoImagen->imagen = $path;
                        $generoImagen->save();
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
        $genero = Genero::select('id','nombre','activo')
        ->with('generoImagen')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($genero, 200);
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
        $validator = Validator::make($request->all(), Genero::$rulesPut,  Genero::$messagesPut);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $genero = Genero::find($id);
            if($request->hasFile('imagen'))
            {
                $imagenesAnteriores = GeneroImagen::select('id')
                ->where('genero_id', $id)
                ->where('activo', 1)
                ->get();
                if($imagenesAnteriores != null)
                {
                    foreach ($imagenesAnteriores as $key => $imagenAnterior)
                    {
                        $imgAnterior = GeneroImagen::find($imagenesAnteriores[$key]->id);
                        if(Storage::disk('public')->exists($imgAnterior->imagen))
                            Storage::disk('public')->delete($imgAnterior->imagen);
                        $imgAnterior->usermodifed = $request->user;
                        $imgAnterior->activo = 0;
                        $imgAnterior->save();
                    }
                }
                $nombre = $id;
                $files = $request->file('imagen');
                foreach ($files as $file)
                {
                    // Se crea registro
                    $imagenGenero = new GeneroImagen;
                    $imagenGenero->usercreated = $request->user;
                    $imagenGenero->genero_id = $id;
                    $imagenGenero->activo = 1;
                    $path = $file->storeAs(
                        '/generos/'.$nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $imagenGenero->imagen = $path;
                    $imagenGenero->save();
                }
            }
           
            $request->request->add(['usermodifed' => $request->user]);
            $genero->fill($request->all());
            $genero->save();
            DB::commit();
            return response()->json(['message' => 'OK'], 200);

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
        $genero = Genero::find($id);
        $genero->activo=!$genero->activo;
        $genero->save();
        return response($genero, 200);
    }
}
