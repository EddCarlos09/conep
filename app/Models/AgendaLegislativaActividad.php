<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgendaLegislativaActividad extends Model
{
    use HasFactory;
    public $table = "agenda_legislativa_actividads";
    public static $rules = [        
        'agenda_legislativa_id'=>'required',
        'titulo'=>'required',        
        'descripcion'=>'required|min:3',
        'tipo_actividad_id'=>'required'             
    ];

    public static $messages = [                
        'agenda_legislativa_id.required' => 'La id de agenda es requerida.',   
        'titulo.required' => 'El titulo es requerido.',
        'descripcion.required' => 'La descripción es requerida.',
        'descripcion.min'=> 'La descripcion no puede ser menor a :min caracteres.',
        'tipo_actividad_id.required' => 'El tipo de actividad es requerido.'
                     
    ];

    protected $fillable = [                
        'agenda_legislativa_id',
        'titulo',        
        'destacado',
        'descripcion',
        'tipo_actividad_id',
        'proyecto_ley_id',        
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
        return $this->hasOne('App\Models\AgendaLegislativa', 'id', 'agenda_legislativa_id')->with('agendaComision');
    }
    public function tipoActividad()
    {
        return $this->hasOne('App\Models\TipoActividadAgendaLegislativa', 'id', 'tipo_actividad_id');
    }
    public function selected()
    {
        return $this->hasOne('App\Models\ProyectoLey', 'id', 'proyecto_ley_id');
    }
}
