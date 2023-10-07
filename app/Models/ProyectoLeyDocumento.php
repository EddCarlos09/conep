<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProyectoLeyDocumento extends Model
{
    use HasFactory;

    public static function rulesPost () {
        return [
            // 'url_archivo' => 'required'
        ];
    }

    public static $rulesPostMessages = [
        // 'titulo.required' => 'El título es requerido.'
    ];

    public static function rulesPut () {
        return [
            
        ];
    }

    public static $rulesPutMessages = [
      
    ];

    protected $fillable = [
        'id',
        'proyecto_ley_id',
        'url_archivo',
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

    // public function ProyectoLeyEstado(){
    //     return $this->hasOne(ProyectoLeyEstado::class, 'id', 'proyecto_ley_estado_id')->where('activo', 1)-with(["ProyectoLey"]);;
    // }
    // public function Comision(){
    //     return $this->hasOne(Comision::class, 'id', 'comision_id')->where('activo',1)
    //                 ->with(['corporacion', 'tipoComision']);
    // }
}
