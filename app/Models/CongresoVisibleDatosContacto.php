<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CongresoVisibleDatosContacto extends Model
{
    use HasFactory;
    protected $fillable = [
        'cuenta',
        'congreso_visible_id',
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
        return $this->hasOne('App\Models\DatosContacto', 'id', 'dato_contacto_id')->with("datosContactoImagen");
    }

    public function congresovisible(){
        return $this->hasOne('App\Models\CongresoVisible','id','congreso_visible_id');
    }
}
