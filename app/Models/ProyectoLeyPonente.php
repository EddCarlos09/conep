<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProyectoLeyPonente extends Model
{
    use HasFactory;

    protected $fillable = [
        'proyecto_ley_estado_id',
        'congresista_id',
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


    public function Congresista(){
        return $this->hasOne(Congresista::class, 'id', 'congresista_id')
                    ->with(["corporacion", "partido", 'persona']);
    }
    public function TipoPublicacionProyectoLey(){
        return $this->hasOne(TipoPublicacionProyectoLey::class, 'id', 'tipo_publicacion_proyecto_ley_id');
    }

    public function estadoProyectoLey(){
        return $this->hasOne(ProyectoLeyEstado::class, 'id', 'proyecto_ley_estado_id')->with('ProyectoLey');
    }
}
