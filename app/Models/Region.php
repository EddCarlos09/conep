<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    use HasFactory;
    public static $rulesPost = ['nombre' => 'required|max:50|min:3',];

    public static $rulesPostMessages = [
        'nombre.required' => 'El nombre de la región es requerido.',
        'nombre.max' => 'El nombre de la región no puede ser mayor a :max caracteres.',
        'nombre.min' => 'El nombre de la región no puede ser menor a :min caracteres.',
    ];

    public static $rulesPut = ['nombre' => 'required|max:50|min:3',];

    public static $rulesPutMessages = [
        'nombre.required' => 'El nombre de la región es requerido.',
        'nombre.max' => 'El nombre de la región no puede ser mayor a :max caracteres.',
        'nombre.min' => 'El nombre de la región no puede ser menor a :min caracteres.',
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
