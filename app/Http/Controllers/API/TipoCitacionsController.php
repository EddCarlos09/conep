<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TipoCitacion;
use Validator;
use App\Messages;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use DB;

class TipoCitacionsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $tipoCitacion = TipoCitacion::select('id','nombre','activo')
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->orderBy('id','desc')
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($tipoCitacion, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), TipoCitacion::$rules, TipoCitacion::$messages);

        if($validator->passes())
        {
            DB::beginTransaction();
            try{
                $tipoCitacion = new TipoCitacion;
                $request->request->add(['usercreated' => $request->user]);
                $result = $tipoCitacion->create($request->all());
                DB::commit();
                return response()->json(['message' => 'OK'], 201);
            }catch (\Exception $e) 
            {
                DB::rollback();
                return response()->json(['message' => 'Error'], 222);
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
        $tipoCitacion = TipoCitacion::select('id','nombre','activo')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($tipoCitacion, 200);
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
        $validator = Validator::make($request->all(), TipoCitacion::$rules, TipoCitacion::$messages);
        
        if ($validator->passes())
        {
            DB::beginTransaction();
            try
            {
                $tipoCitacion = TipoCitacion::find($id);
                $request->request->add(['usermodifed' => $request->user]);
                $tipoCitacion->fill($request->all());
                $tipoCitacion->save();
                DB::commit();
                return response()->json(['message' => 'OK'], 201);
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $tipoCitacion = TipoCitacion::find($id);
        $tipoCitacion->activo = !$tipoCitacion->activo;
        $tipoCitacion->save();
        return response($tipoCitacion, 200);
    }
}
