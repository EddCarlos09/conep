<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecretarioImagen extends Model
{
    use HasFactory;
    protected $fillable = [
        'secretario_id',
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

    public function secretario()
    {
        return $this->hasOne('App\Models\Congresista', 'id', 'secretario_id');
    }
}
