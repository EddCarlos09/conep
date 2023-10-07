<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BalanceCuatrienioInforme;
use App\Models\BalanceCuatrienioInformeImagen;
use App\Models\BalanceCuatrienioInformeConcepto;
use Validator;
use App\Messages;
use Carbon\Carbon;
use DB;
use Illuminate\Support\Facades\Storage;
use EloquentBuilder;

class BalanceCuatrienioInformeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $balance = $request->input('balance');
        $equipo = $request->input('equipo');
        $items = BalanceCuatrienioInforme::with("equipo")
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('equipo_id', ($equipo != "-1") ? '=' : '!=', $equipo)
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->where('balance_cuatrienio_id', $balance)
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
        $validator = Validator::make($request->all(), BalanceCuatrienioInforme::$rulesPost,  BalanceCuatrienioInforme::$messagesPost);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        DB::beginTransaction();
        try{
            $item = new BalanceCuatrienioInforme();
            $request->request->add(['usercreated' => $request->user]);
            $result = $item->create($request->all()); // BalanceCuatrienioInforme creado
            if($result != null){
                $id = $result->id;

                // Imágenes
                $files = $request->file('imagen');
                if($request->hasFile('imagen'))
                {
                    foreach ($files as $file) {
                        // Se crea registro
                        $imagenBalanceCuatrienioInforme = new BalanceCuatrienioInformeImagen;
                        $imagenBalanceCuatrienioInforme->usercreated = $request->user;
                        $imagenBalanceCuatrienioInforme->balance_informe_id = $id;
                        $imagenBalanceCuatrienioInforme->activo = 1;
                        $path = $file->storeAs(
                            '/balanceCuatrienioInforme/'.$id, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );
                        $imagenBalanceCuatrienioInforme->imagen = $path;
                        $imagenBalanceCuatrienioInforme->save();
                    }
                }

                // Conceptos

                $conceptos = $request->input('conceptos');
                if($conceptos != null)
                {
                    foreach($request->input('conceptos') as $key => $value)
                    {
                        $conceptos[$key]['balance_informe_id'] = $id;
                        $requestBalanceInformeConcepto = new Request($conceptos[$key]);
                        
                        if($requestBalanceInformeConcepto->activo == 1)
                        {
                            $BalanceInformeConcepto = new BalanceCuatrienioInformeConcepto;
                            $BalanceInformeConcepto->fill($requestBalanceInformeConcepto->all());
                            $BalanceInformeConcepto->usercreated = $request->user;
                            $BalanceInformeConcepto->save();
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
        $BalanceCuatrienioInforme = BalanceCuatrienioInforme::where('id', $id)
        ->with("imagen", "conceptos", "tipoPublicacion", "equipo")
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($BalanceCuatrienioInforme, 200);
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
        $validator = Validator::make($request->all(), BalanceCuatrienioInforme::$rulesPut,  BalanceCuatrienioInforme::$messagesPut);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            $balanceCuatrienioInforme = BalanceCuatrienioInforme::find($id);

            if($request->hasFile('imagen'))
            {
                $imagenesAnteriores = BalanceCuatrienioInformeImagen::select('id')
                ->where('balance_informe_id', $balanceCuatrienioInforme->id)
                ->where('activo', 1)
                ->get();
                $files = $request->file('imagen');

                if($imagenesAnteriores != null)
                {
                    foreach ($imagenesAnteriores as $key => $imagenAnterior)
                    {
                        $imgAnterior = BalanceCuatrienioInformeImagen::find($imagenesAnteriores[$key]->id);
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
                    $imagenBalanceCuatrienioInforme = new BalanceCuatrienioInformeImagen;
                    $imagenBalanceCuatrienioInforme->usercreated = $request->user;
                    $imagenBalanceCuatrienioInforme->balance_informe_id = $id;
                    $imagenBalanceCuatrienioInforme->activo = 1;
                    $path = $file->storeAs(
                        '/balanceCuatrienioInforme/'.$nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $imagenBalanceCuatrienioInforme->imagen = $path;
                    $imagenBalanceCuatrienioInforme->save();
                }

               
            }

            $request->request->add(['usermodifed' => $request->user]);
            $balanceCuatrienioInforme->fill($request->all());
            $balanceCuatrienioInforme->save();

            $conceptos = $request->input('conceptos');
            if($conceptos != null)
            {
                foreach($request->input('conceptos') as $key => $value)
                {
                    $conceptos[$key]['balance_informe_id'] = $id;
                    $requestConceptos = new Request($conceptos[$key]);
                    if($requestConceptos->id > 0)
                    {
                        if($requestConceptos->activo == 1)
                        {
                            $balanceConcepto = BalanceCuatrienioInformeConcepto::find($requestConceptos->id);
                            $balanceConcepto->fill($requestConceptos->all());
                            $balanceConcepto->usermodifed = $request->user;
                            $balanceConcepto->save();
                        }
                        else
                        {
                            $balanceConcepto = BalanceCuatrienioInformeConcepto::find($requestConceptos->id);
                            $balanceConcepto->activo = 0;
                            $balanceConcepto->usermodifed = $request->user;
                            $balanceConcepto->save();
                        }
                    }
                    else
                    {
                        if($requestConceptos->activo == 1)
                        {
                            $balanceConcepto = new BalanceCuatrienioInformeConcepto;
                            $balanceConcepto->fill($requestConceptos->all());
                            $balanceConcepto->usercreated = $request->user;
                            $balanceConcepto->save();
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
        $BalanceCuatrienioInforme = BalanceCuatrienioInforme::find($id);
        $BalanceCuatrienioInforme->activo=!$BalanceCuatrienioInforme->activo;
        $BalanceCuatrienioInforme->save();

        return response($BalanceCuatrienioInforme, 200);
    }

    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $balance = $request->input('balance');
        $equipo = $request->input('equipo');
        $count = BalanceCuatrienioInforme::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
            ->where('equipo_id', ($equipo != "-1") ? '=' : '!=', $equipo)
            ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
            ->where('balance_cuatrienio_id', $balance)
            ->count();

        return response($count, 200);
    }
}
