<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoFechaProyectoLey extends Model
{
    use HasFactory;
    public $table = "tipo_fecha_proyecto_leys";
    public static $rules = [
        'nombre' => 'required|max:100|min:3',
        'corporacion_id' => 'required'
    ];

    public static $messages = [        
        'nombre.required' => 'El nombre es requerido.',
        'nombre.max' =>'El nombre no puede ser mayor a :max caracteres.',
        'nombre.min' => 'El nombre no puede ser menor a :min caracteres.',
        'corporacion_id.required' => 'El tipo corporacion es requerido.'
        
    ];
    
    protected $fillable = [
        'nombre',
        'corporacion_id',        
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
