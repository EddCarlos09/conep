<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PaseLista;
use App\Models\PaseListaCongresista;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PaseListaController extends Controller
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

        $items = PaseLista::select([
            'id',
            'fecha',
            'activo',
            'legislatura_id',
            'cuatrienio_id',
            'corporacion_id',
            'tipo_pase_lista_id',
            'tipo_comision_id',
            'comision_id'
        ])
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where(function ($query) use ($search){
            $query->where(DB::raw("(DATE_FORMAT(fecha,'%d/%m/%Y'))"), 'LIKE', '%' . $search . '%')
            ->orWhereHas('Legislatura', function ($query) use ($search) {
                $query->where('nombre', 'like', '%'. $search .'%');
            })
            ->orWhereHas('Cuatrienio', function ($query) use ($search) {
                $query->where('nombre', 'like', '%'. $search .'%');
            })
            ->orWhereHas('Corporacion', function ($query) use ($search) {
                $query->where('nombre', 'like', '%'. $search .'%');
            })
            ->orWhereHas('TipoPaseLista', function ($query) use ($search) {
                $query->where('nombre', 'like', '%'. $search .'%');
            })
            ->orWhereHas('TipoComision', function ($query) use ($search) {
                $query->where('nombre', 'like', '%'. $search .'%');
            })
            ->orWhereHas('Comision', function ($query) use ($search) {
                $query->where('nombre', 'like', '%'. $search .'%');
            });
        })
        ->with(['Legislatura', 'Cuatrienio', 'Corporacion', 'TipoPaseLista', 'TipoComision', 'Comision'])
        ->skip(($request->input('page') - 1) * $request->input('rows'))->take($request->input('rows'))      
        ->get()
        ->toJson(JSON_PRETTY_PRINT);

        return response($items,200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), PaseLista::rulesPost(), PaseLista::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $item = new PaseLista();
            $request->request->add(['usercreated' => $request->user]);
            $result = $item->create($request->all());
            $pase_lista_congresista = $request->pase_lista_congresista;

            foreach ($pase_lista_congresista as $item)
            {
                $item_pase_lista_congresista = new PaseListaCongresista();
                $item_pase_lista_congresista->fill($item);
                $item_pase_lista_congresista->pase_lista_id = $result->id;
                $item_pase_lista_congresista->usercreated = $request->user;
                $item_pase_lista_congresista->activo = 1;
                $item_pase_lista_congresista->save();
            }
            DB::commit();
            return response()->json(['message' => 'OK'],202);
        }
        catch (\Illuminate\Database\QueryException $ex)
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
        $item = PaseLista::select([
            'id',
            'fecha',
            'activo',
            'legislatura_id',
            'cuatrienio_id',
            'corporacion_id',
            'tipo_pase_lista_id',
            'tipo_comision_id',
            'comision_id'
        ])
        ->where('id', $id)
        ->with(['Legislatura', 'Cuatrienio', 'Corporacion', 'TipoPaseLista', 'TipoComision', 'Comision',  'PaseListaCongresista'])
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
        $validator = Validator::make($request->all(), PaseLista::rulesPut(), PaseLista::$rulesPutMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try
        {
            $itemOriginal = PaseLista::find($id);
            $request->request->add(['usermodifed' => $request->user]);
            $itemOriginal->fill($request->all());
            $itemOriginal->save();
            $pase_lista_congresista = $request->pase_lista_congresista;

            // Ponemos todos los congresistas que esten en el pase de lista a 0
            PaseListaCongresista::where
            (
                [
                    ['pase_lista_id', $itemOriginal->id,]
                ]
            )->update(['activo'=> 0]);

            /* Recorremos el listado de congresista que se trae de la vista
            Aquí pudieramos traer nuevamente el listado y poner la respuesta,
            Para que de esa manera no vayan a agregar otro desde la vista de
            manera manual */
            foreach ($pase_lista_congresista as $item)
            {
                $item_pase_lista_congresista = PaseListaCongresista::where
                (
                    [
                        ['pase_lista_id', $itemOriginal->id,],
                        ['congresista_id', $item["congresista_id"]]
                    ]
                )->first();

                // Checamos si existe en la bd el congresista en la lista
                if($item_pase_lista_congresista != null){
                    // Si existe actualizamos el activo y su fecha de modificación
                    $item_pase_lista_congresista->fill($item);
                    $item_pase_lista_congresista->usermodifed = $request->user;
                }
                else{
                    // Como no existe creamos un nuevo item de tipo pase de lista congresista
                    // Y lo agregamos a la bd
                    $item_pase_lista_congresista = new PaseListaCongresista();
                    $item_pase_lista_congresista->fill($item);
                    $item_pase_lista_congresista->usercreated = $request->user;
                }
                $item_pase_lista_congresista->pase_lista_id = $itemOriginal->id;
                $item_pase_lista_congresista->activo = 1;
                $item_pase_lista_congresista->save();
            }
            //Borramos los que esten activo 0 en el pase de lista
            PaseListaCongresista::where
            (
                [
                    ['pase_lista_id', $itemOriginal->id,],
                    ['activo', 0]
                ]
            )->delete();

            DB::commit();
            return response()->json(['message' => 'OK'],202 );
        }
        catch (\Exception $ex)
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
        $item = PaseLista::find($id);
        $item->activo = !$item->activo;
        $item->save();
        return response($item,200);
    }

     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $search = $request->input('search');

        $count = PaseLista::select([
            'id',
            'fecha',
            'activo',
            'legislatura_id',
            'cuatrienio_id',
            'corporacion_id',
            'tipo_pase_lista_id',
            'tipo_comision_id',
            'comision_id'
        ])
        ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where(function ($query) use ($search){
            $query->where(DB::raw("(DATE_FORMAT(fecha,'%d/%m/%Y'))"), 'LIKE', '%' . $search . '%')
            ->orWhereHas('Legislatura', function ($query) use ($search) {
                $query->where('nombre', 'like', '%'. $search .'%');
            })
            ->orWhereHas('Cuatrienio', function ($query) use ($search) {
                $query->where('nombre', 'like', '%'. $search .'%');
            })
            ->orWhereHas('Corporacion', function ($query) use ($search) {
                $query->where('nombre', 'like', '%'. $search .'%');
            })
            ->orWhereHas('TipoPaseLista', function ($query) use ($search) {
                $query->where('nombre', 'like', '%'. $search .'%');
            })
            ->orWhereHas('TipoComision', function ($query) use ($search) {
                $query->where('nombre', 'like', '%'. $search .'%');
            })
            ->orWhereHas('Comision', function ($query) use ($search) {
                $query->where('nombre', 'like', '%'. $search .'%');
            });
        })
        ->with(['Legislatura', 'Cuatrienio', 'Corporacion', 'TipoPaseLista', 'TipoComision', 'Comision'])
        ->count();

        return response($count, 200);
    }

    public function getPaseListaCongresistas($pase_lista_id, $congresista_id){
        $items = PaseListaCongresista::select([
            'pase_lista_id',
            'congresista_id',
            'tipo_respusta_pase_lista_id',
            'activo',
        ])
        ->where('activo', '=' , 1)
        ->where(function ($query) use ($pase_lista_id, $congresista_id){
            $query->where('pase_lista_id', '=', $pase_lista_id)
            ->orWhereHas('congresista_id', '=', $congresista_id);
        })
        ->get();

        return response($items,200);
    }
}
