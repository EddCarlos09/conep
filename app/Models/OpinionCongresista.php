<?php

namespace App\Models;

use Composer\Util\Zip;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpinionCongresista extends Model
{
    use HasFactory;
    public static $rulesPost = [
        'titulo'                => 'required|max:250|min:3',
        'persona_id'        => 'required|int|min:1',
        'tipo_publicacion_id'   => 'required|int|min:1',
        'fechaPublicacion'      => 'required',
        'resumen'               => 'required',
        'opinion'               => 'required'
    ];

    public static $rulesPostMessages = [
        'titulo.required'                   => 'El título es requerido',
        'titulo.max'                        => 'El título no puede ser mayor a :max caracteres.',
        'titulo.min'                        => 'El título no puede ser menor a :min caracteres',
        'persona_id.min'                => 'Debe seleccionar una persona',
        'tipo_publicacion_id.min'           => 'Debe seleccionar unn tipo de publicación',
        'fechaPublicacion.required'         => 'La fecha de publicación es requerida.',
        'resumen.required'                  => 'El resumen es requerido',
        'opinion.required'                  => 'La opinión es requerida'
    ];

    public static $rulesPut = [
        'titulo'                => 'required|max:250|min:3',
        'persona_id'        => 'required|int|min:1',
        'tipo_publicacion_id'   => 'required|int|min:1',
        'fechaPublicacion'      => 'required',
        'resumen'               => 'required',
        'opinion'               => 'required'
    ];

    public static $rulesPutMessages = [
        'titulo.required'                   => 'El título es requerido',
        'titulo.max'                        => 'El título no puede ser mayor a :max caracteres.',
        'titulo.min'                        => 'El título no puede ser menor a :min caracteres',
        'persona_id.min'                => 'Debe seleccionar una persona',
        'tipo_publicacion_id.min'           => 'Debe seleccionar unn tipo de publicación',
        'fechaPublicacion.required'         => 'La fecha de publicación es requerida.',
        'resumen.required'                  => 'El resumen es requerido',
        'opinion.required'                  => 'La opinión es requerida'
    ];

    protected $fillable = [
        'titulo',
        'persona_id',
        'tipo_publicacion_id',
        'fechaPublicacion',
        'resumen',
        'opinion',
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
    
    public function OpinionCongresistaImagen()
    {
        return $this->hasMany('App\Models\OpinionCongresistaImagen')->where('activo',1);
    }

    public function tipoPublicacion()
    {
        return $this->hasOne('App\Models\TipoPublicacion', 'id', 'tipo_publicacion_id')->where('activo',1);
    }    

    public function Persona()
    {
        return $this->hasOne('App\Models\Persona','id','persona_id')->with("Imagenes")->where('activo',1);
    }
}
