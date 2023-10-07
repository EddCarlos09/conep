<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VotacionProyectoLey extends Model
{
    use HasFactory;

    protected     $fillable          = [
        'votacion_id',
        'proyecto_ley_id',
        'tipo_respuesta_votacion_id',
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

    public function proyectoLey()
    {
        return $this->hasOne('App\Models\ProyectoLey', 'id', 'proyecto_ley_id')->where('activo',1);
    }
    public function tipoRespuestaVotacion()
    {
        return $this->hasOne('App\Models\TipoRespuestaVotacion', 'id', 'tipo_respuesta_votacion_id')->where('activo',1);
    }
}
