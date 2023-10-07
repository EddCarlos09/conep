<?php

namespace App\Http\Controllers\CLIENTAPI;

use App\Http\Controllers\Controller;
use App\Models\BlogNd;
use App\Models\BlogNdPortada;
use App\Models\BlogNdConcepto;
use App\Models\TipoPublicacion;
use App\Models\TemaBlogNd;
use Illuminate\Http\Request;

class BlogNdsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $tema=$request->input('tema');
        $tipoPublicacion=$request->input('tipo');
        $search=$request->input('search');                
            $entradasBlog = BlogNd::select(
                'id',        
                'titulo',                
                'tipo_publicacion_id',
                'fecha_publicacion',        
                'activo') 
                ->with('blogNdPortada','tipoPublicacion','conceptos')
                ->where('activo', '=', 1)
                ->where('tipo_publicacion_id', ($tipoPublicacion != "-1") ? '=' : '!=', $tipoPublicacion)
                ->where('tema_blog_id', ($tema != "-1") ? '=' : '!=', $tema)                
                ->where('titulo', 'LIKE', '%' . $search . '%')                
                ->skip(($request->input('page') - 1) * $request->input('rows'))
                ->take($request->input('rows'))
                ->get()
                ->toJson(JSON_PRETTY_PRINT);
                return response($entradasBlog,200);                
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function indexUltimasPublicaciones()
    {
        $ultimasBlog = BlogNd::select(
            'id',        
            'titulo',            
            'fecha_publicacion',
            'tipo_publicacion_id',            
            'activo') 
            ->with('blogNdPortada', 'conceptos','tipoPublicacion')
            ->where('activo', 1)
            ->take(10)
            ->orderBy('id','desc')            
            ->get()
            ->toJson(JSON_PRETTY_PRINT);
            return response($ultimasBlog,200); 
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function detalleBlog($id)
    {
        $blognd = BlogNd::with('blogNdPortada', 'conceptos','tipoPublicacion', 'temaBlog')
            ->where('id', $id)
            ->get()
            ->toJson(JSON_PRETTY_PRINT);
            return response($blognd, 200);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function destacadoBlog()
    {
        $blognd = BlogNd::select(
            'id',        
            'titulo',
            'fecha_publicacion',            
            'tema_blog_id',
            'tipo_publicacion_id',
            'descripcion',
            'activo')
            ->with('blogNdPortada', 'conceptos','tipoPublicacion')
            ->where('activo', 1)
            ->where('destacado', 1)
            ->get()
            ->toJson(JSON_PRETTY_PRINT);
            return response($blognd, 200);
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
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
        //
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
    public function totalrecords(Request $request)
    {
        $tema=$request->input('tema_blog_id');
        $tipoPublicacion=$request->input('tipo_publicacion_id');
        $search=$request->input('search');       
        $count = BlogNd::where('activo', '=', 1)        
        ->where('tipo_publicacion_id', ($tipoPublicacion != "-1") ? '=' : '!=', $tipoPublicacion)
        ->where('tema_blog_id', ($tema != "-1") ? '=' : '!=', $tema)
        ->where('titulo', 'LIKE', '%' . $search . '%')
        ->count();
        return response($count, 200);        
    }
}
