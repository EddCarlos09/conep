<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tema;
use Validator;
use App\Messages;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use DB;

class TemasController extends Controller
{
   /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $items = Tema::select('id', 'nombre', 'activo')
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
        $validator = Validator::make($request->all(), Tema::$rules, Tema::$messages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try
        {
            $item = new Tema();
            $request->request->add(['usercreated' => $request->user]);
            $item->create($request->all());
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
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $item = Tema::select('id', 'nombre', 'activo')
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
        $validator = Validator::make($request->all(), Tema::$rules, Tema::$messages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try
        {
            $itemOriginal = Tema::find($id);
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
        $item = Tema::find($id);
        $item->activo = !$item->activo;
        $item->save();
        return response($item, 200);
    }
}
