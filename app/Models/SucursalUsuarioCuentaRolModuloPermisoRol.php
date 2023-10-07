<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SucursalUsuarioCuentaRolModuloPermisoRol extends Model
{
    use HasFactory;

    protected $fillable = [
        'modulo_permiso_rol_id',
        'sucursal_usuario_cuenta_rol_id',
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

    public function ModuloPermisoRol(){
        return $this->hasOne(ModuloPermisoRol::class, 'id', 'modulo_permiso_rol_id')->where('activo', 1);
    }

    public function SucursalUsuarioCuentaRol(){
        return $this->hasOne(SucursalUsuarioCuentaRol::class, 'id', 'sucursal_usuario_cuenta_rol_id')->where('activo', 1);
    }
}
