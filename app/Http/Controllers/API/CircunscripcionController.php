<?php
    namespace App\Http\Controllers\API;

    use App\Http\Controllers\Controller;
    use App\Models\Circunscripcion;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\DB;
    use Illuminate\Support\Facades\Validator;

    class CircunscripcionController extends Controller
    {
        /**
         * Display a listing of the resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function index(Request $request)
        {
            $filter = $request->input('idFilter');
            $items = Circunscripcion::select('id','nombre', 'departamento_id','activo')
            ->with("departamento")
            ->where('activo', ($filter != "-1") ? '=' : '!=', $filter)
            ->where('nombre','LIKE','%' . $request->input('search') . '%')
            ->skip(($request->input('page') - 1) * $request->input('rows'))->take($request->input('rows'))
            ->orderBy('id','desc')
            ->get()
            ->toJson(JSON_PRETTY_PRINT);
            return response($items,200);
        }

        /**
         * Store a newly created resource in storage.
         *
         * @param \Illuminate\Http\Request $request
         * @return \Illuminate\Http\Response
         */
        public function store(Request $request)
        {
            $validator = Validator::make($request->all(),Circunscripcion::$rulesPost,Circunscripcion::$rulesPostMessages);
            if ($validator->fails())
                return response()->json($validator->errors(), 422);

            DB::beginTransaction();
            try
            {
                $item = new Circunscripcion();
                $request->request->add(['usercreated' => $request->user]);
                $item->create($request->all());
                DB::commit();
                return response()->json(['message' => 'OK'],202);
            } 
            catch (\Exception $e)
            {
                DB::rollback();
                return response()->json(['message' => 'Error'],422);
            }
        }

        /**
         * Display the specified resource.
         *
         * @param int $id
         * @return \Illuminate\Http\Response
         */
        public function show($id)
        {
            $item = Circunscripcion::select('id','nombre', 'departamento_id','activo')
            ->with("departamento")
            ->where('id',$id)
            ->get()
            ->first();
            return response($item,200);
        }

        /**
         * Update the specified resource in storage.
         *
         * @param \Illuminate\Http\Request $request
         * @param int $id
         * @return \Illuminate\Http\Response
         */
        public function update(Request $request,$id)
        {
            $validator = Validator::make($request->all(),Circunscripcion::$rulesPut,Circunscripcion::$rulesPutMessages);
            if ($validator->fails())
                return response()->json($validator->errors(),422);

            DB::beginTransaction();
            try
            {
                $itemOriginal = Circunscripcion::find($id);
                $request->request->add(['usermodifed' => $request->user]);
                $itemOriginal->fill($request->all());
                $itemOriginal->save();
                DB::commit();
                return response()->json(['message' => 'OK'],202 );
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
         * @param int $id
         * @return \Illuminate\Http\Response
         */
        public function destroy($id)
        {
            $item = Circunscripcion::find($id);
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
            $count = Circunscripcion::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
            ->where('nombre','LIKE','%' . $request->input('search') . '%')
            ->count();
            return response($count,200);
        }
    }
