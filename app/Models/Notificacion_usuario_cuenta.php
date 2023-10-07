<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Notificacion_usuario_cuenta extends Model
{
    use HasFactory;

    public function Notificacion(): HasOne
    {
        return $this->hasOne(Notificacion::class, 'id', 'notificacion_id');
    }
}
