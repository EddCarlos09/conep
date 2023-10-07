<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CongresoVisible;
use App\Models\CongresoVisibleAliado;
use App\Models\CongresoVisibleAliadoImagen;
use App\Models\CongresoVisibleDatosContacto;
use App\Models\CongresoVisibleEquipo;
use App\Models\CongresoVisibleEquipoDatosContacto;
use App\Models\CongresoVisibleEquipoImagen;
use App\Models\CongresoVisibleEquipoIntegrante;
use App\Models\CongresoVisibleIntegranteDatoContacto;
use App\Models\CongresoVisibleImagen;
use Illuminate\Http\Request;
use Validator;
use DB;
use Illuminate\Support\Facades\Storage;

class CongresoVisibleController extends Controller
{
    /**
     * Congreso Visible.
     */
    public function index()
    {
        $congresovisible = CongresoVisible::select('id','queEs','objetivos','historiaymision',
        'nuestroFuturo', 'nuestroReto','activo')        
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($congresovisible,200);
    }
    
    public function store(Request $request)
    {
        //
    }

    public function show($id)
    {
        $congresovisible = CongresoVisible::select('id','queEs','objetivos','historiaymision',
        'nuestroFuturo', 'nuestroReto','activo')
        ->with('congresoVisibleDatosContacto')
        ->with('congresoVisibleImagen')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($congresovisible,200);
    }

