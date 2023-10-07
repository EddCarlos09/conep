<?php

namespace App\Models;


use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UsuarioCuenta extends Authenticatable implements JWTSubject
{
    use Notifiable;
    use HasFactory;

    public static $rulesPostLogin = [
        'email' => 'required|email',
        'password' => 'required',
    ];

    public static $rulesPostLoginWithSucursal = [
        'email' => 'required|email',
        'password' => 'required',
        'sucursal_id' => 'numeric|required|min:0|not_in:0',
    ];

    public static $rulesPost = [
        'tipo_usuario_id'=>'numeric|required|min:0|not_in:0',
        'email' => 'required|email|unique:usuario_cuentas',
        'nombre_completo' => 'required',
        'password' => 'required|confirmed',
        'password_confirmation' => 'required'
    ];

    public static function rulesPut($id){
        return
        [
            'id'=>'numeric|required|min:0|not_in:0',
            'tipo_usuario_id'=>'numeric|required|min:0|not_in:0',
            'email' => 'required|string|email|max:255|unique:usuario_cuentas,email,'.$id,
            'nombre_completo' => 'required',
            'user' => 'required'
        ];
    }


    public static $messagesPostLogin = [
        'email.required' => 'El email es requerido.',
        'email.email' =>'El formato del email es incorrecto.',
        'password.required' =>'El password es requerido.',
    ];

    public static $messagesPostLoginWithSucursal = [
        'email.required' => 'El email es requerido.',
        'email.email' =>'El formato del email es incorrecto.',
        'password.required' =>'El password es requerido.',

        'sucursal_id.numeric' => 'La sucursal es requerido.',
        'sucursal_id.required' => 'La sucursal es requerido.',
        'sucursal_id.min' => 'La sucursal es requerido.',
        'sucursal_id.not_in' => 'La sucursal es requerido.',
    ];

    public static $messagesPost = [
        'tipo_usuario_id.numeric' => 'El tipo de usuario es requerido.',
        'tipo_usuario_id.required' => 'El tipo de usuario es requerido.',
        'tipo_usuario_id.min' => 'El tipo de usuario es requerido.',
        'tipo_usuario_id.not_in' => 'El tipo de usuario es requerido.',

        'email.required' => 'El email es requerido.',
        'email.email' =>'El formato del email es incorrecto.',
        'email.unique' =>'El email actualmente esta en uso.',
        'nombre_completo.required' =>'El nombre completo es requerido.',
        'password.required' =>'El password es requerido.',
        'password.confirmed' =>'Los password deben coincidir.',
        'password_confirmation.required' =>'La confirmación de password es requerido.',
    ];

    public static $messagesPut = [
        'id.numeric' => 'La cuenta de usuario es requerida.',
        'id.required' => 'La cuenta de usuario es requerida.',
        'id.min' => 'La cuenta de usuario es requerida.',
        'id.not_in' => 'La cuenta de usuario es requerida.',

        'tipo_usuario_id.numeric' => 'El tipo de usuario es requerido.',
        'tipo_usuario_id.required' => 'El tipo de usuario es requerido.',
        'tipo_usuario_id.min' => 'El tipo de usuario es requerido.',
        'tipo_usuario_id.not_in' => 'El tipo de usuario es requerido.',

        'email.required' => 'El email es requerido.',
        'email.email' =>'El formato del email es incorrecto.',
        'email.unique' =>'El email actualmente esta en uso.',
        'nombre_completo.required' =>'El nombre completo es requerido.',
        'user.required' =>'El usuario es requerido.',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    protected $fillable = [
        'tipo_usuario_id',
        'email',
        'nombre_completo',
        'password',
        'intentos',
        'fecha_suspension',
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

    public function TipoUsuario(){
        return $this->hasOne(TipoUsuario::class, 'id', 'tipo_usuario_id');
    }
}
