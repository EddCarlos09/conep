<?php

namespace App\Http\Controllers\API;

use DB;
use Validator;
use App\Models\Opinion;
use Illuminate\Http\Request;
use App\Models\OpinionImagen;
use App\Http\Controllers\Controller;
use App\Models\OpinionDatosContacto;
use Illuminate\Support\Facades\Storage;

class OpinionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $opinion = Opinion::select('id','titulo','equipo_id','fechaPublicacion','resumen','opinion','activo')
        ->where('activo', $request->input('idFilter'))
        ->orderBy('id','desc')        
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($opinion,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {           
        $validator = Validator::make($request->all(), Opinion::$rulesPost, Opinion::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try 
        {
            $opinion = new Opinion();
            $request->request->add(['usercreated' => $request->user]);
            $result = $opinion->create($request->all());
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
                        $imagenOpinion = new OpinionImagen();
                        $imagenOpinion->usercreated = $request->user;
                        $imagenOpinion->opinion_id = $id;
                        $imagenOpinion->activo = 1;
                        $path = $file->storeAs(
                            '/Opinion/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );                
                        $imagenOpinion->imagen = $path;
                        $imagenOpinion->save();
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
        $opinion = Opinion::select('id','titulo','equipo_id','tipo_publicacion_id','fechaPublicacion','resumen','opinion','activo')
        ->with('OpinionImagen')    
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($opinion,200);
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
        $validator = Validator::make($request->all(), Opinion::$rulesPut, Opinion::$rulesPutMessages);
        
        if ($validator->passes())
        {
            DB::beginTransaction();
            try
            {
                $opinion = Opinion::find($id);      
                if($request->hasFile('imagen'))
                {
                    // dd($request);
                    $imagenesAnteriores = OpinionImagen::select('id')
                    ->where('opinion_id',$opinion->id)
                    ->where('activo',1)
                    ->get();
                    $files = $request->file('imagen');
                    
                    if($imagenesAnteriores != null)
                    {
                        foreach($imagenesAnteriores as $key => $imagenAnterior)
                        {
                            $imgAnterior = OpinionImagen::find($imagenesAnteriores[$key]->id);
                            if(Storage::disk('public')->exists($imgAnterior->imagen))
                                Storage::disk('public')->delete($imgAnterior->imagen);
                            $imgAnterior->usermodifed = $request->user;
                            $imgAnterior->activo = 0;
                            $imgAnterior->save();
                        }
                    }
                    $nombre = $id;
                    foreach($files as $file)
                    {
                         // Se crea registro
                        $imagenOpinion = new OpinionImagen();
                        $imagenOpinion->usercreated = $request->user;
                        $imagenOpinion->opinion_id = $id;
                        $imagenOpinion->activo = 1;
                        $path = $file->storeAs(
                            '/Opinion/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );                
                        $imagenOpinion->imagen = $path;
                        $imagenOpinion->save();
                    }                    
                }
                $request->request->add(['usermodifed' => $request->user]);
                $opinion->fill($request->all());
                $opinion->save();
                
                DB::commit();
                return response()->json(['message' => 'OK'], 202);
            }
            catch(\Exception $e)
            {
                DB::rollback();
                return response()->json(['message' => 'Error'], 422);
            }
        }
        else 
            return response()->json($validator->errors(), 422);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $opinion = Opinion::find($id);
        $opinion->activo=!$opinion->activo;
        $opinion->save();
        return response($opinion, 200);
    }
}
