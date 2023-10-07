<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ControlPolitico extends Model
{
    use HasFactory;

    //Rules
    public static $rules                        = [
        'titulo'                                    => 'required|max:200|min:3',
        'fecha'                                     => 'required',
        'cuatrienio_id'                             => 'required|int|min:1',
        'legislatura_id'                            => 'required|int|min:1',
        'estado_control_politico_id'                => 'required|int|min:1',
        'tema_id_principal'                         => 'required|int|min:1',
    ];

    public static $rulesMessages = [
        'titulo.required'                   => 'El título del control político es requerido.',
        'titulo.max'                        => 'El titulo del control político no puede ser mayor a :max caracteres.',
        'titulo.min'                        => 'El titulo del control político no puede ser menor a :min caracteres.',
        'fecha.required'                    => 'La fecha es requerida.',
        'cuatrienio_id.min'                 => 'Debe seleccionar un cuatrienio.',
        'legislatura_id.min'                => 'Debe seleccionar una legislatura.',
        'estado_control_politico_id.min'    => 'Debe seleccionar un estado para el control político.',
        'tema_id_principal.min'             => 'Debe seleccionar un tema principal para el control político.'
    ];

    //End rules


    //Atributes
    protected     $fillable          = [
        'titulo',
        'legislatura_id',
        'cuatrienio_id',
        'estado_control_politico_id',
        'tema_id_principal',
        'tema_id_secundario',
        'comision_id',
        'corporacion_id',
        'fecha',
        'plenaria',
        'tags',
        'detalles',
        'numero_proposicion',
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
    public function legislatura(){
        return $this->hasOne('App\Models\Legislatura', 'id', 'legislatura_id')->where(
            'activo',1
        );
    }

    public function cuatrienio(){
        return $this->hasOne('App\Models\Cuatrienio', 'id', 'cuatrienio_id')->where(
            'activo',1
        );
    }

    public function estadoControlPolitico(){
        return $this->hasOne('App\Models\EstadoControlPolitico', 'id', 'estado_control_politico_id')->where(
            'activo',1
        );
    }

    public function temaPrincipalControlPolitico(){
        return $this->hasOne('App\Models\TemaControlPolitico', 'id', 'tema_id_principal')->where(
            'activo',1
        );
    }
    public function temaSecundarioControlPolitico(){
        return $this->hasOne('App\Models\TemaControlPolitico', 'id', 'tema_id_secundario')->where(
            'activo',1
        );
    }

    public function comision(){
        return $this->hasOne('App\Models\Comision', 'id', 'comision_id')->where(
            'activo',1
        );
    }
    
    public function corporacion(){
        return $this->hasOne('App\Models\Corporacion', 'id', 'corporacion_id')->where(
            'activo',1
        );
    }

    public function controlPoliticoProposiciones()
    {
        return $this->hasMany('App\Models\ControlPoliticoProposicion')->where(
            'activo',
            1
        );
    }

    public function controlPoliticoCitantes()
    {
        return $this->hasMany('App\Models\ControlPoliticoCitante')
        ->with("congresista")->where(
            'activo',
            1
        );
    }

    public function controlPoliticoCitados()
    {
        return $this->hasMany('App\Models\ControlPoliticoCitado')
        ->with('persona')
        ->where(
            'activo',
            1
        );
    }

    
    public function controlPoliticoRespuestas()
    {
        return $this->hasMany('App\Models\ControlPoliticoRespuesta')
        ->where(
            'activo',
            1
        );
    }

    public function controlPoliticoDocumentos()
    {
        return $this->hasMany('App\Models\ControlPoliticoDocumento')
        ->where(
            'activo',
            1
        );
    }

    public function controlPoliticoTags()
    {
        return $this->hasMany('App\Models\ControlPoliticoTag')
        ->with('glosarioLegislativo')
        ->where(
            'activo',
            1
        );
    }
    //End relations
}
