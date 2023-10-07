<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonaDatoContacto extends Model
{
    use HasFactory;

    protected $fillable = [
        'persona_id',
        'dato_contacto_id',
        'cuenta',
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

    public function DatosContacto(){
        return $this->hasOne(DatosContacto::class, 'id', 'dato_contacto_id')->with("datosContactoImagen")->where('activo',1);
    }
}
