<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongresistaImagen extends Model
{
    use HasFactory;

    protected $fillable = [
        'congresista_id',
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

    public function congresista()
    {
        return $this->hasOne('App\Models\Congresista', 'id', 'congresista_id');
    }
}
