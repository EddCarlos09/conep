<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Congresista extends Model
{
    use HasFactory;

    public static $rulesPost = [
        'persona_id'         => 'required|int|min:1',
        'corporacion_id'     => 'required|int|min:1',
        'cuatrienio_id'      => 'required|int|min:1',
        'partido_id'         => 'required|int|min:1',
        'curul_id'           => 'required|int|min:1',
        'circunscripcion_id' => 'required|int|min:1'
    ];

    public static $messagesPost = [
        'persona_id.min' => 'Debe seleccionar una persona',
        'corporacion_id.min' => 'Debe seleccionar un tipo de corporación',
        'cuatrienio_id.min' => 'Debe seleccionar un cuatrienio',
        'partido_id.min' => 'Debe seleccionar un partido',
        'curul_id.min' => 'Debe seleccionar un curul',
        'circunscripcion_id.min' => 'Debe seleccionar una circunscripción'
    ];

    public static $rulesPut = [
        'persona_id' => 'required|int|min:1',
        'corporacion_id' => 'required|int|min:1',
        'cuatrienio_id' => 'required|int|min:1',
        'partido_id' => 'required|int|min:1',
        'curul_id' => 'required|int|min:1',
        'circunscripcion_id' => 'required|int|min:1'
    ];

    public static $messagesPut = [
        'persona_id.min' => 'Debe seleccionar una persona',
        'corporacion_id.min' => 'Debe seleccionar un tipo de corporación',
        'cuatrienio_id.min' => 'Debe seleccionar un cuatrienio',
        'partido_id.min' => 'Debe seleccionar un partido',
        'curul_id.min' => 'Debe seleccionar un curul',
        'circunscripcion_id.min' => 'Debe seleccionar una circunscripción'
    ];

    protected     $fillable          = [
        'persona_id',
        'corporacion_id',
        'cuatrienio_id',
        'departamento_id_mayor_votacion',
        'partido_id',
        'urlHojaVida',
        'curul_id',
        'circunscripcion_id',
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
    public function reemplazo()
    {
        return $this->hasOne('App\Models\CongresistaReemplazo', 'persona_id_reemplazado', 'persona_id')->with("persona")->where('activo',1);
    }
    public function departamento()
    {
        return $this->hasOne('App\Models\Departamento', 'id', 'departamento_id_mayor_votacion')->where('activo',1);
    }
    public function persona()
    {
        return $this->hasOne('App\Models\Persona', 'id', 'persona_id')->with("LugarNacimiento", "Imagenes", "Profesion", 'GradoEstudio', 'Genero', 'PersonaTrayectoriaPublica','PersonaTrayectoriaPrivada', 'Contactos')->where('activo',1);
    }
    public function personaElecciones()
    {
        return $this->hasOne('App\Models\Persona', 'id', 'persona_id')->with("PersonaTrayectoriaPublica", "PersonaTrayectoriaPrivada", "Profesion", "GradoEstudio", "Imagenes")->where('activo',1);
    }
    public function corporacion()
    {
        return $this->hasOne('App\Models\Corporacion', 'id', 'corporacion_id')->where('activo',1);
    }
    public function cuatrienio()
    {
        return $this->hasOne('App\Models\Cuatrienio', 'id', 'cuatrienio_id')->where('activo',1);
    }
    public function partido()
    {
        return $this->hasOne('App\Models\Partido', 'id', 'partido_id')->with("partidoImagen")->where('activo',1);
    }
    public function investigaciones()
    {
        return $this->hasMany('App\Models\Investigacion')->with("tipoInvestigacion")->where('activo',1);
    }
    public function cargo()
    {
        return $this->hasOne('App\Models\CargoCamara')->with("cuatrienio", "corporacion", "cargo")->where('activo',1);
    }
    public function curul()
    {
        return $this->hasOne('App\Models\Curul','id','curul_id')->where('activo',1);
    }
    public function autorias()
    {
        return $this->hasMany('App\Models\ProyectoLeyAutorLegislativo', 'congresista_id', 'id')->with("Proyecto");
    }
    public function ponencias()
    {
        return $this->hasMany('App\Models\ProyectoLeyPonente','congresista_id', 'id');
    }
    public function citante()
    {
        return $this->hasMany('App\Models\ControlPoliticoCitante','congresista_id', 'id');
    }
    public function circunscripcion()
    {
        return $this->hasOne('App\Models\Circunscripcion','id', 'circunscripcion_id')->where("activo", 1);
    }
}
