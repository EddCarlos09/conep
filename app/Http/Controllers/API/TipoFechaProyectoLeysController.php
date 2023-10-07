<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TipoFechaProyectoLey;
use Validator;
use App\Messages;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use DB;


class TipoFechaProyectoLeysController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $items = TipoFechaProyectoLey::select('id','nombre','activo')
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
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
        $validator = Validator::make($request->all(), TipoFechaProyectoLey::$rules,  TipoFechaProyectoLey::$messages);        

        if ($validator->passes()) {
            DB::beginTransaction();
            try{
                $item = new TipoFechaProyectoLey();
                $request->request->add(['usercreated' => $request->user]);
                $item->create($request->all());
                DB::commit();
                return response()->json(['message' => 'OK'], 201);
            }catch (\Exception $e) 
            {
                DB::rollback();
                return response()->json(['message' => 'Error'], 204);
            }
        }
        else 
            return response()->json($validator->errors(), 422);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $item = TipoFechaProyectoLey::select(
            'id',
            'nombre',
            'tipocorporacion',
            'activo'
        )
            ->where('id', $id)
            ->get()
            ->first();

        return response($item, 200);
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
        $validator = Validator::make($request->all(), TipoFechaProyectoLey::$rules,  TipoFechaProyectoLey::$messages);        

        if ($validator->passes()) {
            DB::beginTransaction();
            try
            {
                $itemOriginal = TipoFechaProyectoLey::find($id);
                $request->request->add(['usermodifed' => $request->user]);
                $itemOriginal->fill($request->all());
                $itemOriginal->save();
                DB::commit();
                return response()->json(['message' => 'OK'], 201);

            }catch (\Exception $e) 
            {
                DB::rollback();
                return response()->json(['message' => 'Error'], 204);
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
        $item = TipoFechaProyectoLey::find($id);
        $item->activo = !$item->activo;
        $item->save();
        return response($item, 200);
    }
}
