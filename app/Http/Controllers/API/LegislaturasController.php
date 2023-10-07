<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Legislatura;
use Validator;
use App\Messages;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use DB;

class LegislaturasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $items = Legislatura::select('id','nombre','activo')
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
        $validator = Validator::make($request->all(), Legislatura::$rules,  Legislatura::$messages);        
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try
        {
            $item = new Legislatura();
            $request->request->add(['usercreated' => $request->user]);
            $item->create($request->all());
            DB::commit();
            return response()->json(['message' => 'OK'], 201);
        }
        catch (\Exception $e) 
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
        $item = Legislatura::select('id','nombre','fechaInicio','fechaFin','cuatrienio_id','activo')
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
        $validator = Validator::make($request->all(), Legislatura::$rules,  Legislatura::$messages);        
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try
        {
            $itemOriginal = Legislatura::find($id);
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
        $item = Legislatura::find($id);
        $item->activo = !$item->activo;
        $item->save();
        return response($item, 200);
    }
     

}
