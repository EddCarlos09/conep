<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SucursalUsuarioCuentaRol extends Model
{
    use HasFactory;

    protected $fillable = [
        'rol_id',
        'sucursal_usuario_cuenta_id',
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

    public function Rol(){
        return $this->hasOne(Rol::class, 'id', 'rol_id')->where('activo', 1);
    }

    public function SucursalUsuarioCuenta(){
        return $this->hasOne(SucursalUsuarioCuenta::class, 'id', 'sucursal_usuario_cuenta_id')->where('activo', 1);
    }

    public function SucursalUsuarioCuentaRolModuloPermisoRol(){
        return $this->hasMany(SucursalUsuarioCuentaRolModuloPermisoRol::class)
                    ->where('activo', 1);
    }
}
