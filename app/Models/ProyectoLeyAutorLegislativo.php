<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProyectoLeyAutorLegislativo extends Model
{
    use HasFactory;



    public function Congresista(){
        return $this->hasOne(Congresista::class, 'id', 'congresista_id')
            ->with('persona', 'corporacion', 'partido');
    }

    public function Proyecto(){
        return $this->hasOne(ProyectoLey::class, 'id', 'proyecto_ley_id')
            ->with('TipoProyectoLey', 'TemaSecundario', 'TemaPrincipal', 'ProyectoLeyEstado', 'Iniciativa');
    }
}
