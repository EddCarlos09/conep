<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CorporacionMiembro extends Model
{
    use HasFactory;

    protected $fillable = [
        'corporacion_id',
        'congresista_id',
        'corporacion_cargo_congresista_id',
        'usercreated',
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

    public function corporacion()
    {
        return $this->hasOne('App\Models\Corporacion', 'id', 'corporacion_id');
    }

    public function congresista()
    {
        return $this->hasOne('App\Models\Congresista', 'id', 'congresista_id')
        ->with("persona");
    }

    public function comisionCargoCongresista()
    {
        return $this->hasOne('App\Models\ComisionCargoCongresista', 'id', 'corporacion_cargo_congresista_id');
    }
}
