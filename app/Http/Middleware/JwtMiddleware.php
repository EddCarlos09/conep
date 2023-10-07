<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $modulo_permiso_id)
    {
        try {
            JWTAuth::parseToken()->authenticate();
            $payload = JWTAuth::parseToken()->getPayload();

            if($modulo_permiso_id > 0)
            {
                if(!array_keys($payload->get('modulo_permisos_ids'), $modulo_permiso_id)){
                    // Si no tiene el id del módulo permiso marcar error
                    abort(403, 'Access denied');
                }
            }

        } catch (Exception $e) {
            abort(403, 'Access denied');
            //Para saber que código de error es quitar el abort de arriba
            if ($e instanceof TokenInvalidException){
                abort(403, 'Access denied');
                return response()->json(['status' => 'Token is invalid']);
            }
            if ($e instanceof TokenExpiredException){
                abort(403, 'Access denied');
                return response()->json(['status' => 'Token is expired']);
            }

            return response()->json(['status' => 'Authorization token not found']);
        }
        return $next($request);
    }
}
