<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgendaLegislativa extends Model
{
    use HasFactory;
    public $table = "agenda_legislativas";
    public static $rules = [        
        'fecha'=>'required',        
        'comentarios'=>'required',
        'cuatrienio_id'=> 'required|int|min:1'        
    ];

    public static $messages = [                
        'fecha.required'=> 'La fecha es requerida.',   
        'comentarios.required'=> 'Los comentarios son requeridos.', 
        'cuatrienio_id.min'=> 'Debe seleccionar un cuatrienio'       
    ];

    protected $fillable = [                
        'fecha',
        'fecha_realizada',
        'comentarios',
        'cuatrienio_id',
        'realizado',
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
    public function agendaActividad()
    {
        return $this->hasMany('App\Models\AgendaLegislativaActividad')->where('activo', 1);
    }
    public function agendaComision()
    {
        return $this->hasMany(AgendaLegislativaComision::class)->where('activo', 1)->with(['comision'])->where('activo',1);
    }
    public function cuatrienio()
    {
        return $this->hasOne('App\Models\Cuatrienio', 'id', 'cuatrienio_id');
    }
    
   
}
