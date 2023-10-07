<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Corporacion extends Model
{
    use HasFactory;

    public static $rulesPut = [
        'nombre' => 'required|max:200|min:3',
        'descripcion' =>'required|max:255|min:3',
        'datosContacto.*.cuenta' => 'exclude_if:datosContacto.*.activo,0|required|max:200|min:3',
        'miembros.*.congresista_id'                 => 'exclude_if:miembros.*.activo,0|required|int|min:1',
        'miembros.*.comision_cargo_congresista_id'  => 'exclude_if:miembros.*.activo,0|required|int|min:1'
    ];
    public static $messagesPut = [
        'nombre.required'   => 'El nombre es requerido.',
        'nombre.max'        => 'El nombre no puede ser mayor a :max caracteres.',
        'nombre.min'        => 'El nombre no puede ser menor a :min caracteres.',
        'descripcion.required'   => 'La descripción es requerido.',
        'descripcion.max'        => 'La descripción no puede ser mayor a :max caracteres.',
        'descripcion.min'        => 'La descripción no puede ser menor a :min caracteres.',
        'datosContacto.*.cuenta.required' => 'El dato de contacto es requerido.',
        'datosContacto.*.cuenta.max'      => 'El dato de contacto no puede ser mayor a :max caracteres.',
        'datosContacto.*.cuenta.min'      => 'El dato de contacto no puede ser menor a :min caracteres.',
        'miembros.*.congresista_id.min'     => 'Debe seleccionar un congresista',
        'miembros.*.comision_cargo_congresista_id' => 'Debe seleccionar un cargo para el congresista'
    ];

    protected $fillable = [
        'nombre',
        'descripcion',
        'usercreated',
        'activo',
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

    public function corporacionImagen()
    {
        return $this->hasMany('App\Models\CorporacionImagen')->where('activo', 1);
    }

    public function corporacionDatosContacto()
    {
        return $this->hasMany('App\Models\CorporacionDatosContacto')->with("datosContacto")->where(
            'activo',
            1
        );
    }

    public function corporacionMiembro()
    {
        return $this->hasMany('App\Models\CorporacionMiembro')
        ->with("congresista", "comisionCargoCongresista")->where(   
            'activo',
            1
        );
    }
}
