<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sucursal extends Model
{
    use HasFactory;

    protected $fillable = [
        'tipo_sucursal_id',
        'empresa_id',
        'nombre',
        'numero_sucursal',
        'pais_id',
        'estado_id',
        'municipio_id',
        'codigo_postal',
        'direccion',
        'latitud',
        'longitud',
        'telefono',
        'email',
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

    public function TipoSucursal(){
        return $this->hasOne(TipoSucursal::class, 'id', 'tipo_sucursal_id')
                    ->where('activo', 1);
    }
}
