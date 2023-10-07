<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SucursalUsuarioCuenta extends Model
{
    use HasFactory;

    public static $rulesPost = [
        'sucursal_id' => 'numeric|required|min:0|not_in:0',
        'usuario_cuenta_id' => 'numeric|required|min:0|not_in:0',
        'user'=>'required'
    ];

    public static $rulesPostMessages = [
        'sucursal_id.numeric' => 'La sucursal es requerida.',
        'sucursal_id.required' => 'La sucursal es requerida.',
        'sucursal_id.min' => 'La sucursal es requerida.',
        'sucursal_id.not_in' => 'La sucursal es requerida.',

        'usuario_cuenta_id.numeric' => 'La cuenta del usuario es requerida.',
        'usuario_cuenta_id.required' => 'La cuenta del usuario es requerida.',
        'usuario_cuenta_id.min' => 'La cuenta del usuario es requerida.',
        'usuario_cuenta_id.not_in' => 'La cuenta del usuario es requerida.',

        'user.required' => 'El usuario que realiza la acción es requerido.',
    ];

    protected $fillable = [
        'sucursal_id',
        'usuario_cuenta_id',
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

    public function Sucursal(){
        return $this->hasOne(Sucursal::class, 'id', 'sucursal_id')
                    ->where('activo', 1);
    }

    public function UsuarioCuenta(){
        return $this->hasOne(UsuarioCuenta::class, 'id', 'usuario_cuenta_id')
                    ->where('activo', 1);
    }

    public function SucursalUsuarioCuentaRol(){
        return $this->hasMany(SucursalUsuarioCuentaRol::class)
                    ->where('activo', 1);
    }
}
