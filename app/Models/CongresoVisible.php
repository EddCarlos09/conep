<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongresoVisible extends Model
{
    use HasFactory;
    
    public static $rulesPut  = [
        // 'queEs'                   => 'required',
        // 'objetivos'                => 'required',
        // 'historiaymision'           => 'required',
        // 'nuestroFuturo'            => 'required',
        // 'nuestroReto'              => 'required',
        // // 'imagen'                   => 'required',
        // 'datosContacto.*.cuenta'   => 'exclude_if:datosContacto.*.activo,0|required|max:200|min:3'
    
    ];
    public static $rulesPutMessages = [
        // 'queEs.required'                    => 'Este campo es requerido.',      
        // 'objetivos.required'                => 'El objetivo es requerido.', 
        // 'historiaymision.required'          => 'La historia y mision es requerido.',
        // 'nuestroFuturo.required'            => 'El campo Nuestro futuro es requerido',
        // 'nuestroReto.required'              => 'El campo Nuestro reto es requerido',
        // 'imagen.required'                   => 'La imagen es requerida',       
        // 'datosContacto.*.cuenta.required'   => 'El dato de contacto es requerido.',
        // 'datosContacto.*.cuenta.max'        => 'El dato de contacto no puede ser mayor a :max caracteres.',
        // 'datosContacto.*.cuenta.min'        => 'El dato de contacto no puede ser menor a :min caracteres.',       
    ];

    protected  $fillable  = [
        'queEs',
        'objetivos',
        'historiaymision',        
        'nuestroFuturo',
        'nuestroReto',
        'activo',
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];
    protected $hidden  = [
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];

    public function congresoVisibleDatosContacto()
    {
        return $this->hasMany('App\Models\CongresoVisibleDatosContacto')->with("datosContacto")->where('activo',1);
    }

    public function congresoVisibleImagen()
    {
        return $this->hasMany('App\Models\CongresoVisibleImagen')->where('activo',1);
    }
}
