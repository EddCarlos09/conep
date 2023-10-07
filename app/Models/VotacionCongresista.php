<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VotacionCongresista extends Model
{
    use HasFactory;

    protected     $fillable          = [
        'votacion_id',
        'congresista_id',
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

    public function congresista()
    {
        return $this->hasOne('App\Models\Congresista', 'id', 'congresista_id')->with("persona", "Partido")->where('activo',1);
    }
    public function tipoRespuestaVotacion()
    {
        return $this->hasOne('App\Models\TipoRespuestaVotacion', 'id', 'tipo_respuesta_votacion_id')->where('activo',1);
    }
}
