<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongresoVisibleEquipo extends Model
{
    use HasFactory;
    public static $rulesPost         = [
        'nombre'       => 'required|max:200|min:3',
        'descripcion'  => 'required',
        'imagen'       => 'required',
        'datosContacto.*.cuenta'  => 'exclude_if:datosContacto.*.activo,0|required|max:200|min:3'
    ]; 

    public static $rulesPostMessages = [
        'nombre.required'               => 'El nombre del integrante es requerido.',
        'nombre.max'                    => 'El nombre del integrante no puede ser mayor a :max caracteres.',
        'nombre.min'                    => 'El nombre del integrante no puede ser menor a :min caracteres.', 
        'descripcion.required'          => 'La descripción del equipo es requerido',       
        'datosContacto.*.cuenta.required'   => 'El dato de contacto es requerido.',
        'imagen.required'                        => 'La imagen es requerida',
        'datosContacto.*.cuenta.max'    => 'El dato de contacto no puede ser mayor a :max caracteres.',
        'datosContacto.*.cuenta.min'    => 'El dato de contacto no puede ser menor a :min caracteres.',
    ];

    public static $rulesPut         = [
        'nombre'       => 'required|max:200|min:3',   
        'descripcion'  => 'required',
        'datosContacto.*.cuenta'  => 'exclude_if:datosContacto.*.activo,0|required|max:200|min:3'
    ]; 

    public static $rulesPutMessages = [
        'nombre.required'               => 'El nombre del integrante es requerido.',
        'nombre.max'                    => 'El nombre del integrante no puede ser mayor a :max caracteres.',
        'nombre.min'                    => 'El nombre del integrante no puede ser menor a :min caracteres.', 
        'descripcion.required'          => 'La descripción del equipo es requerido',       
        'datosContacto.*.cuenta.required'   => 'El dato de contacto es requerido.',
        'datosContacto.*.cuenta.max'    => 'El dato de contacto no puede ser mayor a :max caracteres.',
        'datosContacto.*.cuenta.min'    => 'El dato de contacto no puede ser menor a :min caracteres.',
    ];

    protected $fillable = [
        'nombre',
        'descripcion',
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

    public function equipoImagen()
    {
        return $this->hasMany('App\Models\CongresoVisibleEquipoImagen','equipo_id','id')->where('activo',1);
    }
    public function equipoDatosContacto()
    {
        return $this->hasMany('App\Models\CongresoVisibleEquipoDatosContacto','equipo_id','id')->with("datosContacto")->where('activo',1);
    }
}
