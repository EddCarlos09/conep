<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartidoImagen extends Model
{
    use HasFactory;

    protected $fillable = [
        'partido_id',
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

    public function partido()
    {
        return $this->hasOne('App\Models\Partido', 'id', 'partido_id');
    }
}
