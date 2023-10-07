<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProyectoLeyComision extends Model
{
    use HasFactory;

    protected $fillable = [
        'proyecto_ley_estado_id',
        'comision_id',
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

    public function ProyectoLeyEstado(){
        return $this->hasOne(ProyectoLeyEstado::class, 'id', 'proyecto_ley_estado_id')->where('activo', 1)-with(["ProyectoLey"]);;
    }
    public function Comision(){
        return $this->hasOne(Comision::class, 'id', 'comision_id')->where('activo',1)
                    ->with(['corporacion', 'tipoComision']);
    }
}
