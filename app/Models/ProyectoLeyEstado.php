<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProyectoLeyEstado extends Model
{
    use HasFactory;

    protected $fillable = [
        'proyecto_ley_id',
        'estado_proyecto_ley_id',
        'fecha',
        'gaceta_texto',
        'gaceta_url',
        'nota',
        'observaciones',
        'orden',
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
    public function TipoEstado()
    {
        return $this->hasOne(EstadoProyectoLey::class, 'id', 'estado_proyecto_ley_id')->where('activo',1);
    }
    public function ProyectoLey()
    {
        return $this->hasOne(ProyectoLey::class, 'id', 'proyecto_ley_id')->with('TipoProyectoLey', 'TemaSecundario', 'TemaPrincipal', 'ProyectoLeyEstado', 'Iniciativa')->where('activo',1);
    }
    public function Comisiones()
    {
        return $this->hasMany(ProyectoLeyComision::class)->where('activo', 1)->with(['Comision']);
    }
    public function Ponentes()
    {
        return $this->hasMany(ProyectoLeyPonente::class)->where('activo', 1)
                    ->with(['Congresista']);
    }
}
