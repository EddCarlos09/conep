<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgendaLegislativaComision extends Model
{
    use HasFactory;
    public $table = "agenda_legislativa_comisions";
    public static $rules = [        
        'agenda_legislativa_id'=>'required',
        // 'corporacion_id'=>'required',
        'comision_id'=>'required'
    ];

    public static $messages = [                
        'agenda_legislativa_id.required' => 'La id de agenda es requerida.',   
        // 'corporacion_id.required' => 'La id de corporacion es requerida.',
        'comision_id.required' => 'La id de comision es requerida.'                     
    ];
    protected $fillable = [                
        'agenda_legislativa_id',
        // 'corporacion_id',       
        'comision_id',
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
    public function agenda()
    {
        return $this->hasOne('App\Models\AgendaLegislativa', 'id', 'agenda_legislativa_id');
    }
    // public function corporacion()
    // {
    //     return $this->hasOne('App\Models\Corporacion', 'id','corporacion_id')->where('activo',1);
    // }    
    public function comision()
    {
        return $this->hasOne('App\Models\Comision', 'id', 'comision_id')->with(['tipoComision']);
    }
}
