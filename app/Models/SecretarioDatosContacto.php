<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecretarioDatosContacto extends Model
{
    use HasFactory;
    protected $fillable = [
        'cuenta',
        'secretario_id',
        'dato_contacto_id',
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
        return $this->hasOne('App\Models\DatosContacto', 'id', 'dato_contacto_id');
    }

    public function secretario()
    {
        return $this->hasOne('App\Models\Secretario', 'id', 'secretario_id');
    }
}
