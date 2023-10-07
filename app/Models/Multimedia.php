<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Multimedia extends Model
{
    use HasFactory;

    public static $rulesPost = [
        'titulo'                => 'required|max:250|min:3',
        'tipo_multimedia_id'    => 'required|int|min:1',
        'fechaPublicacion'      => 'required',
        'descripcion'           => 'required'
    ];

    public static $rulesPostMessages = [
        'titulo.required'               => 'El titulo es requerido',
        'titulo.max'                    => 'El titulo no puede ser mayor a :max caracteres.',
        'titulo.min'                    => 'El titulo no puede ser menor a :min caracteres',
        'fechaPublicacion'              => 'La fecha de publicacion es requerido',
        'tipo_multimedia_id.min'        => 'Debe seleccionar un tipo de publicación',
        'descripcion.required'          => 'La descripcion es requerido'
    ];

    public static $rulesPut = [
        'titulo'                => 'required|max:250|min:3',
        'fechaPublicacion'      => 'required',
        'tipo_multimedia_id'    => 'required|int|min:1',
        'descripcion'           => 'required'
    ];
    
    public static $rulesPutMessages = [
        'titulo.required'               => 'El titulo es requerido',
        'titulo.max'                    => 'El titulo no puede ser mayor a :max caracteres.',
        'titulo.min'                    => 'El titulo no puede ser menor a :min caracteres',
        'fechaPublicacion'              => 'La fecha de publicacion es requerido',
        'tipo_multimedia_id.min'        => 'Debe seleccionar un tipo de publicación',
        'descripcion.required'          => 'La descripcion es requerido'
    ];

    protected $fillable = [
        'titulo',      
        'tipo_multimedia_id',
        'fechaPublicacion',
        'descripcion',      
        'activo',
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];

    protected $hidden = [
    'usercreated',
    'usermodifed',
    'created_at',
    'updated_at'        
    ];

    public function MultimediaArchivo()
    {
        return $this->hasMany('App\Models\MultimediaArchivo')->where('activo',1);
    }
    public function tipoMultimedia(){
        return $this->hasOne('App\Models\TipoMultimedia', 'id', 'tipo_multimedia_id')->where('activo',1);
    }
}