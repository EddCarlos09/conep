<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModuloPermiso extends Model
{
    use HasFactory;

    protected $fillable = [
        'modulo_id',
        'permiso_id',
        'descripcion',
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

    public function Modulo(){
        return $this->hasOne(Modulo::class, 'id', 'modulo_id')
                    ->where('activo', 1);
    }

    public function Permiso(){
        return $this->hasOne(Permiso::class, 'id', 'permiso_id')
                    ->where('activo', 1);
    }
}
