<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProyectoLeyAutor extends Model
{
    use HasFactory;
    protected $fillable = [
        'proyecto_ley_id',
        'persona_id',
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

    public function Persona(){
        return $this->hasOne(Persona::class, 'id', 'persona_id')->with(['Imagenes', 'LugarNacimiento']);
    }

    public function proyectoLey(){
        return $this->hasOne(ProyectoLey::class, 'id', 'proyecto_ley_id')->with(["ProyectoLeyEstado", "TemaPrincipal", "TemaSecundario", "TipoProyectoLey", "Iniciativa"]);
    }
}
