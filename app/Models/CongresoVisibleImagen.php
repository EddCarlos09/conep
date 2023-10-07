<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongresoVisibleImagen extends Model
{
    use HasFactory;
    protected $fillable = [
        'congreso_visible_id',
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

    public function congresoVisible()
    {
        return $this->hasOne('App\Models\CongresoVisible', 'id', 'congreso_visible_id');
    }
}
