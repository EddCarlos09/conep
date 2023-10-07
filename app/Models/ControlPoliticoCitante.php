<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ControlPoliticoCitante extends Model
{
    use HasFactory;

    //Rules
    public static $rules = [
        'congresista_id'            => 'required|int|min:1',
    ];

    public static $rulesMessages = [
        'congresista_id.min'        => 'Seleccione un congresista.'
    ];
    //End rules


    //Atributes
    protected     $fillable          = [
        'control_politico_id',
        'congresista_id',
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
        return $this->hasOne('App\Models\ControlPolitico', 'id', 'control_politico_id')->with("estadoControlPolitico", "comision");
    }
    public function congresista()
    {
        return $this->hasOne('App\Models\Congresista', 'id', 'congresista_id')
        ->with("persona", "partido");
    }
    //End relations
}
