<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModuloPermisoRol extends Model
{
    use HasFactory;

    protected $fillable = [
        'modulo_permiso_id',
        'rol_id',
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

    public function ModuloPermiso(){
        return $this->hasOne(ModuloPermiso::class, 'id', 'modulo_permiso_id')
                    ->where('activo', 1);
    }

    public function Rol(){
        return $this->hasOne(Rol::class, 'id', 'rol_id')
                    ->where('activo', 1);
    }

    public function SucursalUsuarioCuentaRolModuloPermisoRol(){
        return $this->hasMany(SucursalUsuarioCuentaRolModuloPermisoRol::class)
                    ->where('activo', 1);
    }

}
