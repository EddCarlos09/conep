<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curul extends Model
{
    use HasFactory;

    protected     $fillable          = [
        'cx',
        'cy',
        'r',
        'seccionAsiento',
        'filaAsiento',
        'asiento',
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

    public function congresista()
    {
        return $this->hasOne('App\Models\Congresista','curul_id','id')->with('partido', 'cuatrienio', 'corporacion', 'persona')->where('congresistas.activo',1);
    }
}
