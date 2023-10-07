<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InformesPnud extends Model
{
    use HasFactory;
    public static $rulesPost = [
        'nombre'                       => 'required|max:250|min:3'
    ];
    public static $rulesPostMessages = [
        'nombre.required'                       => 'El nombre del informe es requerido.',
        'nombre.max'                            => 'El nombre del informe no puede ser mayor a :max caracteres.',
        'nombre.min'                            => 'El nombre del informe no puede ser menor a :min caracteres.'  
    ];

    public static $rulesPut = [
        'nombre'                                => 'required|max:250|min:3'
    ];
    public static $rulesPutMessages  = [
        'nombre.required'                       => 'El nombre del informe es requerido.',
        'nombre.max'                            => 'El nombre del informe no puede ser mayor a :max caracteres.',
        'nombre.min'                            => 'El nombre del informe no puede ser menor a :min caracteres.'
    ];
    protected     $fillable   = [
        'nombre',
        'activo',
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at',
    ];
    protected     $hidden     = [
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at',
    ];

    public function documentosInforme()
    {
        return $this->hasMany('App\Models\DocumentosInforme')->where('activo',1);
    }
}
