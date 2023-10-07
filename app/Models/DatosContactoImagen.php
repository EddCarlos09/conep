<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DatosContactoImagen extends Model
{
    use HasFactory;

    protected $fillable = [
        'datos_contacto_id',
        'imagen',
        'usercreated',
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

    public function datosContacto()
    {
        return $this->hasOne('App\Models\DatosContacto', 'id', 'datos_contacto_id');
    }
}
