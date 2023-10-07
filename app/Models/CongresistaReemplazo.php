<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongresistaReemplazo extends Model
{
    use HasFactory;

    protected     $fillable          = [
        'persona_id_reemplazado',
        'persona_id_reemplaza',
        'fecha_inicio',
        'fecha_fin',
        'partido_id',
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

    public function persona()
    {
        return $this->hasOne('App\Models\Persona', 'id', 'persona_id_reemplaza')->with("LugarNacimiento", "Imagenes", "Profesion")->where('activo',1);
    }
}
