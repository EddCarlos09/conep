<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    use HasFactory;

    public static function rulesPost () {
        return [
            'nombres' => 'required',
            'apellidos' => 'required',
            'partido_id' => 'numeric|required|min:1|not_in:0',
            'fechaNacimiento' => 'required',
            'municipio_id_nacimiento' => 'numeric|required|min:0|not_in:0',
            'genero_id' => 'numeric|required|min:0|not_in:0',
        ];
    }

    public static $rulesPostMessages = [
        'nombres.required' => 'El nombre(s) es requerido(s).',
        'apellidos.required' => 'Los apellidos son requeridos.',
        'fechaNacimiento.required' => 'La fecha de nacimiento es requerido.',

        'partido_id.numeric' => 'El partido es requerido.',
        'partido_id.required' => 'El partido es requerido.',
        'partido_id.min' => 'El partido es requerido.',
        'partido_id.not_in' => 'El partido es requerido.',

        'municipio_id_nacimiento.numeric' => 'El lugar de nacimiento es requerido.',
        'municipio_id_nacimiento.required' => 'El lugar de nacimiento es requerido.',
        'municipio_id_nacimiento.min' => 'El lugar de nacimiento es requerido.',
        'municipio_id_nacimiento.not_in' => 'El lugar de nacimiento es requerido.',

        'genero_id.numeric' => 'El género es requerido.',
        'genero_id.required' => 'El género es requerido.',
        'genero_id.min' => 'El género es requerido.',
        'genero_id.not_in' => 'El género es requerido.',
    ];

    public static function rulesPut () {
        return [
            'nombres' => 'required',
            'apellidos' => 'required',
            'fechaNacimiento' => 'required',
            'partido_id' => 'numeric|required|min:1|not_in:0',
            'municipio_id_nacimiento' => 'numeric|required|min:0|not_in:0',
            'genero_id' => 'numeric|required|min:0|not_in:0',
        ];
    }

    public static $rulesPutMessages = [
        'nombres.required' => 'El nombre(s) es requerido(s).',
        'apellidos.required' => 'Los apellidos son requeridos.',
        'fechaNacimiento.required' => 'La fecha de nacimiento es requerido.',

        'partido_id.numeric' => 'El partido es requerido.',
        'partido_id.required' => 'El partido es requerido.',
        'partido_id.min' => 'El partido es requerido.',
        'partido_id.not_in' => 'El partido es requerido.',

        'municipio_id_nacimiento.numeric' => 'El lugar de nacimiento es requerido.',
        'municipio_id_nacimiento.required' => 'El lugar de nacimiento es requerido.',
        'municipio_id_nacimiento.min' => 'El lugar de nacimiento es requerido.',
        'municipio_id_nacimiento.not_in' => 'El lugar de nacimiento es requerido.',

        'genero_id.numeric' => 'El género es requerido.',
        'genero_id.required' => 'El género es requerido.',
        'genero_id.min' => 'El género es requerido.',
        'genero_id.not_in' => 'El género es requerido.',
    ];

    protected $fillable = [
        'nombres',
        'apellidos',
        'fechaNacimiento',
        'municipio_id_nacimiento',
        'profesion_id',
        'genero_id',
        'fecha_fallecimiento',
        'perfil_educativo',
        'grado_estudio_id',
        'nombreSuplente',
        'partido_id',
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

    public function LugarNacimiento(){
        return $this->hasOne(Municipio::class, 'id', 'municipio_id_nacimiento')
                    ->select(['id', 'nombre'])
                    ->where('activo',1);
    }

    public function GradoEstudio(){
        return $this->hasOne(GradoEstudio::class, 'id', 'grado_estudio_id')
                    ->select(['id', 'nombre'])->where('activo',1);;
    }

    public function Genero(){
        return $this->hasOne(Genero::class, 'id', 'genero_id')
                    ->select(['id', 'nombre'])->where('activo',1);;
    }

    public function Profesion(){
        return $this->hasOne(Profesion::class, 'id', 'profesion_id')
                    ->select(['id', 'nombre'])->where('activo',1);;
    }
    public function ComisionMiembro(){
        return $this->hasOne(ComisionMiembro::class, 'persona_id', 'id')->with("comision")
                    ->where('activo',1);;
    }

    public function PersonaTrayectoriaPublica(){
        return $this->hasMany(PersonaTrayectoriaPublica::class)->where('activo', 1)->with(['Partido'])->where('activo',1);;
    }

    public function PersonaTrayectoriaPrivada(){
        return $this->hasMany(PersonaTrayectoriaPrivada::class)->where('activo', 1);
    }

    public function Imagenes(){
        return $this->hasMany(PersonaImagen::class)->where('activo', 1);
    }

    public function Contactos(){
        return $this->hasMany(PersonaDatoContacto::class)->with("DatosContacto")->where('activo', 1);
    }

    public function Partido(){
        return $this->hasOne(Partido::class, 'id', 'partido_id')->with("partidoImagen");
    }
}
