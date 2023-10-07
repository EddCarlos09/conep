<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cuatrienio extends Model
{
    use HasFactory;

    public static $rules = [
        'fechaInicio' => 'required|before_or_equal:fechaFin',
        'fechaFin' => 'required|after_or_equal:fechaInicio'

    ];
    public static $messages = [
        'fechaInicio.required' => 'La fecha inicio es requerida.',
        'fechaFin.required' => 'La fecha fin es requerida.',
        'fechaFin.after_or_equal' => 'La fecha fin debe ser mayor a fecha Inicio.',
        'fechaInicio.before_or_equal' => 'La fecha Inicio debe ser menor a fecha Fin.'

    ];
    public $table = "cuatrienios";
    protected $fillable = [
        'nombre',
        'fechaInicio',
        'fechaFin',
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
