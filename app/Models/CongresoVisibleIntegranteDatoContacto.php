<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongresoVisibleIntegranteDatoContacto extends Model
{
    use HasFactory;
    protected $fillable = [
        'cuenta',
        'integrante_id',
        'contacto_id',
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
        return $this->hasOne('App\Models\DatosContacto', 'id', 'contacto_id');
    }

    public function congresovisibleIntegrante(){
        return $this->hasOne('App\Models\CongresoVisibleEquipoIntegrante','id','integrante_id');
    }
}
