<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Votacion extends Model
{
    use HasFactory;

    public static $rulesPost         = [
        'fecha' => 'required',
        'legislatura_id' => 'required|int|min:1',
        'cuatrienio_id' => 'required|int|min:1',
        'esComision' => 'exclude_if:esPlenaria,true|exclude_if:esComision,true|required|boolean',
        'motivo' => 'required|max:150|min:3',
        'tipo_votacion_id' => 'required|int|min:1',
        'clase_votacion_id' => 'required|int|min:1',
        'acta' => 'required|max:50|min:3',
        'votosFavor' => 'exclude_if:voto_general,false|int|min:0',
        'votosContra' => 'exclude_if:voto_general,false|int|min:0',
        'aprobada' => 'exclude_if:voto_general,false|int|min:0',
        'votosAbstencion' => 'exclude_if:voto_general,false|int|min:0',
        'numero_no_asistencias' => 'exclude_if:voto_general,false|int|min:0',
        'numero_asistencias' => 'exclude_if:voto_general,false|int|min:0',
    ];
    public static $rulesPostMessages = [
        'fecha.required' => 'La fecha es requerida',
        'legislatura_id.min' => 'Debe seleccionar una legislatura',
        'cuatrienio_id.min' => 'Debe seleccionar un cuatrienio',
        'esComision.boolean' => 'Debe seleccionar si es plenaria o comisión',

        'motivo.required' => 'El motivo es requerido',
        'motivo.min' => 'El motivo debe ser de mínimo :min caracteres',
        'motivo.max' => 'El motivo debe ser de máximo :max caracteres',

        'tipo_votacion_id.min' => 'Debe seleccionar un tipo de votación',
        'clase_votacion_id.min' => 'Debe seleccionar una clase de votación',

        'acta.required' => 'El acta es requerido',
        'acta.max' => 'El acta debe ser de máximo :max caracteres',
        'acta.min' => 'El acta debe ser de mínimo :min caracteres',

        'votosFavor.min' => 'Debe ingresar votos a favor',
        'votosContra.min' => 'Debe ingresar votos en contra',
        'aprobada.min' => 'Debe ingresar cantidad de aprobadas',
        'votosAbstencion.min' => 'Debe insertar cantidad de votos abstenidos',
        'numero_no_asistencias.min' => 'Debe insertar número de no asistencias',
        'numero_asistencias.min' => 'Debe insertar número de asistencias',
    ];
    
    public static $rulesPostPlenaria = [
        'corporacion_id' => 'required|int|min:1'
    ];

    public static $messagesPostPlenaria = [
        'corporacion_id.min' => 'Debe seleccionar una corporación',
    ];

    public static $rulesPostComision = [
        'corporacion_id' => 'required|int|min:1',
        'tipo_comision_id' => 'required|int|min:1',
        'comision_id' => 'required|int|min:1'
    ];

    public static $messagesPostComision = [
        'corporacion_id.min' => 'Debe seleccionar una corporación',
        'tipo_comision_id.min' => 'Debe seleccionar un tipo de comisión',
        'comision_id.min' => 'Debe seleccionar una comisión'
    ];

    // put
    public static $rulesPut         = [
        'fecha' => 'required',
        'legislatura_id' => 'required|int|min:1',
        'cuatrienio_id' => 'required|int|min:1',
        'esComision' => 'exclude_if:esPlenaria,true|exclude_if:esComision,true|required|boolean',
        'motivo' => 'required|max:150|min:3',
        'tipo_votacion_id' => 'required|int|min:1',
        'clase_votacion_id' => 'required|int|min:1',
        'acta' => 'required|max:50|min:3',
        'votosFavor' => 'exclude_if:voto_general,false|int|min:0',
        'votosContra' => 'exclude_if:voto_general,false|int|min:0',
        'aprobada' => 'exclude_if:voto_general,false|int|min:0',
        'votosAbstencion' => 'exclude_if:voto_general,false|int|min:0',
        'numero_no_asistencias' => 'exclude_if:voto_general,false|int|min:0',
        'numero_asistencias' => 'exclude_if:voto_general,false|int|min:0',
    ];
    public static $rulesPutMessages = [
        'fecha.required' => 'La fecha es requerida',
        'legislatura_id.min' => 'Debe seleccionar una legislatura',
        'cuatrienio_id.min' => 'Debe seleccionar un cuatrienio',
        'esComision.boolean' => 'Debe seleccionar si es plenaria o comisión',

        'motivo.required' => 'El motivo es requerido',
        'motivo.min' => 'El motivo debe ser de mínimo :min caracteres',
        'motivo.max' => 'El motivo debe ser de máximo :max caracteres',

        'tipo_votacion_id.min' => 'Debe seleccionar un tipo de votación',
        'clase_votacion_id.min' => 'Debe seleccionar una clase de votación',

        'acta.required' => 'El acta es requerido',
        'acta.max' => 'El acta debe ser de máximo :max caracteres',
        'acta.min' => 'El acta debe ser de mínimo :min caracteres',

        'votosFavor.min' => 'Debe ingresar votos a favor',
        'votosContra.min' => 'Debe ingresar votos en contra',
        'aprobada.min' => 'Debe ingresar cantidad de aprobadas',
        'votosAbstencion.min' => 'Debe insertar cantidad de votos abstenidos',
        'numero_no_asistencias.min' => 'Debe insertar número de no asistencias',
        'numero_asistencias.min' => 'Debe insertar número de asistencias',

    ];
    
    public static $rulesPutPlenaria = [
        'corporacion_id' => 'required|int|min:1'
    ];

    public static $messagesPutPlenaria = [
        'corporacion_id.min' => 'Debe seleccionar una corporación',
    ];

    public static $rulesPutComision = [
        'corporacion_id' => 'required|int|min:1',
        'tipo_comision_id' => 'required|int|min:1',
        'comision_id' => 'required|int|min:1'
    ];

    public static $messagesPutComision = [
        'corporacion_id.min' => 'Debe seleccionar una corporación',
        'tipo_comision_id.min' => 'Debe seleccionar un tipo de comisión',
        'comision_id.min' => 'Debe seleccionar una comisión'
    ];
    // public static $rulesVotacionesPut = [
    //     'votacion_congresista.*.tipo_respuesta_votacion_id' => 'required|int|min:1',
    // ];

    // public static $rulesVotacionesPutMessages = [
    //     'votacion_congresista.*.tipo_respuesta_votacion_id.min' => 'Debe seleccionar un voto'
    // ];
    



    protected     $fillable          = [
        'fecha',
        'legislatura_id',
        'cuatrienio_id',
        'proyecto_de_ley_id',
        'esPlenaria',
        'esComision',
        'urlGaceta',
        'motivo',
        'tipo_votacion_id',
        'votosFavor',
        'votosContra',
        'acta',
        'observaciones',
        'aprobada',
        'votosAbstencion',
        'numero_no_asistencias',
        'clase_votacion_id',
        'numero_asistencias',
        'voto_general',
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
    public function VotacionEstado()
    {
        return $this->hasOne('App\Models\VotacionEstado', 'votacion_id', 'id')->with('Estado')->where('activo',1);
    }
    public function tipoVotacion()
    {
        return $this->hasOne('App\Models\TipoVotacion', 'id', 'tipo_votacion_id')->where('activo',1);
    }
    public function claseVotacion()
    {
        return $this->hasOne('App\Models\ClaseVotacion', 'id', 'clase_votacion_id')->where('activo',1);
    }
    public function legislatura()
    {
        return $this->hasOne('App\Models\Legislatura', 'id', 'legislatura_id')->where('activo',1);
    }
    public function proyectoDeLey()
    {
        return $this->hasOne('App\Models\ProyectoLey', 'id', 'proyecto_de_ley_id')->where('activo',1);
    }
    public function cuatrienio()
    {
        return $this->hasOne('App\Models\Cuatrienio', 'id', 'cuatrienio_id')->where('activo',1);
    }
    public function votacionPlenaria()
    {
        return $this->hasOne('App\Models\VotacionPlenaria')->with("corporacion")->where('activo',1);
    }
    public function votacionComision()
    {
        return $this->hasOne('App\Models\VotacionComision')->with("corporacion", "tipoComision", "comision")->where('activo',1);
    }
    public function votacionCongresista()
    {
        return $this->hasMany('App\Models\VotacionCongresista')->with("congresista", "tipoRespuestaVotacion")->where('activo',1);
    }
}
