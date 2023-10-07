<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComisionSecretario extends Model
{
    use HasFactory;

    protected $fillable = [
        'comision_id',
        'persona_id',
        'fecha_inicio',
        'fecha_final',
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

    public function comision()
    {
        return $this->hasOne('App\Models\Comision', 'id', 'comision_id');
    }

    public function persona()
    {
        return $this->hasOne('App\Models\Persona', 'id', 'persona_id')
        ->with("Imagenes");
    }
}
