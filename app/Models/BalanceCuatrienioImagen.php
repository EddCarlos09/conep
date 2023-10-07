<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BalanceCuatrienioImagen extends Model
{
    use HasFactory;

    protected $fillable = [                
        'balance_cuatrienio_id',
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

    public function balance()
    {
        return $this->hasOne('App\Models\BalanceCuatrienio', 'id', 'balance_cuatrienio_id');
    }
}
