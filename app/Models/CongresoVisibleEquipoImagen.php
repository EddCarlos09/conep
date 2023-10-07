<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongresoVisibleEquipoImagen extends Model
{
    use HasFactory;
    protected $fillable = [
        'equipo_id',
        'imagen',
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

    public function Equipo()
    {
        return $this->hasOne('App\Models\CongresoVisibleEquipo', 'id', 'equipo_id');
    }
}
