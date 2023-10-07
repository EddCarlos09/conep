<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CargoCamara extends Model
{
    use HasFactory;

    protected $fillable = [
        'cuatrienio_id',
        'corporacion_id',
        'congresista_id',
        'cargo_legislativo_id',
        'fecha_inicio',
        'fecha_final',
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

    public function cuatrienio()
    {
        return $this->hasOne('App\Models\Cuatrienio', 'id', 'cuatrienio_id')->where('activo',1);
    }

    public function corporacion()
    {
        return $this->hasOne('App\Models\Corporacion', 'id', 'corporacion_id')->where('activo',1);
    }

    public function congresista()
    {
        return $this->hasOne('App\Models\Congresista', 'id', 'congresista_id')->where('activo',1);
    }

    public function cargo()
    {
        return $this->hasOne('App\Models\CargoLegislativo', 'id', 'cargo_legislativo_id')->where('activo',1);
    }
}
