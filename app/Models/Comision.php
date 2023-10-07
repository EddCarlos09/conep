<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comision extends Model
{
    use HasFactory;

    public static $rulesPost                        = [
        'nombre'                                    => 'required|max:200|min:3',
        'descripcion'                               => 'required|min:3',
        'imagen'                                    => 'required',
        'tipo_comision_id'                          => 'required|int|min:1',
        'datosContacto.*.cuenta'                    => 'exclude_if:datosContacto.*.activo,0|required|max:200|min:3',
        // 'miembros.*.congresista_id'                 => 'exclude_if:miembros.*.activo,0|required|int|min:1',
    ];
    public static $rulesPostMessages = [
        'nombre.required'                   => 'El nombre de la comisión es requerido.',
        'nombre.max'                        => 'El nombre de la comisión no puede ser mayor a :max caracteres.',
        'nombre.min'                        => 'El nombre de la comisión no puede ser menor a :min caracteres.',
        'descripcion.required'              => 'La descripción es requerida.',
        'descripcion.min'                   => 'La descripción de la comisión no puede ser menor a :min caracteres.',
        'imagen.required'                   => 'La imagen es requerida',
        'tipo_comision_id.min'              => 'Debe seleccionar un tipo de comisión',
        'datosContacto.*.cuenta.required'   => 'El dato de contacto es requerido.',
        'datosContacto.*.cuenta.max'        => 'El dato de contacto no puede ser mayor a :max caracteres.',
        'datosContacto.*.cuenta.min'        => 'El dato de contacto no puede ser menor a :min caracteres.',
        // 'miembros.*.congresista_id.min'     => 'Debe seleccionar un congresista',
    ];

    public static $rulesPut         = [
        'nombre'                                    => 'required|max:200|min:3',
        'descripcion'                               => 'required|max:500',
        // 'tipo_comision_id'                          => 'required|int|min:1',
        'datosContacto.*.cuenta'                    => 'exclude_if:datosContacto.*.activo,0|required|max:200|min:3',
        'miembros.*.persona_id'                 => 'exclude_if:miembros.*.activo,0|required|int|min:1',
        // 'miembros.*.fecha_fin'                      => 'exclude_if:miembros.*.activo,0|required|after:miembros.*.fecha_inicio',
        // 'secretarios.*.fecha_final'                 => 'exclude_if:secretarios.*.activo,0|required|after:secretarios.*.fecha_inicio'
    ];
    public static $rulesPutMessages = [
        'nombre.required'                   => 'El nombre de la comisión es requerido.',
        'nombre.max'                        => 'El nombre de la comisión no puede ser mayor a :max caracteres.',
        'nombre.min'                        => 'El nombre de la comisión no puede ser menor a :min caracteres.',
        'descripcion.required'              => 'La descripción es requerida.',
        'descripcion.max'                   => 'La descripción no puede ser mayor a :max caracteres.',
        // 'tipo_comision_id.min'              => 'Debe seleccionar un tipo de comisión',
        'datosContacto.*.cuenta.required'   => 'El dato de contacto es requerido.',
        'datosContacto.*.cuenta.max'        => 'El dato de contacto no puede ser mayor a :max caracteres.',
        'datosContacto.*.cuenta.min'        => 'El dato de contacto no puede ser menor a :min caracteres.',
        'miembros.*.persona_id.min'     => 'Debe seleccionar un congresista',
        // 'miembros.*.fecha_fin.after'       => 'La fecha final no puede ser menor a la fecha de inicio',
        // 'secretarios.*.fecha_final.after'         => 'La fecha final no puede ser menor a la fecha de inicio'
    ];

    protected     $fillable          = [
        'nombre',
        'descripcion',
        'tipo_comision_id',
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

    public function comisionDatosContacto()
    {
        return $this->hasMany('App\Models\ComisionDatosContacto')->with("datosContacto")->where(
            'activo',
            1
        );
    }

    public function comisionMiembro()
    {
        return $this->hasMany('App\Models\ComisionMiembro')
        ->with("persona")->where(
            'activo',
            1
        );
    }

    public function comisionSecretario()
    {
        return $this->hasMany('App\Models\ComisionSecretario')
        ->with("persona")->where(
            'activo',
            1
        );
    }

    public function comisionImagen()
    {
        return $this->hasMany('App\Models\ComisionImagen')->where(
            'activo',
            1
        );
    }
    public function tipoComision(){
        return $this->hasOne('App\Models\TipoComision', 'id', 'tipo_comision_id')->where(
            'activo',1
        );
    }

    public function proyectoLeyComision(){
        return $this->hasMany('App\Models\ProyectoLeyComision')
            ->with(["ProyectoLeyEstado"])->where(
                'activo',
                1
            );
    }

    public function controlPolitico()
    {
        return $this->hasMany('App\Models\ControlPolitico')
        ->with('estadoControlPolitico')
        ->where(
            'activo',
            1
        );
    }
}
