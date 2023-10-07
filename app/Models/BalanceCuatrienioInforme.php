<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BalanceCuatrienioInforme extends Model
{
    use HasFactory;
    public $table = "balance_cuatrienio_informes";
    public static $rulesPost = [
        'titulo' => 'required|max:200|min:3',
        'balance_cuatrienio_id' => 'required|int|min:1',
        'equipo_id' => 'required|int|min:1',
        'tipo_publicacion_id' => 'required|int|min:1',
        'fuente' => 'required|max:100|min:3',
        'fechaPublicacion' => 'required',
        'autores' => 'required|max:300|min:3',
        'resumen' => 'required|min:3',
        'textoPublicacion' => 'required|min:3',
        'imagen' => 'required',
        'conceptos' => 'required'
    ];

    public static $messagesPost = [
        'titulo.required' => 'El título es requerido.',
        'titulo.max' =>'El título no puede ser mayor a :max caracteres.',
        'titulo.min' => 'El título no puede ser menor a :min caracteres.',

        'equipo_id.min' => 'Debe seleccionar un equipo',

        'tipo_publicacion_id.min' => 'Debe seleccionar un tipo de publicación',

        'fuente.required' => 'La fuente es requerida.',
        'fuente.max' =>'La fuente no puede ser mayor a :max caracteres.',
        'fuente.min' => 'La fuente no puede ser menor a :min caracteres.',

        'fechaPublicacion.required' => 'La fecha de publicación es requerida.',

        'autores.required' => 'El campo autores es requerido.',
        'autores.max' =>'El campo autores no puede ser mayor a :max caracteres.',
        'autores.min' => 'El campo autores no puede ser menor a :min caracteres.',

        'resumen.required' => 'El resumen es requerido.',
        'resumen.min' => 'El resumen no puede ser menor a :min caracteres.',

        'textoPublicacion.required' => 'El texto de la publicacion es requerido.',
        'textoPublicacion.min' => 'El texto de la publicacion no puede ser menor a :min caracteres.',

        'imagen.required' => 'La imagen es requerida',
        'conceptos.required' => 'Al menos un concepto es requerido'
    ];

    public static $rulesPut = [
        'titulo' => 'required|max:200|min:3',
        'equipo_id' => 'required|int|min:1',
        'tipo_publicacion_id' => 'required|int|min:1',
        'fuente' => 'required|max:100|min:3',
        'fechaPublicacion' => 'required',
        'autores' => 'required|max:300|min:3',
        'resumen' => 'required|min:3',
        'textoPublicacion' => 'required|min:3',
        'conceptos' => 'required'
    ];

    public static $messagesPut = [
        'titulo.required' => 'El título es requerido.',
        'titulo.max' =>'El título no puede ser mayor a :max caracteres.',
        'titulo.min' => 'El título no puede ser menor a :min caracteres.',

        'equipo_id.min' => 'Debe seleccionar un equipo',

        'tipo_publicacion_id.min' => 'Debe seleccionar un tipo de publicación',

        'fuente.required' => 'La fuente es requerida.',
        'fuente.max' =>'La fuente no puede ser mayor a :max caracteres.',
        'fuente.min' => 'La fuente no puede ser menor a :min caracteres.',

        'fechaPublicacion.required' => 'La fecha de publicación es requerida.',

        'autores.required' => 'El campo autores es requerido.',
        'autores.max' =>'El campo autores no puede ser mayor a :max caracteres.',
        'autores.min' => 'El campo autores no puede ser menor a :min caracteres.',

        'resumen.required' => 'El resumen es requerido.',
        'resumen.min' => 'El resumen no puede ser menor a :min caracteres.',

        'textoPublicacion.required' => 'El texto de la publicacion es requerido.',
        'textoPublicacion.min' => 'El texto de la publicacion no puede ser menor a :min caracteres.',

        'conceptos.required' => 'Al menos un concepto es requerido'
    ];

    protected $fillable = [                
        'titulo',
        'balance_cuatrienio_id',
        'equipo_id',
        'tipo_publicacion_id',
        'fuente',
        'fechaPublicacion',
        'autores',
        'resumen',
        'textoPublicacion',
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

    public function imagen()
    {
        return $this->hasMany('App\Models\BalanceCuatrienioInformeImagen', 'balance_informe_id', 'id')->where('activo',1);
    }
    public function conceptos()
    {
        return $this->hasMany('App\Models\BalanceCuatrienioInformeConcepto', 'balance_informe_id', 'id')->with("glosarioLegislativo")->where('activo',1);
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
