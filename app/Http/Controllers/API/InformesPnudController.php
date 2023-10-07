<?php

namespace App\Http\Controllers\API;

use Validator;
use App\Models\InformesPnud;
use Illuminate\Http\Request;
use App\Models\DocumentosInforme;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class InformesPnudController extends Controller
{
    /**
     * Informes.
     *
     */
    public function index(Request $request)
    {
        $informes = InformesPnud::select('id','nombre','activo')
        ->where('activo',$request->input('idFilter'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($informes,200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),InformesPnud::$rulesPost,InformesPnud::$rulesPostMessages);
        if($validator->fails()){
            return response()->json($validator->errors(),422);
        }
        DB::beginTransaction();
        try {
            $item = new InformesPnud();
            $request->request->add(['usercreated'=>$request->user]);
            $item->create($request->all());
            DB::commit();

            return response()->json(['message'=>'OK'],202);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json(['message'=>'Error'],204);
        }
    }

    public function show($id)
    {
        $informe = InformesPnud::select()
        ->where('id',$id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($informe,200);
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(),InformesPnud::$rulesPut,InformesPnud::$rulesPutMessages);
        if($validator->fails()){
            return response()->json($validator->errors(),422);
        }
        DB::beginTransaction();
        try {
            $item = InformesPnud::find($id);
            $request->request->add(['usermodifed' => $request->user]);
            $item->fill($request->all());
            $item->save();
            DB::commit();

            return response()->json(['message' => 'OK'],202);            
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json(['message' => 'Error'],204);
        }
    }  
    public function destroy($id)
    {
        $item = InformesPnud::find($id);
        $item->activo = !$item->activo;
        $item->save();

        return response($item,200);
    }

    /**
     * Documentos Informes.
     *
     */

    public function indexDocumento(Request $request,$id)
    {
        // $item = DocumentosInforme::find($id); 
        // $url = public_path('uploads/'.$item->documento);  

        $documentos = DocumentosInforme::select('id','titulo','documento','activo')   
        ->where(['activo' => $request->input('idFilter'),'informes_pnud_id' => $id])
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($documentos,200);
    }

    public function storeDocumento(Request $request)
    {     
        $validator = Validator::make($request->all(),DocumentosInforme::$rulesPost,DocumentosInforme::$rulesPostMessages);        
        if($validator->fails()){
            return response()->json($validator->errors(),422);
        }
        DB::beginTransaction();
        try 
        {
                $file = $request->file('documento');               
                // Se crea registro
                $documento = new DocumentosInforme();
                $documento->usercreated = $request->user;
                $documento->titulo = $request->titulo;
                $documento->informes_pnud_id = $request->informes_pnud_id;
                $documento->activo = 1;
                $path = $file->storeAs('/InformesPNUD', // Directorio
                    $file->getClientOriginalName(), // Nombre real de la imagen
                    'public' // disco
                );                
                // $documento->documento = public_path('uploads/'.$path);
                $documento->documento =$path;
                $documento->save();                                    
                
                DB::commit();
            return response()->json(['message'=>'OK'],202);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json(['message'=>'Error'],204);
        }
    }

    public function showDocumento($id)
    {                                                      
        $documento = DocumentosInforme::select()
        ->where('id',$id)      
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($documento,200);
    }
    public function updateDocumento(Request $request, $id)
    {     
        $validator = Validator::make($request->all(),DocumentosInforme::$rulesPut,DocumentosInforme::$rulesPutMessages);
        if($validator->passes()){
        DB::beginTransaction();
        try {
            $item = DocumentosInforme::find($id);                          
            if($item->documento != $request->documento){
                $file = $request->file('documento');
                if(Storage::disk('public')->exists($item->documento))               
                    Storage::disk('public')->delete($item->documento);                
                $item->usermodifed = $request->user;
                $item->titulo = $request->titulo;
                $path = $file->storeAs('/InformesPNUD', // Directorio
                    $file->getClientOriginalName(), // Nombre real de la imagen
                    'public' // disco
                );   
                $item->documento = $path;
                $item->save();
            }else{
                $item->usermodifed = $request->user;
                $item->titulo = $request->titulo;     
                $item->save();
            }

            DB::commit();
            return response()->json(['message' => 'OK'],202);            
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json(['message' => 'Error'],204);
        }
        }else
            return response()->json($validator->errors(),422);              
    }  
    public function destroyDocumento($id)
    {
        $item = DocumentosInforme::find($id);
        $item->activo = !$item->activo;
        $item->save();

        return response($item,200);
    }
}
