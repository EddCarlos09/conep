<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VotacionComision extends Model
{
    use HasFactory;

    protected     $fillable          = [
        'votacion_id',
        'corporacion_id',
        'tipo_comision_id',
        'comision_id',
        'activo',
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];

    protected     $hidden            = [
        'usercreated',
        'usermodifed',
        'created_at',
        'updated_at'
    ];

    public function corporacion()
    {
        return $this->hasOne('App\Models\Corporacion', 'id', 'corporacion_id')->where('activo',1);
    }
    public function tipoComision()
    {
        return $this->hasOne('App\Models\TipoComision', 'id', 'tipo_comision_id')->where('activo',1);
    }
    public function comision()
    {
        return $this->hasOne('App\Models\Comision', 'id', 'comision_id')->where('activo',1);
    }
}
