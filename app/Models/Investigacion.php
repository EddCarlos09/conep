<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investigacion extends Model
{
    use HasFactory;

    protected     $fillable          = [
        'congresista_id',
        'tipo_investigacion_id',
        'descripcion',
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

    public function congresista()
    {
        return $this->hasOne('App\Models\Congresista', 'id', 'congresista_id')->where('activo',1);
    }
    public function tipoInvestigacion()
    {
        return $this->hasOne('App\Models\TipoInvestigacion', 'id', 'tipo_investigacion_id')->where('activo',1);
    }
}
