<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VotacionPlenaria extends Model
{
    use HasFactory;

    protected     $fillable          = [
        'votacion_id',
        'corporacion_id',
        'activo',
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];

    protected     $hidden            = [
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];

    public function corporacion()
    {
        return $this->hasOne('App\Models\Corporacion', 'id', 'corporacion_id')->where('activo',1);
    }
}
