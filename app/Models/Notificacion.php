<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'proyecto_ley_id',
        'titulo',
        'tipo',
        'color',
        'icono',
        'mensaje',
        'usercreated',
        'created_at',
        'updated_at'
    ];

    protected $hidden = [
        'usercreated',
        'created_at',
        'updated_at'
    ];
}
