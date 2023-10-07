<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GlosarioLegislativo extends Model
{
    use HasFactory;
    public static $rulesPost = ['palabra' => 'required|max:50|min:3','concepto' => 'required|max:65535|min:3'];
    public static $rulesPostMessages = [
        'palabra.required' => 'La palabra es requerido.',
        'palabra.max' => 'La palabra no puede ser mayor a :max caracteres.',
        'palabra.min' => 'La palabra no puede ser menor a :min caracteres.',

        'concepto.required' => 'El concepto es requerido.',
        'concepto.max' => 'El concepto no puede ser mayor a :max caracteres.',
        'concepto.min' => 'El concepto no puede ser menor a :min caracteres.',
    ];
    public static $rulesPut = ['palabra' => 'required|max:50|min:3','concepto' => 'required|max:65535|min:3'];
    public static $rulesPutMessages = [
        'palabra.required' => 'La palabra es requerido.',
        'palabra.max' => 'La palabra no puede ser mayor a :max caracteres.',
        'palabra.min' => 'La palabra no puede ser menor a :min caracteres.',

        'concepto.required' => 'El concepto es requerido.',
        'concepto.max' => 'El concepto no puede ser mayor a :max caracteres.',
        'concepto.min' => 'El concepto no puede ser menor a :min caracteres.',
    ];
    protected $fillable = [
        'palabra',
        'concepto',
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
