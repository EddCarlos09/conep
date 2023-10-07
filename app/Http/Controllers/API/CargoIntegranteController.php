<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CargoIntegrante;
use Validator;
use Illuminate\Http\Request;
use DB;

class CargoIntegranteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $cargo = CargoIntegrante::select('id','nombre','activo')
        ->where('activo',$request->input('idFilter'))
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($cargo,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {      
        $validator = Validator::make($request->all(),CargoIntegrante::$rulesPost,CargoIntegrante::$rulesPostMessages);
        if ($validator->fails()){
            return response()->json($validator->errors(),422);            
        }
        
        DB::beginTransaction();
        try
        {
            $item = new CargoIntegrante();
            $request->request->add(['usercreated' => $request->user]);
            $item->create($request->all());
            DB::commit();

            return response()->json(['message' => 'OK'],202);
        } catch (\Exception $e)
        {
            DB::rollback();
            return response()->json(['message' => 'Error'],204);
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
        $cargo = CargoIntegrante::select('id','nombre','activo')
        ->where('id',$id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($cargo,200);
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
        $validator = Validator::make($request->all(),CargoIntegrante::$rulesPut,CargoIntegrante::$rulesPutMessages);
        if ($validator->fails())
        {
            return response()->json($validator->errors(),422);
        }
        DB::beginTransaction();
        try
        {
            $item = CargoIntegrante::find($id);
            $request->request->add(['usermodifed' => $request->user]);
            $item->fill($request->all());
            $item->save();
            DB::commit();

            return response()->json(['message' => 'OK'],202);
        } catch (\Exception $e)
        {
            DB::rollback();
            return response()->json(['message' => 'Error'],204);
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
        $item = CargoIntegrante::find($id);
        $item->activo = !$item->activo;
        $item->save();

        return response($item, 200);
    }
}
