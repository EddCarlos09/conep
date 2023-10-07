<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogNd extends Model
{
    use HasFactory;
    public $table = "blog_nds";
    public static $rules = [        
        'portada'=>'required',
        'titulo'=>'required',       
        'tema_blog_id'=>'required|int|min:1',
        'tipo_publicacion_id'=>'required|int|min:1',
        'descripcion'=>'required|min:3',
        'conceptos' => 'required',
        'fecha_publicacion'=>'required'
    ];

    public static $messages = [                
        'portada.required' => 'La portada es requerida.',   
        'titulo.required' => 'El titulo es requerido.',        
        'tema_blog_id.min' => 'El tema es requerido.',
        'fecha_publicacion.required'=>'La fecha es requerida',
        'tipo_publicacion_id.min' => 'El tipo de publicación es requerido.',
        'descripcion.required' => 'La descripcion es requerida',
        'descripcion.min'=> 'La descripcion no puede ser menor a :min caracteres.',
        'conceptos.required' => 'Al menos un concepto es requerido'
    ];
    
    protected $fillable = [                
        'titulo',
        'tema_blog_id',
        'tipo_publicacion_id',
        'descripcion', 
        'fecha_publicacion',
        'destacado',
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
    public function blogNdPortada()
    {
        return $this->hasMany('App\Models\BlogNdPortada')->where('activo', 1);
    }
    public function conceptos()
    {
        return $this->hasMany('App\Models\BlogNdConcepto', 'blog_nd_id', 'id')->with("glosarioLegislativo")->where('activo',1);
    }
    public function temaBlog(){
        return $this->hasOne('App\Models\TemaBlogNd', 'id', 'tema_blog_id')->where(
            'activo',1
        );
    }
    public function tipoPublicacion(){
        return $this->hasOne('App\Models\TipoPublicacion', 'id', 'tipo_publicacion_id')->where(
            'activo',1
        );
    }
}
