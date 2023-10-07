<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Secretario;
use App\Models\SecretarioImagen;
use App\Models\SecretarioDatosContacto;
use Validator;
use App\Messages;
use Carbon\Carbon;
use DB;
use Illuminate\Support\Facades\Storage;
use EloquentBuilder;

class SecretariosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $items = Secretario::select('id','nombre', 'lugarNacimiento', 'activo')
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('nombre', 'LIKE', '%' . $request->input('search') . '%')
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($items, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), Secretario::$rulesPost,  Secretario::$messagesPost);
        if ($validator->fails()) 
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try{
            $item = new Secretario();
            $request->request->add(['usercreated' => $request->user]);
            $result = $item->create($request->all()); // Secretario creado
            if($result != null){
                $id = $result->id;

                // Imágenes
                $files = $request->file('imagen');
                if($request->hasFile('imagen'))
                {
                    $nombre = $id;
                    foreach ($files as $file) {
                        // Se crea registro
                        $imagenSecretario = new SecretarioImagen;
                        $imagenSecretario->usercreated = $request->user;
                        $imagenSecretario->secretario_id = $id;
                        $imagenSecretario->activo = 1;
                        $path = $file->storeAs(
                            '/secretario/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );
                        $imagenSecretario->imagen = $path;
                        $imagenSecretario->save();
                    }
                }

                // Datos de contacto
                $datosContacto = $request->input('datosContacto');
                if($datosContacto != null)
                {
                    foreach($request->input('datosContacto') as $key => $value)
                    {
                        $datosContacto[$key]['secretario_id'] = $id;
                        $requestSecretarioDatosContacto = new Request($datosContacto[$key]);
                        if($requestSecretarioDatosContacto->activo == 1)
                        {
                            $SecretarioDatosContacto = new SecretarioDatosContacto;
                            $SecretarioDatosContacto->fill($requestSecretarioDatosContacto->all());
                            $SecretarioDatosContacto->usercreated = $request->user;
                            $SecretarioDatosContacto->save();
                        }
                    }
                }
            }
            DB::commit();
            return response()->json(['message' => 'OK'], 201);
        }catch (\Exception $e)
        {
            DB::rollback();
            return response()->json(['message' => 'Error'], 204);
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
        $Secretario = Secretario::where('id', $id)
        ->with("secretarioDatosContacto", "secretarioImagen")
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($Secretario, 200);
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
        $validator = Validator::make($request->all(), Secretario::$rulesPut,  Secretario::$messagesPut);
        if ($validator->fails()) 
            return response()->json($validator->errors(), 422);
        

        DB::beginTransaction();
        try {
            $secretario = Secretario::find($id);

            if($request->hasFile('imagen'))
            {
                $imagenesAnteriores = SecretarioImagen::select('id')
                ->where('secretario_id', $secretario->id)
                ->where('activo', 1)
                ->get();
                $files = $request->file('imagen');

                if($imagenesAnteriores != null)
                {
                    foreach ($imagenesAnteriores as $key => $imagenAnterior)
                    {
                        $imgAnterior = SecretarioImagen::find($imagenesAnteriores[$key]->id);
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
                    $imagenSecretario = new SecretarioImagen;
                    $imagenSecretario->usercreated = $request->user;
                    $imagenSecretario->secretario_id = $id;
                    $imagenSecretario->activo = 1;
                    $path = $file->storeAs(
                        '/secretario/'.$nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $imagenSecretario->imagen = $path;
                    $imagenSecretario->save();
                }
            }

            $request->request->add(['usermodifed' => $request->user]);
            $secretario->fill($request->all());
            $secretario->save();

            $datosContacto = $request->input('datosContacto');
            if($datosContacto != null)
            {
                foreach($request->input('datosContacto') as $key => $value)
                {
                    $datosContacto[$key]['congresista_id'] = $id;
                    $requestSecretarioDatosContacto = new Request($datosContacto[$key]);
                    if($requestSecretarioDatosContacto->id > 0)
                    {
                        if($requestSecretarioDatosContacto->activo == 1)
                        {
                            $secretarioDatosContacto = SecretarioDatosContacto::find($requestSecretarioDatosContacto->id);
                            $secretarioDatosContacto->fill($requestSecretarioDatosContacto->all());
                            $secretarioDatosContacto->usermodifed = $request->user;
                            $secretarioDatosContacto->save();
                        }
                        else
                        {
                            $secretarioDatosContacto = SecretarioDatosContacto::find($requestSecretarioDatosContacto->id);
                            $secretarioDatosContacto->activo = 0;
                            $secretarioDatosContacto->usermodifed = $request->user;
                            $secretarioDatosContacto->save();
                        }
                    }
                    else
                    {
                        if($requestSecretarioDatosContacto->activo == 1)
                        {
                            $secretarioDatosContacto = new SecretarioDatosContacto;
                            $secretarioDatosContacto->fill($requestSecretarioDatosContacto->all());
                            $secretarioDatosContacto->usercreated = $request->user;
                            $secretarioDatosContacto->save();
                        }
                    }
                }
            }

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
        $Secretario = Secretario::find($id);
        $Secretario->activo=!$Secretario->activo;
        $Secretario->save();

        return response($Secretario, 200);
    }

    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $count = Secretario::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
            ->where('nombre', 'LIKE', '%' . $request->input('search') . '%')
            ->count();

        return response($count, 200);
    }
}
