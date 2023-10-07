<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Opinion extends Model
{
    use HasFactory;
    public static $rulesPost = [
        'titulo'                => 'required|max:250|min:3',
        'equipo_id'             => 'required|int|min:1',
        'tipo_publicacion_id'   => 'required|int|min:1',
        'fechaPublicacion'      => 'required',
        'resumen'               => 'required',
        'opinion'               => 'required'        
    ];
    public static $rulesPostMessages = [
        'titulo.required'       => 'El título es requerido',
        'titulo.max'            => 'El título no puede ser mayor a :max caracteres.',
        'titulo.min'            => 'El título no puede ser menor a :min caracteres',
        'equipo_id.min'         => 'Debe seleccionar un equipo',
        'tipo_publicacion_id.min' => 'Debe seleccionar un tipo de publicación',
        'fechaPublicacion.required' => 'La fecha de publicación es requerida.',
        'resumen.required'          => 'El resumen es requerido',
        'opinion.required'      => 'La opinión es requerida'       
    ];

    public static $rulesPut = [
        'titulo'         => 'required|max:250|min:3',
        'equipo_id'     => 'required|int|min:1',
        'tipo_publicacion_id'   => 'required|int|min:1',
        'fechaPublicacion' => 'required',             
        'resumen'       => 'required',
        'opinion'       => 'required'    
    ];

    public static $rulesPutMessages = [
        'titulo.required'       => 'El título es requerido',
        'titulo.max'            => 'El título no puede ser mayor a :max caracteres.',
        'titulo.min'            => 'El título no puede ser menor a :min caracteres',
        'equipo_id.min'         => 'Debe seleccionar un equipo',
        'tipo_publicacion_id.min' => 'Debe seleccionar unn tipo de publicación',
        'fechaPublicacion.required' => 'La fecha de publicación es requerida.',
        'resumen.required'          => 'El resumen es requerido',
        'opinion.required'      => 'La opinión es requerida'
    ];

    protected $fillable = [
        'titulo',
        'equipo_id',
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

    public function OpinionImagen()
    {
        return $this->hasMany('App\Models\OpinionImagen')->where('activo',1);
    }
    public function tipoPublicacion()
    {
        return $this->hasOne('App\Models\TipoPublicacion', 'id', 'tipo_publicacion_id')->where('activo',1);
    }
    public function equipo()
    {
        return $this->hasOne('App\Models\CongresoVisibleEquipo', 'id', 'equipo_id')->with("equipoImagen")->where('activo',1);
    }
}
