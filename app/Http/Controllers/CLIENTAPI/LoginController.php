<?php

namespace App\Http\Controllers\CLIENTAPI;

use App\Http\Controllers\Controller;
use App\Models\UsuarioCuenta;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /**
     * Login user to system.
     *
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        try
        {
            if ($request->has('sucursal_id'))
            {
                $validator = Validator::make(
                    $request->all(),
                    UsuarioCuenta::$rulesPostLoginWithSucursal,
                    UsuarioCuenta::$messagesPostLoginWithSucursal
                );
            }
            else
            {
                $validator = Validator::make(
                    $request->all(),
                    UsuarioCuenta::$rulesPostLogin,
                    UsuarioCuenta::$messagesPostLogin
                );
            }

            $email = $request->email;
            $password = $request->password;
            $logeoAutomaticoEnSucursal = Config::get('constants.optionsDefault.logeoAutomaticoEnSucursal');
            $minutosExpirationToken = Config::get('constants.optionsDefault.minutosExpirationToken');

            $item = $this->getUser(
                $email,
                $password,
                $validator
            );
            if ($validator->messages()->count())
            {
                return response()->json($validator->messages(), 422);
            }

            $user = $item["item"];

            if ($logeoAutomaticoEnSucursal)
            {
                $sucursal_id = Config::get('constants.optionsDefault.idSucursalLogeoAutomatico');
                $modulo_permiso_ids = $this->getModuloPermisoIds($user->id, $sucursal_id);
                $menu = $this->getMenu($modulo_permiso_ids);
                $token_jwt = $this->getTokenJwt($email, $password, $modulo_permiso_ids, $minutosExpirationToken);
                $user->setAttribute('expireSesion', $this->getDateFromToken());
                $user->setAttribute('token', $token_jwt);
                $user->setAttribute('menu', $menu);

                unset
                (
                    $user->tipo_usuario_id,
                    $user->usuario,
                    $user->password,
                    $user->intentos,
                    $user->fecha_suspension,
                    $user->usercreated,
                    $user->usermodifed,
                    $user->created_at,
                    $user->updated_at,
                    $user->id
                );

                return response(
                    $user,
                    200
                );
            }
            if ($request->has('sucursal_id'))
            {
                $sucursal_id = $request->sucursal_id;
                $modulo_permiso_ids = $this->getModuloPermisoIds($user->id, $sucursal_id);
                $menu = $this->getMenu($modulo_permiso_ids);
                $token_jwt = $this->getTokenJwt($email, $password, $modulo_permiso_ids, $minutosExpirationToken);
                $user->setAttribute('expireSesion', $this->getDateFromToken());
                $user->setAttribute('token', $token_jwt);
                $user->setAttribute('menu', $menu);

                unset
                (
                    $user->tipo_usuario_id,
                    $user->usuario,
                    $user->password,
                    $user->intentos,
                    $user->fecha_suspension,
                    $user->usercreated,
                    $user->usermodifed,
                    $user->created_at,
                    $user->updated_at,
                    $user->id
                );

                return response($user, 200);
            }
            $sucursales = $this->getSucursales($user->id);

            return response(
                $sucursales,
                200
            );
        }
        catch (Exception $e)
        {
            return response()->json(['message' => 'Error'], 422);
        }
    }
}
