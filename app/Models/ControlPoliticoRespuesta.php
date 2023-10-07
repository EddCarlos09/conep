<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ControlPoliticoRespuesta extends Model
{
    use HasFactory;

    //Rules

    public static $rules                        = [
        'nombre'                                    => 'required',
        'archivo'                                   => 'required',
    ];

    public static $rulesPut                        = [
        'nombre'                                    => 'required'
    ];

    public static $rulesMessages = [
        'nombre.required'       => 'Ingrese el nombre del documento.',
        'archivo.required'      => 'Agregue un archivo.'
    ];

    public static $rulesPutMessages = [
        'nombre.required'       => 'Ingrese el nombre del documento.'
    ];
    
    //End rules


    //Atributes
    protected     $fillable          = [
        'nombre',
        'control_politico_id',
        'url',
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

    public function controlPolitico()
    {
        return $this->hasOne('App\Models\ControlPolitico', 'id', 'control_politico_id');
    }
    //End relations
}
