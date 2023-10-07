<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongresistaTrayectoriaPublica extends Model
{
    use HasFactory;

    protected $fillable = [
        'congresista_id',
        'partido_id',
        'cargo',
        'fecha',
        'aplica',
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

    public function congresista()
    {
        return $this->hasOne('App\Models\Congresista', 'id', 'congresista_id');
    }
    public function partido()
    {
        return $this->hasOne('App\Models\Partido', 'id', 'partido_id')->with("partidoImagen");
    }
}
