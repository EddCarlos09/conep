<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BlogNd;
use App\Models\BlogNdPortada;
use App\Models\BlogNdConcepto;
use Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use DB;


class BlogNdsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = BlogNd::query();

        if ($request->has('idFilter') && !is_null($request["idFilter"]))
        {
            $query->where(
                'activo',
                $request->idFilter
            );
        }

        if ($request->has('search') && !is_null($request["search"]))
        {
            $query->where(
                'titulo',
                'LIKE', '%' . $request->input('search') . '%'
            );
        }

        if ($request->has('anno_publicacion') && !is_null($request["anno_publicacion"]))
        {
            $query->whereRaw("YEAR(fecha_publicacion) = ". $request->anno_publicacion);
        }

        $result = $query->skip(($request->input('page') - 1) * $request->input('rows'))
                    ->take($request->input('rows'))
                    ->orderBy('id','desc')
                    ->get(['id', 'titulo', 'activo'])
                    ->toJson(JSON_PRETTY_PRINT);

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
        $validator = Validator::make($request->all(), BlogNd::$rules,  BlogNd::$messages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        // DB::beginTransaction();
        // try
        // {
            $blognd = new BlogNd;
            $request->request->add(['usercreated' => $request->user]);
            $result = $blognd->create($request->all());
            $id = $result->id;
            if($result != null)
            {
                $files = $request->file('portada');
                if($request->hasFile('portada'))
                {
                    $nombre = $id;
                    foreach ($files as $file)
                    {
                        // Se crea registro
                        $portadaBlogNd = new BlogNdPortada;
                        $portadaBlogNd->usercreated = $request->user;
                        $portadaBlogNd->blog_nd_id = $id;
                        $portadaBlogNd->activo = 1;
                        $path = $file->storeAs(
                            '/blognd/'.$nombre, // Directorio
                            $file->getClientOriginalName(), // Nombre real de la imagen
                            'public' // disco
                        );
                        $portadaBlogNd->portada = $path;
                        $portadaBlogNd->save();
                    }
                }

                // Conceptos

                $conceptos = $request->input('conceptos');
                if($conceptos != null)
                {
                    foreach($request->input('conceptos') as $key => $value)
                    {
                        $conceptos[$key]['blog_nd_id'] = $id;
                        $requestBlogNdConcepto = new Request($conceptos[$key]);

                        if($requestBlogNdConcepto->activo == 1)
                        {
                            $BlogNdConcepto = new BlogNdConcepto;
                            $BlogNdConcepto->fill($requestBlogNdConcepto->all());
                            $BlogNdConcepto->usercreated = $request->user;
                            $BlogNdConcepto->save();
                        }
                    }
                }
            }
        //     DB::commit();
        //     return response()->json(['message' => 'OK'], 201);
        // }
        // catch (\Throwable $e)
        // {

        //     DB::rollback();
        //     return response()->json(['message' => $e], 422);
        // }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $blognd = BlogNd::select(
        'id',
        'titulo',
        'tema_blog_id',
        'destacado',
        'tipo_publicacion_id',
        'fecha_publicacion',
        'descripcion',
        'activo')
        ->with('blogNdPortada', 'conceptos')
        ->where('id', $id)
        ->get()
        ->toJson(JSON_PRETTY_PRINT);
        return response($blognd, 200);
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
        $validator = Validator::make($request->all(), array(
            'portada'=>'required',
            'titulo'=>'required',
            'tema_blog_id'=>'required|int|min:1',
            'tipo_publicacion_id'=>'required|int|min:1',
            'descripcion'=>'required',
            'conceptos' => 'required',
            'fecha_publicacion'=>'required',
            'destacado'=>Rule::unique('blog_nds')->where(function ($query) {
                return $query->where('destacado', 1);
            })
        ),  BlogNd::$messages);
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $blognd = BlogNd::find($id);
            $files = $request->file('portada');
            if($request->hasFile('portada'))
            {
                $portadasAnteriores = BlogNdPortada::select('id')
                ->where('blog_nd_id', $blognd->id)
                ->where('activo', 1)
                ->get();
                $files = $request->file('portada');

                if($portadasAnteriores != null)
                {
                    foreach ($portadasAnteriores as $key => $portadaAnterior)
                    {
                        $portada = BlogNdPortada::find($portadasAnteriores[$key]->id);
                        if(Storage::disk('public')->exists($portada->imagen))
                            Storage::disk('public')->delete($portada->imagen);
                        $portada->usermodifed = $request->user;
                        $portada->activo = 0;
                        $portada->save();
                    }
                }
                $nombre = $id;
                foreach ($files as $file)
                {
                    // Se crea registro
                    $portadaBlogNd = new BlogNdPortada;
                    $portadaBlogNd->usercreated = $request->user;
                    $portadaBlogNd->blog_nd_id = $id;
                    $portadaBlogNd->activo = 1;
                    $path = $file->storeAs(
                        '/blognd/'.$nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $portadaBlogNd->portada = $path;
                    $portadaBlogNd->save();
                }
            }
            $request->request->add(['usermodifed' => $request->user]);
            $blognd->fill($request->all());
            $blognd->save();

            $conceptos = $request->input('conceptos');
            if($conceptos != null)
            {
                foreach($request->input('conceptos') as $key => $value)
                {
                    $conceptos[$key]['blog_nd_id'] = $id;
                    $requestConceptos = new Request($conceptos[$key]);
                    if($requestConceptos->id > 0)
                    {
                        if($requestConceptos->activo == 1)
                        {
                            $blogNdConcepto = BlogNdConcepto::find($requestConceptos->id);
                            $blogNdConcepto->fill($requestConceptos->all());
                            $blogNdConcepto->usermodifed = $request->user;
                            $blogNdConcepto->save();
                        }
                        else
                        {
                            $blogNdConcepto = BlogNdConcepto::find($requestConceptos->id);
                            $blogNdConcepto->activo = 0;
                            $blogNdConcepto->usermodifed = $request->user;
                            $blogNdConcepto->save();
                        }
                    }
                    else
                    {
                        if($requestConceptos->activo == 1)
                        {
                            $blogNdConcepto = new BlogNdConcepto;
                            $blogNdConcepto->fill($requestConceptos->all());
                            $blogNdConcepto->usercreated = $request->user;
                            $blogNdConcepto->save();
                        }
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $blognd = BlogNd::find($id);
        $blognd->activo=!$blognd->activo;
        $blognd->save();
        return response($blognd, 200);
    }
      /**
     * Display a listing records of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function totalrecords(Request $request)
    {
        $count = BlogNd::where('activo', $request->input('idFilter'))
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->count();
        return response($count, 200);
    }
}
