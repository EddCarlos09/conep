<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstadoProyectoLey extends Model
{
    use HasFactory;
    public $table = "estado_proyecto_leys";
    public static $rules = [
        'nombre' => 'required|max:50|min:3'

    ];

    public static $messages = [        
        'nombre.required' => 'El nombre es requerido.',
        'nombre.max' =>'El nombre no puede ser mayor a :max caracteres.',
        'nombre.min' => 'El nombre no puede ser menor a :min caracteres.'   
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
