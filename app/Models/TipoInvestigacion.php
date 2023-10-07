<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoInvestigacion extends Model
{
    use HasFactory;

    public static $rules = [
        'nombre' => 'required|max:500',
    ];

    public static $messages = [
        'nombre.required' => 'El nombre del tipo de investigación es requerido.',
        'nombre.max' =>'El nombre de la investigación no puede ser mayor a :max caracteres.',
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
