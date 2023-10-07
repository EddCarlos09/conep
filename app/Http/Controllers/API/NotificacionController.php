<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Notificacion;
use App\Models\Notificacion_usuario_cuenta;
use App\Models\UsuarioCuenta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
    public function destroy($email, $proyecto_ley_id)
    {
        $usuario_cuenta_id = UsuarioCuenta::where('email', $email)->get('id')->first();
        //DB::enableQueryLog(); // Enable query log
        $notificacion_usuario_cuentas_ids =
        Notificacion::join('notificacion_usuario_cuentas',
            'notificacions.id',
            'notificacion_usuario_cuentas.notificacion_id')
            ->where('notificacions.proyecto_ley_id', $proyecto_ley_id)
            ->where('notificacion_usuario_cuentas.usuario_cuenta_id', $usuario_cuenta_id->id)
            ->get('notificacion_usuario_cuentas.id')
            ->toArray();
        //dd(DB::getQueryLog()); // Show results of log
        Notificacion_usuario_cuenta::whereIn('id', $notificacion_usuario_cuentas_ids)
            ->delete();
    }

    /**
     * Display all notification from user.
     *
     * @param  string  $email
     * @return \Illuminate\Http\Response
     */
    public function show_all($email, $limite)
    {
        $user = UsuarioCuenta::where('email', $email)->get('id')->first();
        $limite = (int)$limite;
        if($limite === 0){
            $notificaciones = Notificacion_usuario_cuenta::where('usuario_cuenta_id',$user->id)
            ->with(['Notificacion'])
            ->orderBy('created_at', 'desc')
            ->get();
        }else{
            $notificaciones = Notificacion_usuario_cuenta::where('usuario_cuenta_id',$user->id)
            ->with(['Notificacion'])
            ->orderBy('created_at', 'desc')
            ->limit($limite)
            ->get();
        }


        return response($notificaciones);
    }
}
