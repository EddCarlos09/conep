<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InformacionSitio extends Model
{
    use HasFactory;

    public static $rulesPut  = [
        'imgPrincipal'                => 'required',
        'congresistas'                => 'required|max:380|min:3',
        'nuestraDemocracia'           => 'required|max:380|min:3',
        'actividadLegislativa'        => 'required|max:380|min:3',
        'igmActividadLegislativa'     => 'required',
        'comisiones'                  => 'required|max:380|min:3',
        'contenidoMultimedia'         => 'required|max:380|min:3',
        'proyectosDeLey'              => 'required|max:380|min:3',
        'datos'                       => 'required|max:380|min:3',
        'observacionesLegales'        => 'required'
    ];
    public static $rulesPutMessages = [
        'imgPrincipal.required'             => 'La imagen es requerida.',     
        
        'congresistas.required'             => 'El campo congresistas es requerido.', 
        'congresistas.max'                  => 'El campo congresistas no puede ser mayor a :max caracteres.',
        'congresistas.min'                  => 'El campo congresistas no puede ser menor a :min caracteres.',

        'nuestraDemocracia.required'        => 'El campo nuestra democracia es requerido.', 
        'nuestraDemocracia.max'             => 'El campo nuestra democracia no puede ser mayor a :max caracteres.',
        'nuestraDemocracia.min'             => 'El campo nuestra democracia no puede ser menor a :min caracteres.',

        'actividadLegislativa.required'     => 'El campo actividad legislativa es requerido.',        
        'actividadLegislativa.max'          => 'El campo actividad legislativa no puede ser mayor a :max caracteres.',
        'actividadLegislativa.min'          => 'El campo actividad legislativa no puede ser menor a :min caracteres.',        

        'igmActividadLegislativa.required'  => 'La imagen es requerida.', 
        
        'comisiones.required'               => 'El campo comisiones es requerido.',        
        'comisiones.max'                    => 'El campo comisiones no puede ser mayor a :max caracteres.',
        'comisiones.min'                    => 'El campo comisiones no puede ser menor a :min caracteres.', 

        'contenidoMultimedia.required'      => 'El campo contenido multimedia es requerido.',        
        'contenidoMultimedia.max'           => 'El campo contenido multimedia no puede ser mayor a :max caracteres.',
        'contenidoMultimedia.min'           => 'El campo contenido multimedia no puede ser menor a :min caracteres.', 

        'proyectosDeLey.required'           => 'El campo proyectos de ley es requerido.',        
        'proyectosDeLey.max'                => 'El campo proyectos de ley no puede ser mayor a :max caracteres.',
        'proyectosDeLey.min'                => 'El campo proyectos de ley no puede ser menor a :min caracteres.', 

        'datos.required'                    => 'El campo datos es requerido.',        
        'datos.max'                         => 'El campo datos no puede ser mayor a :max caracteres.',
        'datos.min'                         => 'El campo datos no puede ser menor a :min caracteres.', 

        'observacionesLegales'              => 'El campo observaciones legales es requerido.'
    ];

    protected  $fillable  = [
        'imgPrincipal',
        'congresistas',
        'nuestraDemocracia',        
        'actividadLegislativa',
        'igmActividadLegislativa',
        'comisiones',
        'contenidoMultimedia',
        'proyectosDeLey',
        'datos',
        'observacionesLegales',
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

    public function slidePrincipal()
    {
        return $this->hasMany('App\Models\SlidePrincipalCv')->where('activo',1);
    }

    public function slideSecundario()
    {
        return $this->hasMany('App\Models\SlideSecundarioCv')->where('activo',1);
    }
}
