<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BalanceCuatrienio;
use App\Models\BalanceCuatrienioImagen;
use Validator;
use App\Messages;
use Carbon\Carbon;
use DB;
use Illuminate\Support\Facades\Storage;
use EloquentBuilder;

class BalanceCuatrienioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $yearInicio = $request->input('yearInicio');
        $items = BalanceCuatrienio::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('yearInicio', ($yearInicio != "-1") ? '=' : '!=', $yearInicio)
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
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
        $validator = Validator::make($request->all(), BalanceCuatrienio::$rulesPost,  BalanceCuatrienio::$messagesPost);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        DB::beginTransaction();
        try{
            $item = new BalanceCuatrienio();
            $request->request->add(['usercreated' => $request->user]);
            $result = $item->create($request->all()); // BalanceCuatrienio creado
            if($result != null){
                $id = $result->id;

                // Imágenes
                $files = $request->file('imagen');
                if($request->hasFile('imagen'))
                {
                    foreach ($files as $file) {
                        // Se crea registro
                        $imagenBalanceCuatrienio = new BalanceCuatrienioImagen;
                        $imagenBalanceCuatrienio->usercreated = $request->user;
                        $imagenBalanceCuatrienio->balance_cuatrienio_id = $id;
                        $imagenBalanceCuatrienio->activo = 1;
                        $path = $file->storeAs(
                            '/balanceCuatrienio/'.$id, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );
                        $imagenBalanceCuatrienio->imagen = $path;
                        $imagenBalanceCuatrienio->save();
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
        $BalanceCuatrienio = BalanceCuatrienio::where('id', $id)
        ->with("imagen")
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($BalanceCuatrienio, 200);
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
       
        $validator = Validator::make($request->all(), BalanceCuatrienio::$rulesPut,  BalanceCuatrienio::$messagesPut);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            $balanceCuatrienio = BalanceCuatrienio::find($id);

            if($request->hasFile('imagen'))
            {
                $imagenesAnteriores = BalanceCuatrienioImagen::select('id')
                ->where('balance_cuatrienio_id', $balanceCuatrienio->id)
                ->where('activo', 1)
                ->get();
                $files = $request->file('imagen');

                if($imagenesAnteriores != null)
                {
                    foreach ($imagenesAnteriores as $key => $imagenAnterior)
                    {
                        $imgAnterior = BalanceCuatrienioImagen::find($imagenesAnteriores[$key]->id);
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
                    $imagenBalanceCuatrienio = new BalanceCuatrienioImagen;
                    $imagenBalanceCuatrienio->usercreated = $request->user;
                    $imagenBalanceCuatrienio->balance_cuatrienio_id = $id;
                    $imagenBalanceCuatrienio->activo = 1;
                    $path = $file->storeAs(
                        '/balanceCuatrienio/'.$nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $imagenBalanceCuatrienio->imagen = $path;
                    $imagenBalanceCuatrienio->save();
                }
            }

            $request->request->add(['usermodifed' => $request->user]);
            $balanceCuatrienio->fill($request->all());
            $balanceCuatrienio->save();

          
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
        $BalanceCuatrienio = BalanceCuatrienio::find($id);
        $BalanceCuatrienio->activo=!$BalanceCuatrienio->activo;
        $BalanceCuatrienio->save();

        return response($BalanceCuatrienio, 200);
    }

    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $yearInicio = $request->input('yearInicio');
        $count = BalanceCuatrienio::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
            ->where('yearInicio', ($yearInicio != "-1") ? '=' : '!=', $yearInicio)
            ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
            ->count();

        return response($count, 200);
    }

}
