<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongresoVisibleAliadoImagen extends Model
{
    use HasFactory;
    protected $fillable = [
        'aliado_id',
        'imagen',
        'usercreated',
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

    public function aliado()
    {
        return $this->hasOne('App\Models\CongresoVisibleAliado', 'id', 'aliado_id');
    }
}
