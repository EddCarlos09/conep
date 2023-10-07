<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\OpinionCongresista;
use App\Models\OpinionCongresistaDatosContacto;
use App\Models\OpinionCongresistaImagen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use DB;
use Validator;

class OpinionCongresistaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = OpinionCongresista::query();

        if ($request->has('idFilter') && !is_null($request["idFilter"]))
        {
            $query->where(
                'activo',
                $request->idFilter
            );
        }

        if ($request->has('annoPublicacion') && !is_null($request["annoPublicacion"]))
        {
            $query->whereRaw("YEAR(fechaPublicacion) = ". $request->annoPublicacion);
        }

        if ($request->has('persona') && !is_null($request["persona"]))
        {
            $query->where(
                'persona_id',
                $request->persona
            );
        }

        $result = $query->orderBy('fechaPublicacion','desc')->get()->toJson(JSON_PRETTY_PRINT);
        return response($result);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), OpinionCongresista::$rulesPost, OpinionCongresista::$rulesPostMessages);
        if ($validator->fails())
            return response()->json($validator->errors(),422);

        DB::beginTransaction();
        try
        {
            $opinionC = new OpinionCongresista();
            $request->request->add(['usercreated' => $request->user]);
            $result = $opinionC->create($request->all());
            $id = $result->id;
            if($result != null)
            {
                $files = $request->file('imagen');
                if($request->hasFile('imagen'))
                {
                    $nombre = $id;
                    foreach ($files as $file)
                    {
                        // Se crea registro
                        $imagenOpinionC = new OpinionCongresistaImagen();
                        $imagenOpinionC->usercreated = $request->user;
                        $imagenOpinionC->opinion_congresista_id = $id;
                        $imagenOpinionC->activo = 1;
                        $path = $file->storeAs(
                            '/OpinionCongresista/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );
                        $imagenOpinionC->imagen = $path;
                        $imagenOpinionC->save();
                    }
                }
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
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $opinionCongresista = OpinionCongresista::select('id','titulo','persona_id','tipo_publicacion_id','fechaPublicacion','resumen','opinion','activo')
        ->with('OpinionCongresistaImagen', 'Persona')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($opinionCongresista,200);
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
        $validator = Validator::make($request->all(), OpinionCongresista::$rulesPut, OpinionCongresista::$rulesPutMessages);

        if ($validator->passes())
        {
            DB::beginTransaction();
            try
            {
                $opinionC = OpinionCongresista::find($id);
                if($request->hasFile('imagen'))
                {
                    $imagenesAnteriores = OpinionCongresistaImagen::select('id')
                    ->where('opinion_congresista_id',$opinionC->id)
                    ->where('activo',1)
                    ->get();
                    $files = $request->file('imagen');

                    if($imagenesAnteriores != null)
                    {
                        foreach($imagenesAnteriores as $key => $imagenAnterior)
                        {
                            $imgAnterior = OpinionCongresistaImagen::find($imagenesAnteriores[$key]->id);
                            if(Storage::disk('public')->exists($imgAnterior->imagen))
                                Storage::disk('public')->delete($imgAnterior->imagen);
                            $imgAnterior->usermodifed = $request->user;
                            $imgAnterior->activo = 0;
                            $imgAnterior->save();
                        }
                    }
                    $nombre = $id;
                    foreach($files as $file)
                    {
                         // Se crea registro
                        $imagenOpinionC = new OpinionCongresistaImagen();
                        $imagenOpinionC->usercreated = $request->user;
                        $imagenOpinionC->opinion_congresista_id = $id;
                        $imagenOpinionC->activo = 1;
                        $path = $file->storeAs(
                            '/OpinionCongresista/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );
                        $imagenOpinionC->imagen = $path;
                        $imagenOpinionC->save();
                    }
                }
                $request->request->add(['usermodifed' => $request->user]);
                $opinionC->fill($request->all());
                $opinionC->save();

                DB::commit();
                return response()->json(['message' => 'OK'], 202);
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
        $opinionCongresista = OpinionCongresista::find($id);
        $opinionCongresista->activo=!$opinionCongresista->activo;
        $opinionCongresista->save();
        return response($opinionCongresista, 200);
    }
}