    public function update(Request $request, $id)
    {
        //, CongresoVisible::$rulesPut, CongresoVisible::$rulesPutMessages
        $validator = Validator::make($request->all(),CongresoVisible::$rulesPut, CongresoVisible::$rulesPutMessages); 
        if ($validator->passes())
        {
            DB::beginTransaction();
            try
            {
                $congresoVisible = CongresoVisible::find($id);
                // $file = $request->file('congreso_visible_imagen');        
                if($request->hasFile('imagen'))
                {
                    // dd($request);
                    $imagenesAnteriores = CongresoVisibleImagen::select('id')
                    ->where('congreso_visible_id',$congresoVisible->id)
                    ->where('activo',1)
                    ->get();
                    $files = $request->file('imagen');
                    
                    if($imagenesAnteriores != null)
                    {
                        foreach($imagenesAnteriores as $key => $imagenAnterior)
                        {
                            $imgAnterior = CongresoVisibleImagen::find($imagenesAnteriores[$key]->id);
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
                        $imagenCongreso = new CongresoVisibleImagen;
                        $imagenCongreso->usercreated = $request->user;
                        $imagenCongreso->congreso_visible_id = $id;
                        $imagenCongreso->activo = 1;
                        $path = $file->storeAs(
                            '/congresoVisible/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );                
                        $imagenCongreso->imagen = $path;
                        $imagenCongreso->save();
                    }                    
                }
                $request->request->add(['usermodifed' => $request->user]);
                $congresoVisible->fill($request->all());
                $congresoVisible->save();

                $datosContacto = $request->input('datosContacto');
                if($datosContacto != null)
                {
                    foreach($request->input('datosContacto') as $key => $value)
                    {
                        $datosContacto[$key]['congreso_visible_id'] = $id;
                        $requestDatos = new Request($datosContacto[$key]);
                        if($requestDatos->id > 0)
                        {
                            if($requestDatos->activo == 1)
                            {
                                $congresoDatosContacto = CongresoVisibleDatosContacto::find($requestDatos->id);
                                $congresoDatosContacto->fill($requestDatos->all());
                                $congresoDatosContacto->usermodifed = $request->user;
                                $congresoDatosContacto->save();
                            }
                            else
                            {
                                $congresoDatosContacto = CongresoVisibleDatosContacto::find($requestDatos->id);
                                $congresoDatosContacto->activo = 0;
                                $congresoDatosContacto->usermodifed = $request->user;
                                $congresoDatosContacto->save();
                            } 
                        }else
                        {
                            if($requestDatos->activo == 1)
                            {
                                $congresoDatosContacto = new CongresoVisibleDatosContacto;
                                $congresoDatosContacto->fill($requestDatos->all());
                                $congresoDatosContacto->usercreated = $request->user;
                                $congresoDatosContacto->save();
                            }
                        }
                    }
                }
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

    public function destroy($id)
    {
        //
    }

    /**
     * Congreso visible Equipo
     */
    public function indexEquipos(Request $request)
    {
        $Equipo = CongresoVisibleEquipo::select('id','nombre','descripcion','congreso_visible_id','activo')
        ->where('activo', $request->input('idFilter'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($Equipo,200);
    }

    public function showEquipo($id)
    {
        $Equipo = CongresoVisibleEquipo::select('id','nombre','descripcion','congreso_visible_id','activo')
        ->with('equipoImagen','equipoDatosContacto')    
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($Equipo,200);
    }

    public function storeEquipo(Request $request)
    {
        $validator = Validator::make($request->all(), CongresoVisibleEquipo::$rulesPost, CongresoVisibleEquipo::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try 
        {
            $equipo = new CongresoVisibleEquipo();
            $request->request->add(['usercreated' => $request->user]);
            $result = $equipo->create($request->all());
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
                        $imagenEquipo = new CongresoVisibleEquipoImagen();
                        $imagenEquipo->usercreated = $request->user;
                        $imagenEquipo->equipo_id = $id;
                        $imagenEquipo->activo = 1;
                        $path = $file->storeAs(
                            '/Equipos/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );                
                        $imagenEquipo->imagen = $path;
                        $imagenEquipo->save();
                    }   
                }
                
                $datosContacto = $request->input('datosContacto');
                if($datosContacto != null)
                {
                    foreach($request->input('datosContacto') as $key => $value)
                    {
                        $datosContacto[$key]['equipo_id'] = $id;
                        $requestequipoDatosContacto = new Request($datosContacto[$key]);
                        if($requestequipoDatosContacto->activo == 1)
                        {
                            $equipoDatosContacto = new CongresoVisibleEquipoDatosContacto();
                            $equipoDatosContacto->fill($requestequipoDatosContacto->all());
                            $equipoDatosContacto->usercreated = $request->user;
                            $equipoDatosContacto->save();
                        }
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

    public function updateEquipo(Request $request, $id)
    {     
        $validator = Validator::make($request->all(), CongresoVisibleEquipo::$rulesPut, CongresoVisibleEquipo::$rulesPutMessages);        
        if ($validator->passes())
        {
            DB::beginTransaction();
            try
            {             
                $congresoVisibleEquipo = CongresoVisibleEquipo::find($id);                   
                if($request->hasFile('imagen'))
                {               
                    $imagenesAnteriores = CongresoVisibleEquipoImagen::select('id')
                    ->where('equipo_id',$congresoVisibleEquipo->id)
                    ->where('activo',1)
                    ->get();
                    $files = $request->file('imagen');                                    
                    
                    if($imagenesAnteriores != null)
                    {
                        foreach($imagenesAnteriores as $key => $imagenAnterior)
                        {
                            $imgAnterior = CongresoVisibleEquipoImagen::find($imagenesAnteriores[$key]->id);
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
                        $imagenEquipo = new CongresoVisibleEquipoImagen;
                        $imagenEquipo->usercreated = $request->user;
                        $imagenEquipo->equipo_id = $id;
                        $imagenEquipo->activo = 1;
                        $path = $file->storeAs(
                            '/Equipos/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );                
                        $imagenEquipo->imagen = $path;
                        $imagenEquipo->save();
                    }                    
                }
                $request->request->add(['usermodifed' => $request->user]);
                $congresoVisibleEquipo->fill($request->all());
                $congresoVisibleEquipo->save();

                $datosContacto = $request->input('datosContacto');
                if($datosContacto != null)
                {
                    foreach($request->input('datosContacto') as $key => $value)
                    {
                        $datosContacto[$key]['equipo_id'] = $id;
                        $requestDatos = new Request($datosContacto[$key]);
                        if($requestDatos->id > 0)
                        {
                            if($requestDatos->activo == 1)
                            {
                                $equipoDatosContacto = CongresoVisibleEquipoDatosContacto::find($requestDatos->id);
                                $equipoDatosContacto->fill($requestDatos->all());
                                $equipoDatosContacto->usermodifed = $request->user;
                                $equipoDatosContacto->save();
                            }
                            else
                            {
                                $equipoDatosContacto = CongresoVisibleEquipoDatosContacto::find($requestDatos->id);
                                $equipoDatosContacto->activo = 0;
                                $equipoDatosContacto->usermodifed = $request->user;
                                $equipoDatosContacto->save();
                            } 
                        }else
                        {
                            if($requestDatos->activo == 1)
                            {
                                $equipoDatosContacto = new CongresoVisibleEquipoDatosContacto;
                                $equipoDatosContacto->fill($requestDatos->all());
                                $equipoDatosContacto->usercreated = $request->user;
                                $equipoDatosContacto->save();
                            }
                        }
                    }
                }
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
    public function destroyEquipo($id)
    {
        $equipo = CongresoVisibleEquipo::find($id);
        $equipo->activo=!$equipo->activo;
        $equipo->save();
        return response($equipo, 200);
    }
    /**
     * Congreso visible Equipo
     */

    public function indexAliados(Request $request)
    {
        $Aliado = CongresoVisibleAliado::select('id','nombre','urlexterna','congreso_visible_id','activo')       
        ->where('activo', $request->input('idFilter'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($Aliado,200);
    }
    public function showAliado($id)
    {
        $Aliado = CongresoVisibleAliado::select('id','nombre','urlexterna','congreso_visible_id','activo')
        ->with('aliadoImagen')    
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($Aliado,200);
    }
    public function storeAliado(Request $request)
    {
        $validator = Validator::make($request->all(), CongresoVisibleAliado::$rulesPost, CongresoVisibleAliado::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try 
        {    
            $aliado = new CongresoVisibleAliado();
            $request->request->add(['usercreated' => $request->user]);
            $result = $aliado->create($request->all());
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
                        $imagenAliado = new CongresoVisibleAliadoImagen();
                        $imagenAliado->usercreated = $request->user;
                        $imagenAliado->aliado_id = $id;
                        $imagenAliado->activo = 1;
                        $path = $file->storeAs(
                            '/Aliados/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );                
                        $imagenAliado->imagen = $path;
                        $imagenAliado->save();
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
    public function updateAliado(Request $request, $id)
    {
        $validator = Validator::make($request->all(), CongresoVisibleAliado::$rulesPut, CongresoVisibleAliado::$rulesPutMessages);
        
        if ($validator->passes())
        {
            DB::beginTransaction();
            try
            {
                $congresoVisibleAliado = CongresoVisibleAliado::find($id);     
                if($request->hasFile('imagen'))
                {               
                    $imagenesAnteriores = CongresoVisibleAliadoImagen::select('id')
                    ->where('aliado_id',$congresoVisibleAliado->id)
                    ->where('activo',1)
                    ->get();
                    $files = $request->file('imagen');                                    

                    if($imagenesAnteriores != null)
                    {
                        foreach($imagenesAnteriores as $key => $imagenAnterior)
                        {
                            $imgAnterior = CongresoVisibleAliadoImagen::find($imagenesAnteriores[$key]->id);
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
                        $imagenAliado = new CongresoVisibleAliadoImagen;
                        $imagenAliado->usercreated = $request->user;
                        $imagenAliado->aliado_id = $id;
                        $imagenAliado->activo = 1;
                        $path = $file->storeAs(
                            '/Equipos/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );                
                        $imagenAliado->imagen = $path;
                        $imagenAliado->save();
                    }                    
                }
                $request->request->add(['usermodifed' => $request->user]);
                $congresoVisibleAliado->fill($request->all());
                $congresoVisibleAliado->save();

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
    public function destroyAliado($id)
    {
        $Aliado = CongresoVisibleAliado::find($id);
        $Aliado->activo=!$Aliado->activo;
        $Aliado->save();
        return response($Aliado, 200);
    }

    /**
     * Congreso visible Equipo
     */
    public function indexIntegrante(Request $request)
    {
        $Integrante = CongresoVisibleEquipoIntegrante::select('id','nombre','descripcion','equipo_id','cargo_id','activo')       
        ->where('activo', $request->input('idFilter'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($Integrante,200);
    }
    public function showIntegrante($id)
    {
        $Integrante = CongresoVisibleEquipoIntegrante::select('id','nombre','descripcion','equipo_id','cargo_id','activo')
        ->with('integrantesContacto')    
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($Integrante,200);
    }
    public function storeIntegrante (Request $request)
    {        
        $validator = Validator::make($request->all(), CongresoVisibleEquipoIntegrante::$rulesPost, CongresoVisibleEquipoIntegrante::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);     
        DB::beginTransaction();
        try 
        {    
            $integrante = new CongresoVisibleEquipoIntegrante();
            $request->request->add(['usercreated' => $request->user]);
            $result = $integrante->create($request->all());
            $id = $result->id;
            if($result != null)
            {                                   
                $datosContacto = $request->input('datosContacto');           
                if($datosContacto != null)
                {
                    foreach($request->input('datosContacto') as $key => $value)
                    {
                        $datosContacto[$key]['integrante_id'] = $id;
                        $requestintegranteDatosContacto = new Request($datosContacto[$key]);
                        if($requestintegranteDatosContacto->activo == 1)
                        {
                            $integranteDatosContacto = new CongresoVisibleIntegranteDatoContacto();
                            $integranteDatosContacto->fill($requestintegranteDatosContacto->all());                                         
                            $integranteDatosContacto->usercreated = $request->user;
                            $integranteDatosContacto->save();
                        }
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
    public function updateIntegrante(Request $request, $id)
    {
        $validator = Validator::make($request->all(), CongresoVisibleEquipoIntegrante::$rulesPut, CongresoVisibleEquipoIntegrante::$rulesPutMessages);
        
        if ($validator->passes())
        {
            DB::beginTransaction();
            // try
            // {
                $congresoVisibleIntegrante = CongresoVisibleEquipoIntegrante::find($id);            
                $request->request->add(['usermodifed' => $request->user]);
                $congresoVisibleIntegrante->fill($request->all());
                $congresoVisibleIntegrante->save();

                $datosContacto = $request->input('datosContacto');
                if($datosContacto != null)
                {
                    foreach($request->input('datosContacto') as $key => $value)
                    {
                        $datosContacto[$key]['integrante_id'] = $id;
                        $requestDatos = new Request($datosContacto[$key]);
                        if($requestDatos->id > 0)
                        {
                            if($requestDatos->activo == 1)
                            {
                                $congresoDatosContacto = CongresoVisibleIntegranteDatoContacto::find($requestDatos->id);
                                $congresoDatosContacto->fill($requestDatos->all());
                                $congresoDatosContacto->usermodifed = $request->user;
                                $congresoDatosContacto->save();
                            }
                            else
                            {
                                $congresoDatosContacto = CongresoVisibleIntegranteDatoContacto::find($requestDatos->id);
                                $congresoDatosContacto->activo = 0;
                                $congresoDatosContacto->usermodifed = $request->user;
                                $congresoDatosContacto->save();
                            } 
                        }else
                        {
                            if($requestDatos->activo == 1)
                            {
                                $congresoDatosContacto = new CongresoVisibleIntegranteDatoContacto;
                                $congresoDatosContacto->fill($requestDatos->all());
                                $congresoDatosContacto->usercreated = $request->user;
                                $congresoDatosContacto->save();
                            }
                        }
                    }
                }

                DB::commit();
                return response()->json(['message' => 'OK'], 202);
            // }
            // catch(\Exception $e)
            // {
            //     DB::rollback();
            //     return response()->json(['message' => 'Error'], 422);
            // }
        }
        else 
            return response()->json($validator->errors(), 422);
    }
    public function destroyIntegrante($id)
    {
        $Integrante = CongresoVisibleEquipoIntegrante::find($id);
        $Integrante->activo=!$Integrante->activo;
        $Integrante->save();
        return response($Integrante, 200);
    }
}
