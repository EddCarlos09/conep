<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongresoVisibleAliado extends Model
{
    use HasFactory;
    public static $rulesPost         = [
        'nombre'       => 'required|max:200|min:3',
        'imagen'       => 'required',
        'urlexterna'   => 'required'
    ];
    public static $rulesPostMessages = [
        'nombre.required'   => 'El nombre del aliado es requerido.',
        'nombre.max'        => 'El nombre del aliado no puede ser mayor a :max caracteres.',
        'nombre.min'        => 'El nombre del aliado no puede ser menor a :min caracteres.',
        'imagen.required'            => 'La imagen es requerida',
        'urlexterna.required'        => 'la url externa es requerida'
    ];

    public static $rulesPut = [
        'nombre'=>'required|max:200|min:3',        
        'urlexterna'=>'required'
    ];

    public static $rulesPutMessages = [
        'nombre.required'   => 'El nombre del aliado nes requerido.',
        'nombre.max'        => 'El nombre del aliado no puede ser mayor a :max caracteres.',
        'nombre.min'        => 'El nombre del aliado no puede ser menor a :min caracteres.',
        'urlexterna.required'        => 'la url externa es requerida'
    ];
    protected $fillable = [
        'nombre',
        'urlexterna',
        'congreso_visible_id',
        'activo',
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];
    protected     $hidden = [
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];

    public function aliadoImagen()
    {
        return $this->hasMany('App\Models\CongresoVisibleAliadoImagen','aliado_id','id')->where('activo',1);
    }
}
