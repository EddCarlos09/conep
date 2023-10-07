<?php

namespace App\Http\Controllers\CLIENTAPI;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ObservacionesIniciativa;
use Validator;
use DB;
class ObservacionesIniciativaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $proyecto_id = $request->input('proyecto_id');
        $email = $request->input('email');

        $observaciones = ObservacionesIniciativa::where('proyecto_ley_id', $proyecto_id)
        ->where('email', $email)
        ->get()
        ->first();

        if($observaciones)
            return response($observaciones->toJson(JSON_PRETTY_PRINT), 200);
        else{
            return response(null, 200);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ObservacionesIniciativa::$rulesPost,  ObservacionesIniciativa::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try{
            $obs = new ObservacionesIniciativa;
            $request->request->add(['usercreated' => $request->user]);
            $result = $obs->create($request->all());
            $id = $result->id;
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
        //
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
        $validator = Validator::make($request->all(), ObservacionesIniciativa::$rulesPut,  ObservacionesIniciativa::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $obs = ObservacionesIniciativa::find($id);

            $request->request->add(['usermodifed' => $request->user]);
            $obs->fill($request->all());
            $obs->save();
            DB::commit();
            return response()->json(['message' => 'OK'], 200);

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
        //
    }
}
