<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\ModuloPermisoRol;
use App\Models\SucursalUsuarioCuenta;
use App\Models\TipoUsuario;
use App\Models\UsuarioCuenta;
use Exception;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Config;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Validator;

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
            $tipo_login = $request->tipo_login;
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

            $tipo_usuario = TipoUsuario::where('id', $user->tipo_usuario_id)->get()->first();
            // Login de administrador
            if($tipo_login == 1){
                if(!$tipo_usuario->acceso_panel_administrador){
                    return response()->json(['message' => 'No puede acceder a ese panel'], 422);
                }
            }
            // Login de cliente
            else if ($tipo_login == 2){
                if(!$tipo_usuario->acceso_panel_cliente){
                    return response()->json(['message' => 'No puede acceder a ese panel'], 422);
                }
            }

            if ($logeoAutomaticoEnSucursal)
            {
                $sucursal_id = Config::get('constants.optionsDefault.idSucursalLogeoAutomatico');
                $modulo_permiso_ids = $this->getModuloPermisoIds($user->id, $sucursal_id);
                $menu = $this->getMenu($modulo_permiso_ids);
                $token_jwt = $this->getTokenJwt($email, $password, $modulo_permiso_ids, $minutosExpirationToken);
                $user->setAttribute('expireSesion', $this->getDateFromToken());
                $user->setAttribute('token', $token_jwt);
                $user->setAttribute('menu', $menu);
                $user->setAttribute('acceso_panel_administrador', $tipo_usuario->acceso_panel_administrador);
                $user->setAttribute('acceso_panel_cliente', $tipo_usuario->acceso_panel_cliente);

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
            dd($e);
            return response()->json(['message' => 'Error'], 422);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    private function getSubMenu($idMenuDependiente, $menus){
        $menuDto = collect([]);
        $menus->where('menu_dependiente_id', '=', $idMenuDependiente)
            ->sortBy('orden')
            ->each(function ($menu) use ($menus, $menuDto){
                $subMenuDto = new MenuDto
                (
                    $menu->id,
                    $menu->modulo_id,
                    $menu->menu_dependiente_id,
                    $menu->nombre_visible,
                    $menu->url,
                    $menu->visible,
                    $menu->orden,
                    $menu->class_name,
                    $menu->icono
                );
                $subMenuDto->subMenus = $this->GetSubMenu($menu->id, $menus);
                $menuDto->push($subMenuDto);
            });

        return $menuDto;
    }

    private function getUser($email, $password, $validator){
        DB::beginTransaction();
        try
        {
            $user = UsuarioCuenta::where('email', '=', $email)
                                 ->first();

            // El usuario no existe
            if (is_null($user)) {
                $validator->errors()->add('email', 'Email no válido');
                return ["success"=> false, "message"=> $validator->errors()];
            }
            if (!($user && Hash::check($password, $user->password)))
            {
                if(!is_null($user->fecha_suspension))
                {
                    $validator->errors()->add('email', 'Cuenta suspendida');
                    return ["success"=> false, "message"=> $validator->errors()];
                }
                // Como no concuerda el password, le agregamos un intento al usuario
                ++$user->intentos;

                $logineMaxTrys = Config::get('constants.optionsDefault.logineMaxTrys');

                if($user->intentos >= $logineMaxTrys )
                {
                    $user->fecha_suspension = Carbon::now();
                    $user->save();
                    DB::commit();
                    $validator->errors()->add('email', 'Cuenta suspendida');
                    return ["success"=> false, "message"=> $validator->errors()];
                }
                $user->fecha_suspension = null;
                $user->save();
                DB::commit();
                $validator->errors()->add('password', 'Password incorrecto');
                return ["success"=> false, "message"=> $validator->errors()];
            }

            $user->fecha_suspension = null;
            $user->intentos = 0;
            $user->save();
            DB::commit();

            return ["success"=> true, "item"=> $user];
        }
        catch (Exception $e)
        {
            DB::rollback();
            return ["success"=> false, "message"=> "Error"];
        }
    }

    private function getMenu($modulo_permiso_ids)
    {
        $listMenuHijos = Menu::whereIn('modulo_id', function ($query) use ($modulo_permiso_ids)
                {
                    $query->from('modulos')
                        ->join('modulo_permisos', 'modulos.id', '=', 'modulo_permisos.modulo_id')
                        ->whereIn('modulo_permisos.id', $modulo_permiso_ids)
                        ->select('modulos.id')
                        ->distinct();
                }
        )->where('activo', '=', 1)
         ->get(
                [
                    'id',
                    'modulo_id',
                    'menu_dependiente_id',
                    'nombre_visible',
                    'url',
                    'visible',
                    'orden',
                    'class_name',
                    'icono'
                ]
            );
        $idMenusHijos = $listMenuHijos->whereNotNull('menu_dependiente_id')->pluck('menu_dependiente_id')->unique();

        $listMenuPadres = Menu::where('activo', '=', 1)
                              ->whereNull('menu_dependiente_id')
                              ->whereIn('id', $idMenusHijos)
                              ->distinct()
                              ->get(
                                  [
                                    'id',
                                    'modulo_id',
                                    'menu_dependiente_id',
                                    'nombre_visible',
                                    'url',
                                    'visible',
                                    'orden',
                                    'class_name',
                                    'icono'
                                  ]);

        $listaMenus = $listMenuHijos;
        $listMenuPadres->each(
            function ($menu) use
            (
                $listaMenus
            )
            {
                $listaMenus->push($menu);
            }
        );
        $menus = $this->getSubMenu(
            null,
            $listaMenus
        );
        $menus = $menus->unique()->values()->toJson();
        return $menus;
    }

    private function getSucursales($usuario_cuenta_id){
        return SucursalUsuarioCuenta::where('usuario_cuenta_id', '=', $usuario_cuenta_id)
                                    ->with
                                    (
                                        ['Sucursal' => function ($query)
                                            {
                                                $query->select('id','nombre');
                                            }
                                        ]
                                    )
                                    ->distinct()
                                    ->get();
    }

    private function getModuloPermisoIds($usuario_cuenta_id, $sucursal_id){
        $modulo_permiso_ids = ModuloPermisoRol::select(
            [
                'id',
                'modulo_permiso_id',
                'rol_id',
                'activo',
            ]
        )->with(
            [
                'SucursalUsuarioCuentaRolModuloPermisoRol' => function ($query) use
                (
                    $usuario_cuenta_id,
                    $sucursal_id
                )
                {
                    $query->with(
                        [
                            'SucursalUsuarioCuentaRol' => function ($query) use
                            (
                                $usuario_cuenta_id,
                                $sucursal_id
                            )
                            {
                                $query->with(
                                    [
                                        'SucursalUsuarioCuenta' => function ($query) use
                                        (
                                            $usuario_cuenta_id,
                                            $sucursal_id
                                        )
                                        {
                                            $query->where(
                                                'sucursal_id',
                                                '=',
                                                $sucursal_id
                                            )->where(
                                                'usuario_cuenta_id',
                                                '=',
                                                $usuario_cuenta_id
                                            );
                                        }
                                    ]
                                );
                            }
                        ]
                    );
                }
            ]
        )->where('activo', 1)->distinct()->get()->pluck('modulo_permiso_id');
        return $modulo_permiso_ids;
    }

    private function getTokenJwt($email, $password, $modulo_permiso_ids, $minutosExpirationToken){
        $creds = array();
        $creds["email"] = $email;
        $creds["password"] = $password;

        JWTAuth::factory()->setTTL($minutosExpirationToken);


        return JWTAuth::claims(['modulo_permisos_ids' => $modulo_permiso_ids])
                        ->attempt($creds);
    }

    private function getDateFromToken(){
        $ts = JWTAuth::factory()->buildClaimsCollection()["exp"];
        return date('Y-m-d H:i:s', $ts->getValue());
    }
}

class MenuDTO
{
    public $id;
    public $modulo_id;
    public $menu_dependiente_id;
    public $nombre_visible;
    public $url;
    public $visible;
    public $orden;
    public $class_name;
    public $icono;
    public $subMenus;

    public function __construct($id, $modulo_id, $menu_dependiente_id, $nombre_visible, $url, $visible, $orden, $class_name, $icono) {
        $this->id = $id;
        $this->modulo_id = $modulo_id;
        $this->menu_dependiente_id = $menu_dependiente_id;
        $this->nombre_visible = $nombre_visible;
        $this->url = $url;
        $this->visible = $visible;
        $this->orden = $orden;
        $this->class_name = $class_name;
        $this->icono = $icono;

        $this->subMenus = array();
    }


}
