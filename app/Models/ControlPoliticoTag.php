<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ControlPoliticoTag extends Model
{
    use HasFactory;
    protected $fillable = [                
        'control_politico_id',
        'glosario_legislativo_id',
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

    public function glosarioLegislativo()
    {
        return $this->hasMany('App\Models\GlosarioLegislativo', 'id' , 'glosario_legislativo_id')->where('activo',1);
    }

    public function controlPolitico()
    {
        return $this->hasMany('App\Models\ControlPolitico', 'id' , 'control_politico_id')->where('activo',1);
    }
}
