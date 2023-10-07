<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentosInforme extends Model
{
    use HasFactory;
    public static $rulesPost = [
        'titulo'                       => 'required|max:250|min:3',
        'documento'                    => 'required'
    ];
    public static $rulesPostMessages = [
        'titulo.required'                       => 'El titulo del documento es requerido.',
        'titulo.max'                            => 'El titulo del documento no puede ser mayor a :max caracteres.',
        'titulo.min'                            => 'El titulo del documento no puede ser menor a :min caracteres.', 
        'documento.required'                    => 'El Documento es requerido'
    ];
    public static $rulesPut = [
        'titulo'                                => 'required|max:250|min:3',
        'documento'                             => 'required'
    ];
    public static $rulesPutMessages  = [
        'titulo.required'                       => 'El titulo del documento es requerido.',
        'titulo.max'                            => 'El titulo del documento no puede ser mayor a :max caracteres.',
        'titulo.min'                            => 'El titulo del documento no puede ser menor a :min caracteres.',
        'documento.required'                    => 'El Documento es requerido'
    ];
    protected $fillable = [
        'titulo',
        'documento',
        'informes_pnud_id',
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
    
    public function informesPNUD(){
        return $this->hasOne('App\Models\InformesPnud','id','informes_pnud_id');
    }
}
