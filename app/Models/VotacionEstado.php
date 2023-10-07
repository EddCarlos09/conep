<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VotacionEstado extends Model
{
    use HasFactory;

    protected     $fillable          = [
        'votacion_id',
        'proyecto_ley_estado_id',
        'activo',
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];

    protected     $hidden            = [
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];
    public function Estado()
    {
        return $this->hasOne('App\Models\ProyectoLeyEstado', 'id', 'proyecto_ley_estado_id')->with('TipoEstado')->where('activo',1);
    }
}
