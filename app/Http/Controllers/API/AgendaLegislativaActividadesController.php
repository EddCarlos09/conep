<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AgendaLegislativaActividad;
use Validator;
use Illuminate\Support\Facades\Storage;
use DB;

class AgendaLegislativaActividadesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $items = AgendaLegislativaActividad::select('id', 'titulo', 'activo')
        ->where('activo', $request->input('idFilter'))
        ->where('agenda_legislativa_id', $request->input('idAgenda'))
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
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
        $validator = Validator::make($request->all(), AgendaLegislativaActividad::$rules,  AgendaLegislativaActividad::$messages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $agendaActividad = new AgendaLegislativaActividad;
            $request->request->add(['usercreated' => $request->user]);
            $result = $agendaActividad->create($request->all());           
            DB::commit();
            return response()->json(['message' => 'OK'], 201);
        }
        catch (\Throwable $e) 
        {            
            DB::rollback();
            return response()->json(['message' => $e], 422);
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
        $agendaactividad = AgendaLegislativaActividad::select(
            'id',        
            'agenda_legislativa_id',           
            'titulo',            
            'descripcion',
            'destacado',
            'tipo_actividad_id',            
            'proyecto_ley_id',
            'activo') 
            ->with('selected')           
            ->where('id', $id)
            ->get()
            ->toJson(JSON_PRETTY_PRINT);
            return response($agendaactividad, 200);
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
        $validator = Validator::make($request->all(), AgendaLegislativaActividad::$rules,  AgendaLegislativaActividad::$messages);        
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try
        {
            $itemOriginal = AgendaLegislativaActividad::find($id);
            $request->request->add(['usermodifed' => $request->user]);
            $itemOriginal->fill($request->all());
            $itemOriginal->save();
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
        $AgendaLegislativa = AgendaLegislativaActividad::find($id);
        $AgendaLegislativa->activo=!$AgendaLegislativa->activo;
        $AgendaLegislativa->save();
        return response($AgendaLegislativa, 200);
    }
      /**
     * Display a listing records of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function totalrecords(Request $request)
    {
        $count = AgendaLegislativaActividad::where('activo', $request->input('idFilter'))
        ->where('agenda_legislativa_id', $request->input('idAgenda'))
        //->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->count();
        return response($count, 200);        
    }
}
