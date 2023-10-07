<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EleccionCandidato extends Model
{
    use HasFactory;

    protected $fillable = [
        'eleccion_id',
        'congresista_id',
        'comision_cargo_congresista_id',
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

    public function congresista()
    {
        return $this->hasOne('App\Models\Congresista', 'id', 'congresista_id')
        ->with("personaElecciones"); //"congresistaPerfil", "congresistaTrayectoriaPublica", "CongresistaTrayectoriaPrivada");
    }

    public function comisionCargoCongresista()
    {
        return $this->hasOne('App\Models\CargoLegislativo', 'id', 'comision_cargo_congresista_id');
    }
}
