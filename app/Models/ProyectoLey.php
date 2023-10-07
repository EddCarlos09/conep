<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProyectoLey extends Model
{
    use HasFactory;

    public static function rulesPost () {
        return [
            'titulo' => 'required',
            'fecha_radicacion' => 'required',
            'numero_camara' => 'required',
            'tema_id_principal' => 'numeric|required|min:0|not_in:0',
            'cuatrienio_id' => 'numeric|required|min:0|not_in:0',
            'legislatura_id' => 'numeric|required|min:0|not_in:0',
            'iniciativa_id' => 'numeric|required|min:0|not_in:0',
            'sinopsis' => 'required',
            
        ];
    }

    public static $rulesPostMessages = [
        'titulo.required' => 'El título es requerido.',
        'fecha_radicacion.required' => 'La fecha de radicación es requerida.',
        'numero_camara.required' => 'El número de cámara es requerida.',

        'tema_id_principal.numeric' => 'El tema principal es requerido.',
        'tema_id_principal.required' => 'El tema principal es requerido.',
        'tema_id_principal.min' => 'El tema principal es requerido.',
        'tema_id_principal.not_in' => 'El tema principal es requerido.',

        'cuatrienio_id.numeric' => 'El cuatrienio es requerido.',
        'cuatrienio_id.required' => 'El cuatrienio es requerido.',
        'cuatrienio_id.min' => 'El cuatrienio es requerido.',
        'cuatrienio_id.not_in' => 'El cuatrienio es requerido.',

        'legislatura_id.numeric' => 'La legislatura es requerido.',
        'legislatura_id.required' => 'La legislatura es requerido.',
        'legislatura_id.min' => 'La legislatura es requerido.',
        'legislatura_id.not_in' => 'La legislatura es requerido.',

        'iniciativa_id.numeric' => 'La iniciativa es requerido.',
        'iniciativa_id.required' => 'La iniciativa es requerido.',
        'iniciativa_id.min' => 'La iniciativa es requerido.',
        'iniciativa_id.not_in' => 'La iniciativa es requerido.',

        'sinopsis.required' => 'La sinopsis es requerida.',

        
    ];

    public static function rulesPut () {
        return [
            'titulo' => 'required',
            'fecha_radicacion' => 'required',
            'legislatura_id' => 'numeric|required|min:0|not_in:0',
            'cuatrienio_id' => 'numeric|required|min:0|not_in:0',
            'iniciativa_id' => 'numeric|required|min:0|not_in:0',
            'tema_id_principal' => 'numeric|required|min:0|not_in:0',
            'sinopsis' => 'required'
        ];
    }

    public static $rulesPutMessages = [
        'titulo.required' => 'El título es requerido.',
        'fecha_radicacion.required' => 'La fecha de radicación es requerida.',

        'legislatura_id.numeric' => 'La legislatura es requerido.',
        'legislatura_id.required' => 'La legislatura es requerido.',
        'legislatura_id.min' => 'La legislatura es requerido.',
        'legislatura_id.not_in' => 'La legislatura es requerido.',

        'cuatrienio_id.numeric' => 'El quinquenio es requerido.',
        'cuatrienio_id.required' => 'El quinquenio es requerido.',
        'cuatrienio_id.min' => 'El quinquenio es requerido.',
        'cuatrienio_id.not_in' => 'El quinquenio es requerido.',

        'iniciativa_id.numeric' => 'La iniciativa es requerido.',
        'iniciativa_id.required' => 'La iniciativa es requerido.',
        'iniciativa_id.min' => 'La iniciativa es requerido.',
        'iniciativa_id.not_in' => 'La iniciativa es requerido.',

        'tema_id_principal.numeric' => 'El tema principal es requerido.',
        'tema_id_principal.required' => 'El tema principal es requerido.',
        'tema_id_principal.min' => 'El tema principal es requerido.',
        'tema_id_principal.not_in' => 'El tema principal es requerido.',

        'sinopsis.required' => 'La sinopsis es requerida.',
    ];

    protected $fillable = [
        'cuatrienio_id',
        'legislatura_id',
        'titulo',
        'alias',
        'fecha_radicacion',
        'numero_camara',
        'iniciativa_id',
        'tipo_proyecto_id',
        'tema_id_principal',
        'tema_id_secundario',
        'sinopsis',
        'activo',
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at',
        'esLey'
    ];

    protected $hidden = [
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];
    public function Iniciativa(){
        return $this->hasOne(Iniciativa::class, 'id', 'iniciativa_id')->where('activo', 1);
    }
    public function Legislatura(){
        return $this->hasOne(Legislatura::class, 'id', 'legislatura_id');
    }
    public function Cuatrienio(){
        return $this->hasOne(Cuatrienio::class, 'id', 'cuatrienio_id');
    }
    public function TipoProyectoLey(){
        return $this->hasOne(TipoProyecto::class, 'id', 'tipo_proyecto_id');
    }
    public function TemaPrincipal(){
        return $this->hasOne(Tema::class, 'id', 'tema_id_principal');
    }
    public function TemaSecundario(){
        return $this->hasOne(Tema::class, 'id', 'tema_id_secundario');
    }
    public function ProyectoLeyEstado(){
        return $this->hasMany(ProyectoLeyEstado::class)->where('activo', 1)->with(["TipoEstado", 'Comisiones']);
    }
    public function ProyectoLeyAutorPersonas(){
        return $this->hasMany(ProyectoLeyAutor::class)->where('activo', 1)->with('Persona');
    }
    public function ProyectoLeyVotacion(){
        return $this->hasMany(Votacion::class, 'proyecto_de_ley_id', 'id')->where('activo',1)->with(['votacionCongresista']);
    }
    public function ProyectoLeyDocumentos(){
        return $this->hasMany(ProyectoLeyDocumento::class, 'proyecto_ley_id', 'id')->where('activo', 1);
    }
}
