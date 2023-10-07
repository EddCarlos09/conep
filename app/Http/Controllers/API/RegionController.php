<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Region;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RegionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $search = $request->input('search');

        $items = Region::select(
            [
                'id',
                'nombre',
                'activo'
            ])
            ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
            ->where('nombre', 'LIKE', '%' . $search . '%')
            ->skip(($request->input('page') - 1) * $request->input('rows'))
            ->take($request->input('rows'))
            ->orderBy('nombre')
            ->get()
            ->toJson(JSON_PRETTY_PRINT);

        return response($items);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),Region::$rulesPost,Region::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $item = new Region();
            $request->request->add(['usercreated' => $request->user]);
            $item->create($request->all());
            DB::commit();
            return response()->json(['message' => 'OK'],202);
        }
        catch (Exception $e)
        {
            DB::rollback();
            return response()->json(['message' => 'Error'],422);
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
        $item = Region::select('id','nombre','activo')
                               ->where('id',$id)
                               ->get()
                               ->first();
        return response($item);
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
        $validator = Validator::make($request->all(),Region::$rulesPut,Region::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try
        {
            $itemOriginal = Region::find($id);
            $request->request->add(['usermodifed' => $request->user]);
            $itemOriginal->fill($request->all());
            $itemOriginal->save();
            DB::commit();
            return response()->json(['message' => 'OK'],202 );
        }
        catch (Exception $e)
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
        $item = Region::find($id);
        $item->activo = !$item->activo;
        $item->save();
        return response($item);
    }

    /**
     * Display a totalrecords of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $search = $request->input('search');

        $count = Region::select(
            [
                'id',
                'nombre',
                'activo'
            ])
            ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
            ->where('nombre', 'LIKE', '%' . $search . '%')
            ->get()
            ->count();

        return response($count);
    }
}
