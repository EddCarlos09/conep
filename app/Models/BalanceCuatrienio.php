<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BalanceCuatrienio extends Model
{
    use HasFactory;

    public $table = "balance_cuatrienios";
    public static $rulesPost = [
        'titulo' => 'required|max:200|min:3',
        'yearInicio' => 'required',
        'yearFin' => 'required',
        'descripcion' => 'required|min:3',
        'imagen' => 'required'
    ];

    public static $messagesPost = [
        'titulo.required' => 'El título es requerido.',
        'titulo.max' =>'El título no puede ser mayor a :max caracteres.',
        'titulo.min' => 'El título no puede ser menor a :min caracteres.',
        'yearInicio.required' =>'El año de inicio es requerido.',
        'yearFin.required' =>'El año de finalización es requerido.',
        'descripcion.min' =>'La descripción no puede ser menor a :min caracteres.',
        'descripcion.required' =>'La descripción es requerida.',
        'imagen.required' => 'La imagen es requerida'
    ];

    public static $rulesPut = [
        'titulo' => 'required|max:200|min:3',
        'yearInicio' => 'required',
        'yearFin' => 'required',
        'descripcion' => 'required|min:3'
    ];

    public static $messagesPut = [
        'titulo.required' => 'El título es requerido.',
        'titulo.max' =>'El título no puede ser mayor a :max caracteres.',
        'titulo.min' => 'El título no puede ser menor a :min caracteres.',
        'yearInicio.required' =>'El año de inicio es requerido.',
        'yearFin.required' =>'El año de finalización es requerido.',
        'descripcion.min' =>'La descripción no puede ser menor a :min caracteres.',
        'descripcion.required' =>'La descripción es requerida.'
    ];

    protected $fillable = [                
        'titulo',
        'yearInicio',
        'yearFin',
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

    public function informes()
    {
        return $this->hasMany('App\Models\BalanceCuatrienioInforme')->with("imagen", "equipo", "tipoPublicacion", "conceptos")->where('activo',1);
    }
    public function imagen()
    {
        return $this->hasMany('App\Models\BalanceCuatrienioImagen')->where('activo',1);
    }
}
