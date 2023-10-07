<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Podcast;
use App\Models\PodcastImagen;
use Validator;
use App\Messages;
use Carbon\Carbon;
use DB;
use Illuminate\Support\Facades\Storage;
use EloquentBuilder;

class PodcastController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->input('idFilter');
        $items = Podcast::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->skip(($request->input('page') - 1) * $request->input('rows'))
        ->take($request->input('rows'))
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
        $validator = Validator::make($request->all(), Podcast::$rulesPost,  Podcast::$messagesPost);        
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $item = new Podcast();
            $request->request->add(['usercreated' => $request->user]);
            $request->merge([
                'esEnlace' => $request->get("esEnlace") == "true" ? 1 : 0
            ]);
            $result = $item->create($request->all()); // Congresista creado
            $audio = $request->file('audio');
            if($audio != null){
                $path = $audio->storeAs(
                    '/podcast/'.$result->id, // Directorio
                    $audio->getClientOriginalName(), // Nombre real de la imagen
                    'public' // disco
                );
                $item = Podcast::find($result->id);
                $item->urlAudio = $path;
                $item->save();  
            }

            // Imágenes
            $files = $request->file('imagen');
            
            if($request->hasFile('imagen'))
            {
                $nombre = $result->id;
                foreach ($files as $file) {
                    // Se crea registro
                    $imagenPodcast = new PodcastImagen;
                    $imagenPodcast->usercreated = $request->user;
                    $imagenPodcast->podcast_id = $nombre;
                    $imagenPodcast->activo = 1;
                    $path = $file->storeAs(
                        '/podcast/'.$nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $imagenPodcast->imagen = $path;
                    $imagenPodcast->save();
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
        $item = Podcast::where('id', $id)->with("podcastImagen")
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
        $validator = Validator::make($request->all(), Podcast::$rulesPut,  Podcast::$messagesPut);        
        if ($validator->fails())
            return response()->json($validator->errors(), 422);

        DB::beginTransaction();
        try
        {
            $itemOriginal = Podcast::find($id);
            $request->merge([
                'esEnlace' => $request->get("esEnlace") == "true" || $request->get("esEnlace") == "1" ? 1 : 0
            ]);
            $request->request->add(['usermodifed' => $request->user]);
            $itemOriginal->fill($request->all());
            $file = $request->file('audio');
            if($file){
                if(Storage::disk('public')->exists($itemOriginal->urlAudio))
                    Storage::disk('public')->delete($itemOriginal->urlAudio);

                $path = $file->storeAs(
                    '/podcast/'.$itemOriginal->id, // Directorio
                    $file->getClientOriginalName(), // Nombre real de la imagen
                    'public' // disco
                );
                $itemOriginal->urlAudio = $path;
            }
            $itemOriginal->save();
            if($request->hasFile('imagen'))
            {
                $imagenesAnteriores = PodcastImagen::select('id')
                ->where('podcast_id', $itemOriginal->id)
                ->where('activo', 1)
                ->get();
                if($imagenesAnteriores != null)
                {
                    foreach ($imagenesAnteriores as $key => $imagenAnterior)
                    {
                        $img = PodcastImagen::find($imagenAnterior->id);
                        if(Storage::disk('public')->exists($img->imagen))
                            Storage::disk('public')->delete($img->imagen);
                        $img->usermodifed = $request->user;
                        $img->activo = 0;
                        $img->save();
                    }
                }
                $files = $request->file('imagen');
                $nombre = $id;
                foreach ($files as $file) {
                    // Se crea registro
                    $imagenPodcast = new PodcastImagen;
                    $imagenPodcast->usercreated = $request->user;
                    $imagenPodcast->podcast_id = $id;
                    $imagenPodcast->activo = 1;
                    $path = $file->storeAs(
                        '/podcast/'.$nombre, // Directorio
                        $file->getClientOriginalName(), // Nombre real de la imagen
                        'public' // disco
                    );
                    $imagenPodcast->imagen = $path;
                    $imagenPodcast->save();
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
        $item = Podcast::find($id);
        $item->activo = !$item->activo;
        $item->save();
        return response($item, 200);
    }

    public function totalrecords(Request $request)
    {
        $filter = $request->input('idFilter');
        $count = Podcast::where('activo', ($filter != "-1") ? '=' : '!=', $filter)
        ->where('titulo', 'LIKE', '%' . $request->input('search') . '%')
        ->count();
        return response($count, 200);
    }
}
