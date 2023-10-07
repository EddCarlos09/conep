<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ControlPoliticoCitadoImagen extends Model
{
    use HasFactory;

    //Rules

    //End rules


    //Atributes
    protected     $fillable          = [
        'citado_id',
        'imagen',
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

    //End atributes

    //Relations

    public function controlPoliticoCitado()
    {
        return $this->hasOne('App\Models\ControlPoliticoCitado', 'id', 'citado_id');
    }
    
    //End relations
}
