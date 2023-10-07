<?php

namespace App\Http\Controllers\API;
use App\Models\AgendaLegislativaComision;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;
use Illuminate\Support\Facades\Storage;
use DB;
class AgendaLegislativaComisionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $items = AgendaLegislativaComision::select('id', 'agenda_legislativa_id','comision_id','activo')
        ->with('comision')
        ->where('agenda_legislativa_id', $request->input('idAgenda'))
        ->where('activo', $request->input('idFilter'))                
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
        $validator = Validator::make($request->all(), AgendaLegislativaComision::$rules,  AgendaLegislativaComision::$messages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $agendaComision = new AgendaLegislativaComision;
            $request->request->add(['usercreated' => $request->user]);
            $result = $agendaComision->create($request->all());           
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
        $agendacomision = AgendaLegislativaComision::select(
            'id',        
            'comision_id',
            'activo') 
            ->with('comision')           
            ->where('id', $id)
            ->get()
            ->toJson(JSON_PRETTY_PRINT);
            return response($agendacomision, 200);
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
        $validator = Validator::make($request->all(), AgendaLegislativaComision::$rules,  AgendaLegislativaComision::$messages);        
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try
        {
            $itemOriginal = AgendaLegislativaComision::find($id);
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
        $agendaComision = AgendaLegislativaComision::find($id);
        $agendaComision->activo=!$agendaComision->activo;
        $agendaComision->save();
        return response($agendaComision, 200);
    }
      /**
     * Display a listing records of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function totalrecords(Request $request)
    {
        $count = AgendaLegislativaComision::where('activo', $request->input('idFilter'))
        ->where('agenda_legislativa_id', $request->input('idAgenda'))
        //->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->count();
        return response($count, 200);        
    }
}
