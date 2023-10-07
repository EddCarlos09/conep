<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BalanceCuatrienioInformeImagen extends Model
{
    use HasFactory;

    protected $fillable = [                
        'balance_informe_id',
        'imagen', 
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

    public function informe()
    {
        return $this->hasOne('App\Models\BalanceCuatrienioInforme', 'id', 'balance_informe_id');
    }
}
