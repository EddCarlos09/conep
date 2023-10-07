<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AgendaLegislativa;
use App\Models\AgendaLegislativaActividad;
use App\Models\AgendaLegislativaComision;
use Validator;
use Illuminate\Support\Facades\Storage;
use DB;

class AgendaLegislativasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
               
            $items = AgendaLegislativa::select('id', 'fecha','realizado', 'activo')        
        ->with('cuatrienio')        
        ->where('activo', $request->input('idFilter'))                
        ->where('fecha',  'LIKE','%' . $request->input('search') . '%' )
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
        $validator = Validator::make($request->all(), AgendaLegislativa::$rules,  AgendaLegislativa::$messages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $agenda = new AgendaLegislativa;
            $request->request->add(['usercreated' => $request->user]);
            $result = $agenda->create($request->all());
            $id = $result->id;
            $comisiones=$request->input('comisiones');
            if($comisiones != null)
                {
                    foreach($request->input('comisiones') as $key => $value)
                    {
                        $comisiones[$key]['agenda_legislativa_id'] = $id;
                        $requestcomisiones = new Request($comisiones[$key]);

                        if($requestcomisiones->activo == 1)
                        {
                            $AgendaComision = new AgendaLegislativaComision;
                            $AgendaComision->fill($requestcomisiones->all());
                            $AgendaComision->usercreated = $request->user;
                            $AgendaComision->save();
                        }
                    }
                }
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
        $agenda = AgendaLegislativa::select(
            'id',        
            'fecha',
            'fecha_realizada',
            'comentarios',
            'cuatrienio_id',
            'realizado',
            'activo')
            ->with('agendaComision')            
            ->where('id', $id)
            ->get()
            ->toJson(JSON_PRETTY_PRINT);
            return response($agenda, 200);
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
        $validator = Validator::make($request->all(), AgendaLegislativa::$rules,  AgendaLegislativa::$messages);        
        if ($validator->fails())
            return response()->json($validator->errors(),422);
        try{
        DB::beginTransaction();
        
            $itemOriginal = AgendaLegislativa::find($id);
            $request->request->add(['usermodifed' => $request->user]);
            $itemOriginal->fill($request->all());
            $itemOriginal->save();
            // // Checamos las comisiones
            if ($request->has('comisiones'))
            {
                // Solamente los que se devuelvan activos desde la vista
                $items = array_filter(
                    $request->comisiones,
                    function ($item)
                    {
                        if ($item["activo"])
                        {
                            return $item;
                        }
                    }
                );
                // Ponemos todos las trayectorias publicas a activo 0
                AgendaLegislativaComision::where(
                    [
                        [
                            'agenda_legislativa_id',
                            $itemOriginal->id
                        ]
                    ]
                )->update(['activo' => 0]);
                // Recorremos el listado de items que se trae de la vista
                foreach ($items as $item)
                {
                    $item_comision = AgendaLegislativaComision::where(
                        [
                            [
                                'id',
                                $item["id"]
                            ],
                            [
                                'agenda_legislativa_id',
                                $itemOriginal->id
                            ]
                        ]
                    )->first();
                    // Checamos si existe en la bd el item
                    if ($item_comision != null)
                    {
                        // Si existe actualizamos el activo y su fecha de modificación
                        $item_comision->fill($item);
                        $item_comision->usermodifed = $request->user;
                    }
                    else
                    {
                        // Como no existe creamos un nuevo item
                        // Y lo agregamos a la bd
                        $item_comision = new AgendaLegislativaComision();
                        $item_comision->fill($item);
                        $item_comision->usercreated = $request->user;
                    }
                    $item_comision->agenda_legislativa_id = $itemOriginal->id;
                    $item_comision->activo = 1;
                    $item_comision->save();
                }
                //Borramos los que esten activo 0
                AgendaLegislativaComision::where(
                    [
                        [
                            'agenda_legislativa_id',
                            $itemOriginal->id
                        ],
                        [
                            'activo',
                            0
                        ]
                    ]
                )->delete();
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $AgendaLegislativa = AgendaLegislativa::find($id);
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
            $count = AgendaLegislativa::where('activo', $request->input('idFilter'))                                                                               
        ->where('fecha',  'LIKE','%' . $request->input('search') . '%' )
        ->count();       
            return response($count, 200);                       
    }
}
