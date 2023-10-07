<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ControlPoliticoCitado extends Model
{
    use HasFactory;

    //Rules
    public static $rulesPost                        = [
        'persona_id'                        => 'required|int|min:1',
        'tipo_citacion'                     => 'required|int|min:1',
        'asistencia'                        => 'required|int|min:1',
    ];

    public static $rulesPostMessages = [
        'persona_id.min'                    => 'Debe seleccionar una persona.',
        'tipo_citacion.min'                 => 'Debe seleccionar un tipo de citación.',
        'asistencia.min'                    => 'Debe indicar la asistencia.',

    ];

    public static $rulesPut                        = [
        'nombre'                            => 'required|max:200|min:3',
        'comision_cargo_congresista_id'     => 'required|int|min:1',
        'tipo_citacion_id'                  => 'required|int|min:1'
    ];

    public static $rulesPutMessages = [
        'nombre.required'                   => 'El nombre del citado es requerido.',
        'nombre.max'                        => 'El nombre del citado no puede ser mayor a :max caracteres.',
        'nombre.min'                        => 'El nombre del citado no puede ser menor a :min caracteres.',
        'comision_cargo_congresista_id.min' => 'Debe seleccionar un cargo para el citado.',
        'tipo_citacion_id.min'              => 'Debe seleccionar un tipo de citación'

    ];
    //End rules


    //Atributes
    protected     $fillable          = [
        'control_politico_id',
        'persona_id',
        'tipo_citacion',
        'asistencia',
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
    
    public function persona()
    {
        return $this->hasOne('App\Models\Persona', 'id', 'persona_id')
        ->with("Imagenes");
    }
    // public function tipoCitacion()
    // {
    //     return $this->hasOne('App\Models\TipoCitacion', 'id', 'tipo_citacion_id');
    // }

    // public function controlPoliticoCitadoImagenes()
    // {
    //     return $this->hasMany('App\Models\ControlPoliticoCitadoImagen','citado_id','id')->where(
    //         'activo',
    //         1
    //     );
    // }
    //End relations
}
