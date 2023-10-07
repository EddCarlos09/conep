<?php

namespace App\Http\Controllers\API;

use DB;
use Validator;
use App\Models\Multimedia;
use Illuminate\Http\Request;
use App\Models\MultimediaArchivo;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class MultimediaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $multimedia = Multimedia::select('id','titulo','fechaPublicacion','descripcion','activo')
        ->where('activo', $request->input('idFilter'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($multimedia,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {      
        $validator = Validator::make($request->all(), Multimedia::$rulesPost, Multimedia::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try 
        {
            $multimedia = new Multimedia();
            $request->request->add(['usercreated' => $request->user]);
            // $request->request->add(['tipo_multimedia_id' => $request->tipo_publicacion_id]);      
            $result = $multimedia->create($request->all());
            $id = $result->id;          
            if($result != null)
            {
                $file = $request->file('archivo');                                         
                if($file != null){
                    $archivo = new MultimediaArchivo();
                    $archivo->usercreated = $request->user;
                    $archivo->multimedia_id = $id;
                    $archivo->activo = 1;
                    $path = $file->storeAs('/Multimedia', // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );                              
                    $archivo->archivo =$path;
                    $archivo->save();          
                }else{
                    $archivo = new MultimediaArchivo();
                    $request->request->add(['usercreated' => $request->user]);
                    $request->request->add(['multimedia_id' => $id]); 
                    $request->request->add(['activo' =>1]);                                                                 
                    $archivo->create($request->all());          
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
        $multimedia = Multimedia::select('id','titulo','tipo_multimedia_id','fechaPublicacion','descripcion','activo')
        ->with('MultimediaArchivo')
        ->where('id',$id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($multimedia,200);
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
        // dd($request);
        $validator = Validator::make($request->all(), Multimedia::$rulesPut, Multimedia::$rulesPutMessages);
        
        if ($validator->passes())
        {
            DB::beginTransaction();
            try
            {
                $multimedia = Multimedia::find($id);

                $multimediaArchivo = MultimediaArchivo::findOrFail($request->multimedia_id);                                                                
                    
                $archivo = $request->file('archivo');                 
                if($archivo != null)
                {                        
                    if(Storage::disk('public')->exists($multimediaArchivo->archivo))
                        Storage::disk('public')->delete($multimediaArchivo->archivo);

                    $item = MultimediaArchivo::find($request->multimedia_id);
                    $item->usercreated = $request->user;                    
                    $path = $archivo->storeAs('/Multimedia', // Directorio
                        $archivo->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );                     
                    $item->archivo = $path;  
                    $item->urlAudio = $request->urlAudio;
                    $item->urlVideo = $request->urlVideo;                                                                                                                                                
                    $item->save();                                                           
                }else
                {
                    $item = MultimediaArchivo::find($request->multimedia_id);
                    $request->request->add(['usermodifed' => $request->user]);
                    $request->request->add(['archivo' => $request->archivo]);                                                                                          
                    $request->request->add(['urlAudio' => $request->urlAudio]);
                    $request->request->add(['urlVideo' => $request->urlVideo]);                                                                                          
                    $item->fill($request->all());
                    $item->save();  
                }                 
                $request->request->add(['usermodifed' => $request->user]);
                $multimedia->fill($request->all());
                $multimedia->save();                  
                DB::commit();
                return response()->json(['message' => 'OK'], 202);  
            }         
            catch(\Exception $e)
            {
                DB::rollback();
                return response()->json(['message' => 'Error'], 422);
            }
        }else
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
        $multimedia = Multimedia::find($id);    
        $multimedia->activo=!$multimedia->activo;
        $multimedia->save();
        return response($multimedia, 200);
    }
}
