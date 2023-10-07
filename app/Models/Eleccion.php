<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Eleccion extends Model
{
    use HasFactory;

    public static $rulesPost                        = [
        'titulo'                                    => 'required|max:200|min:3',
        'fechaDeEleccion'                           => 'required',
        'infoGeneral'                               => 'required|min:1',
        'tipo_comision_id'                          => 'required|int|min:1',
        'comision_id'                               => 'required|int|min:1',
        'corporacion_id'                            => 'required|int|min:1',
        'cuatrienio_id'                             => 'required|int|min:1',
        'congresista_id'                            => 'required|int|min:1',
        'resultadoVotacion'                         => 'required',
        'comision_cargo_congresista_id'             => 'required|int|min:1',
    ];
    public static $rulesPostMessages = [
        'titulo.required'                   => 'El título de la elección es requerido.',
        'titulo.max'                        => 'El título de la elección no puede ser mayor a :max caracteres.',
        'titulo.min'                        => 'El título de la elección no puede ser menor a :min caracteres.',
        'infoGeneral.required'              => 'La descripción es requerida.',
        'infoGeneral.max'                   => 'La descripción de la elección no puede ser mayor a :max caracteres.',
        'infoGeneral.min'                   => 'La descripción de la elección no puede ser menor a :min caracteres.',
        'fechaDeEleccion.required'          => 'La fecha de elección es requerida.',
        'tipo_comision_id.min'              => 'Debe seleccionar un tipo de comisión.',
        'comision_id.min'                   => 'Debe seleccionar una comisión.',
        'corporacion_id.min'                => 'Debe seleccionar un tipo de corporacion.',
        'cuatrienio_id.min'                 => 'Debe seleccionar un cuatrienio.',
        'comision_cargo_congresista_id.min' => 'Debe seleccionar un cargo.',
        'comision_miembro_id.min'           => 'Debe seleccionar un funcionario.',
    ];

    public static $rulesPut         = [
        'titulo'                                    => 'required|max:200|min:3',
        'fechaDeEleccion'                           => 'required',
        'infoGeneral'                               => 'required|min:1',
        'tipo_comision_id'                          => 'required|int|min:1',
        'comision_id'                               => 'required|int|min:1',
        'corporacion_id'                            => 'required|int|min:1',
        'cuatrienio_id'                             => 'required|int|min:1',
        'comision_miembro_id'                       => 'required|int|min:1',
        'resultadoVotacion'                         => 'required',
        'comision_cargo_congresista_id'             => 'required|int|min:1',
    ];
    public static $rulesPutMessages = [
        'titulo.required'                   => 'El título de la elección es requerido.',
        'titulo.max'                        => 'El título de la elección no puede ser mayor a :max caracteres.',
        'titulo.min'                        => 'El título de la elección no puede ser menor a :min caracteres.',
        'fechaDeEleccion.required'          => 'La fecha de elección es requerida.',
        'infoGeneral.required'              => 'La descripción es requerida.',
        'infoGeneral.max'                   => 'La descripción de la elección no puede ser mayor a :max caracteres.',
        'infoGeneral.min'                   => 'La descripción de la elección no puede ser menor a :min caracteres.',
        'tipo_comision_id.min'              => 'Debe seleccionar un tipo de comisión.',
        'comision_id.min'                   => 'Debe seleccionar una comisión.',
        'corporacion_id.min'                => 'Debe seleccionar un tipo de corporacion.',
        'cuatrienio_id.min'                 => 'Debe seleccionar un cuatrienio.',
        'comision_cargo_congresista_id.min' => 'Debe seleccionar un cargo.',
        'comision_miembro_id.min'           => 'Debe seleccionar un funcionario.',
    ];

    protected $fillable = [
        'titulo',
        'cuatrienio_id',
        'corporacion_id',
        'tipo_comision_id',
        'comision_id',
        'infoGeneral',
        'comision_cargo_congresista_id',
        'comision_miembro_id',
        'fechaDeEleccion',
        'resultadoVotacion',
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

    public function corporacion(){
        return $this->hasOne('App\Models\Corporacion', 'id', 'corporacion_id')
        ->where(
            'activo',1
        );
    }

    public function tipoComision(){
        return $this->hasOne('App\Models\TipoComision', 'id', 'tipo_comision_id')
        ->where(
            'activo',1
        );
    }

    public function cuatrienio(){
        return $this->hasOne('App\Models\Cuatrienio', 'id', 'cuatrienio_id')
        ->where(
            'activo',1
        );
    }

    public function comision(){
        return $this->hasOne('App\Models\Comision', 'id', 'comision_id')
        ->where(
            'activo',1
        );
    }

    public function funcionarioActual(){
        return $this->hasOne('App\Models\ComisionMiembro', 'id', 'comision_miembro_id')
        ->with("congresistaElecciones", "comisionCargoCongresista")
        ->where(
            'activo',1
        );
    }
    public function cargoProveer(){
        return $this->hasOne('App\Models\CargoLegislativo', 'id', 'comision_cargo_congresista_id')
        ->where(
            'activo',1
        );
    }

    public function candidato()
    {
        return $this->hasMany('App\Models\EleccionCandidato')
        ->with("congresista", "comisionCargoCongresista")
        ->where(
            'activo',
            1
        );
    }
}
