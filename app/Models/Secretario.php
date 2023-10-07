<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Secretario extends Model
{
    use HasFactory;

    public static $rulesPost = [
        'nombre' => 'required|max:50|min:3',
        'genero_id' => 'required|int|min:1',
        'fechaNacimiento' => 'required',
        'lugarNacimiento' => 'required',
        'imagen' => 'required',
        'datosContacto.*.cuenta' => 'exclude_if:datosContacto.*.activo,0|required|max:200|min:3'
    ];
    public static $messagesPost = [
        'nombre.required' => 'El nombre del secretario es requerido.',
        'nombre.max' =>'El nombre del secretario no puede ser mayor a :max caracteres.',
        'nombre.min' => 'El nombre del secretario no puede ser menor a :min caracteres.',
        'genero_id.min' => 'Debe seleccionar un género',
        'fechaNacimiento.required' => 'La fecha de nacimiento es requerida',
        'lugarNacimiento.required' => 'El lugar de nacimiento es requerido',
        'imagen.required'                 => 'La imagen es requerida',
        'datosContacto.*.cuenta.required' => 'El dato de contacto es requerido.',
        'datosContacto.*.cuenta.max'      => 'El dato de contacto no puede ser mayor a :max caracteres.',
        'datosContacto.*.cuenta.min'      => 'El dato de contacto no puede ser menor a :min caracteres.'
    ];
    public static $rulesPut = [
        'nombre' => 'required|max:50|min:3',
        'genero_id' => 'required|int|min:1',
        'fechaNacimiento' => 'required',
        'lugarNacimiento' => 'required',
        'datosContacto.*.cuenta' => 'exclude_if:datosContacto.*.activo,0|required|max:200|min:3'
    ];
    public static $messagesPut = [
        'nombre.required' => 'El nombre del secretario es requerido.',
        'nombre.max' =>'El nombre del secretario no puede ser mayor a :max caracteres.',
        'nombre.min' => 'El nombre del secretario no puede ser menor a :min caracteres.',
        'genero_id.min' => 'Debe seleccionar un género',
        'fechaNacimiento.required' => 'La fecha de nacimiento es requerida',
        'lugarNacimiento.required' => 'El lugar de nacimiento es requerido',
        'datosContacto.*.cuenta.required' => 'El dato de contacto es requerido.',
        'datosContacto.*.cuenta.max'      => 'El dato de contacto no puede ser mayor a :max caracteres.',
        'datosContacto.*.cuenta.min'      => 'El dato de contacto no puede ser menor a :min caracteres.'
    ];

    protected     $fillable          = [
        'nombre',
        'genero_id',
        'fechaNacimiento',
        'lugarNacimiento',
        'activo',
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];
    protected     $hidden            = [
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];
    
    public function secretarioDatosContacto()
    {
        return $this->hasMany('App\Models\SecretarioDatosContacto')->with("datosContacto")->where('activo',1);
    }
    public function secretarioImagen()
    {
        return $this->hasMany('App\Models\SecretarioImagen')->where('activo',1);
    }
}
