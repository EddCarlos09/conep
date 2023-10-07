<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoPublicacion extends Model
{
    use HasFactory;
    protected $fillable = [
        'nombre',
        'icono',
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
}
