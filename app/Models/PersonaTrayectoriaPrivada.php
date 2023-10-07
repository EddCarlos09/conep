<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonaTrayectoriaPrivada extends Model
{
    use HasFactory;

    protected $fillable = [
        'persona_id',
        'cargo',
        'fecha',
        'fecha_final',
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
