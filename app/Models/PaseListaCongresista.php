<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaseListaCongresista extends Model
{
    use HasFactory;

    protected $fillable = [
        'pase_lista_id',
        'congresista_id',
        'tipo_respuesta_pase_lista_id',
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

    public function Congresista(){
        return $this->hasOne(Congresista::class, 'id', 'congresista_id');
    }
}
