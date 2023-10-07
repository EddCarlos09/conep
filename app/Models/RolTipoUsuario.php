<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RolTipoUsuario extends Model
{
    use HasFactory;

    public static $rulesPost = [
        'rol_id' => 'numeric|required|min:0|not_in:0',
        'tipo_usuario_id' => 'numeric|required|min:0|not_in:0',
    ];

    public static $messagesPost = [
        'rol_id.numeric' => 'El rol es requerido.',
        'rol_id.required' => 'El rol es requerido.',
        'rol_id.min' => 'El rol es requerido.',
        'rol_id.not_in' => 'El rol es requerido.',

        'tipo_usuario_id.numeric' => 'El tipo tipo de usuario es requerido.',
        'tipo_usuario_id.required' => 'El tipo tipo de usuario es requerido.',
        'tipo_usuario_id.min' => 'El tipo tipo de usuario es requerido.',
        'tipo_usuario_id.not_in' => 'El tipo tipo de usuario es requerido.',

    ];

    protected $fillable = [
        'rol_id',
        'tipo_usuario_id',
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
}
