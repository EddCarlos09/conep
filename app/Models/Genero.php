<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Genero extends Model
{
    use HasFactory;

    public static $rulesPost = [
        'nombre' => 'required|max:100',
        'imagen'=>'required'
    ];

    public static $messagesPost = [
        'nombre.required' => 'El nombre es requerido.',
        'nombre.max' =>'El nombre no puede ser mayor a :max caracteres.',
        'imagen.required' => 'La imagen es requerida',
    ];

    public static $rulesPut = [
        'nombre' => 'required|max:100',
    ];

    public static $messagesPut = [
        'nombre.required' => 'El nombre es requerido.',
        'nombre.max' =>'El nombre no puede ser mayor a :max caracteres.',
    ];

    protected $fillable = [
        'nombre',
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

    public function generoImagen()
    {
        return $this->hasMany('App\Models\GeneroImagen')->where('activo', 1);
    }
}
