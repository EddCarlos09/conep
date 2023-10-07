<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoCitacion extends Model
{
    use HasFactory;

    public static $rules = [
        'nombre' => 'required|max:100',
    ];

    public static $messages = [
        'nombre.required' => 'El nombre de la citación es requerido.',
        'nombre.max' =>'El nombre de la citación no puede ser mayor a :max caracteres.',
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
}
