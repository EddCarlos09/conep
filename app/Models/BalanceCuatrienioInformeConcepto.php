<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BalanceCuatrienioInformeConcepto extends Model
{
    use HasFactory;
    
    protected $fillable = [                
        'balance_informe_id',
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
        return $this->hasOne('App\Models\GlosarioLegislativo', 'id' , 'glosario_legislativo_id')->where('activo',1);
    }

    public function informes()
    {
        return $this->hasMany('App\Models\BalanceCuatrienioInforme', 'id' , 'balance_informe_id')->where('activo',1);
    }
}
