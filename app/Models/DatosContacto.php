<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DatosContacto extends Model
{
    use HasFactory;

    public static $rulesPost = [
        'nombre' => 'required|max:200|min:3',
        'tipo' => 'required|int|min:1',
        'imagen' => 'required'
    ];
    public static $messagesPost = [
        'nombre.required'   => 'El nombre es requerido.',
        'nombre.max'        => 'El nombre no puede ser mayor a :max caracteres.',
        'nombre.min'        => 'El nombre no puede ser menor a :min caracteres.',
        'nombre.required'   => 'El tipo de dato es requerido',
        'nombre.min'        => 'El tipo de dato es requerido',
        'imagen.required'   => 'La imagen es requerida'
    ];
    public static $rulesPut = [
        'nombre' => 'required|max:200|min:3',
        'tipo' => 'required|int|min:1',
    ];
    public static $messagesPut = [
        'nombre.required'   => 'El nombre es requerido.',
        'nombre.max'        => 'El nombre no puede ser mayor a :max caracteres.',
        'nombre.min'        => 'El nombre no puede ser menor a :min caracteres.',
        'nombre.required'   => 'El tipo de dato es requerido',
        'nombre.min'        => 'El tipo de dato es requerido',
    ];
    protected $fillable = [
        'nombre',
        'tipo',
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

    public function datosContactoImagen()
    {
        return $this->hasMany('App\Models\DatosContactoImagen')->where('activo', 1);
    }
}
