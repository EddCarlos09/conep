<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Circunscripcion extends Model
{
    use HasFactory;

    public static $rulesPost = ['nombre' => 'required|max:50|min:3',];
    public static $rulesPostMessages = [
        'nombre.required' => 'El nombre del grupo de edad es requerido.',
        'nombre.max' => 'El nombre del grupo de edad no puede ser mayor a :max caracteres.',
        'nombre.min' => 'El nombre del grupo de edad no puede ser menor a :min caracteres.',
    ];
    public static $rulesPut = ['nombre' => 'required|max:50|min:3',];
    public static $rulesPutMessages = [
        'nombre.required' => 'El nombre del grupo de edad es requerido.',
        'nombre.max' => 'El nombre del grupo de edad no puede ser mayor a :max caracteres.',
        'nombre.min' => 'El nombre del grupo de edad no puede ser menor a :min caracteres.',
    ];
    protected $fillable = [
        'nombre',
        'departamento_id',
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

    public function departamento()
    {
        return $this->hasOne('App\Models\Departamento', 'id', 'departamento_id');
    }
}
