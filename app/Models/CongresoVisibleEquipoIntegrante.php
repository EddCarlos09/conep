<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongresoVisibleEquipoIntegrante extends Model
{
    use HasFactory;

    public static $rulesPost         = [
        'nombre'                        => 'required|max:200|min:3',
        'descripcion'                   => 'required',       
        'datosContacto.*.cuenta'        => 'exclude_if:datosContacto.*.activo,0|required|max:200|min:3'
    ];

    public static $rulesPostMessages = [
        'nombre.required'               => 'El nombre del integrante es requerido.',
        'nombre.max'                    => 'El nombre del integrante no puede ser mayor a :max caracteres.',
        'nombre.min'                    => 'El nombre del integrante no puede ser menor a :min caracteres.',
        'descripcion.required'              => 'La descripcion del integrante es requerida.',
        'datosContacto.*.cuenta.required'   => 'El dato de contacto es requerido.',
        'datosContacto.*.cuenta.max'        => 'El dato de contacto no puede ser mayor a :max caracteres.',
        'datosContacto.*.cuenta.min'        => 'El dato de contacto no puede ser menor a :min caracteres.',
    ];

    public static $rulesPut         = [
        'nombre'                        => 'required|max:200|min:3',
        'descripcion'                   => 'required',       
        'datosContacto.*.cuenta'        => 'exclude_if:datosContacto.*.activo,0|required|max:200|min:3'
    ];

    public static $rulesPutMessages = [
        'nombre.required'               => 'El nombre del integrante es requerido.',
        'nombre.max'                    => 'El nombre del integrante no puede ser mayor a :max caracteres.',
        'nombre.min'                    => 'El nombre del integrante no puede ser menor a :min caracteres.',
        'descripcion.required'          => 'La descripcion del integrante es requerida.',
        'datosContacto.*.cuenta.required'   => 'El dato de contacto es requerido.',
        'datosContacto.*.cuenta.max'        => 'El dato de contacto no puede ser mayor a :max caracteres.',
        'datosContacto.*.cuenta.min'        => 'El dato de contacto no puede ser menor a :min caracteres.'

    ];

    protected  $fillable = [
        'nombre',
        'descripcion',
        'equipo_id',
        'cargo_id',
        'activo',
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];
    protected $hidden  = [
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];

    public function integrantesContacto()
    {
        return $this->hasMany('App\Models\CongresoVisibleIntegranteDatoContacto','integrante_id','id')->with("datosContacto")->where('activo',1);
    }
    public function integrantesCargo()
    {
        return $this->hasMany('App\Models\CargoIntegrante','cargo_id','id')->where('activo',1);
    }
}
