<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComisionImagen extends Model
{
    use HasFactory;

    protected $fillable = [
        'comision_id',
        'imagen',
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

    public function comision()
    {
        return $this->hasOne('App\Models\Comision', 'id', 'comision_id');
    }
}