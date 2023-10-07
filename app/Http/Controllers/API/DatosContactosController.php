<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DatosContacto;
use App\Models\DatosContactoImagen;
use Validator;
use Illuminate\Support\Facades\Storage;
use DB;

class DatosContactosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $datoscontacto = DatosContacto::select('id','nombre', 'tipo','activo')
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($datoscontacto, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), DatosContacto::$rulesPost,  DatosContacto::$messagesPost);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $datoscontacto = new DatosContacto;
            $request->request->add(['usercreated' => $request->user]);
            $result = $datoscontacto->create($request->all());
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
                        $imagemDatosContacto = new DatosContactoImagen;
                        $imagemDatosContacto->usercreated = $request->user;
                        $imagemDatosContacto->datos_contacto_id = $id;
                        $imagemDatosContacto->activo = 1;
                        $path = $file->storeAs(
                            '/datoscontacto/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );                
                        $imagemDatosContacto->imagen = $path;
                        $imagemDatosContacto->save();
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
        $datoscontacto = DatosContacto::select('id','nombre', 'tipo','activo')
        ->with('datosContactoImagen')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($datoscontacto, 200);
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
        $validator = Validator::make($request->all(), DatosContacto::$rulesPut,  DatosContacto::$messagesPut);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $datoscontacto = DatosContacto::find($id);
            $files = $request->file('imagen');
            if($request->hasFile('imagen'))
            {
                $imagenesAnteriores = DatosContactoImagen::select('id')
                ->where('datos_contacto_id', $datoscontacto->id)
                ->where('activo', 1)
                ->get();
                $files = $request->file('imagen');

                if($imagenesAnteriores != null)
                {
                    foreach ($imagenesAnteriores as $key => $imagenAnterior) 
                    {
                        $imgAnterior = DatosContactoImagen::find($imagenesAnteriores[$key]->id);
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
                    $imagemDatosContacto = new DatosContactoImagen;
                    $imagemDatosContacto->usercreated = $request->user;
                    $imagemDatosContacto->datos_contacto_id = $id;
                    $imagemDatosContacto->activo = 1;
                    $path = $file->storeAs(
                        '/datoscontacto/'.$nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );                
                    $imagemDatosContacto->imagen = $path;
                    $imagemDatosContacto->save();
                }  
            }
            $request->request->add(['usermodifed' => $request->user]);
            $datoscontacto->fill($request->all());
            $datoscontacto->save();
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $datoscontacto = DatosContacto::find($id);
        $datoscontacto->activo=!$datoscontacto->activo;
        $datoscontacto->save();
        return response($datoscontacto, 200);
    }
}
