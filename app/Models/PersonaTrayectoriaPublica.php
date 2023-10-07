<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonaTrayectoriaPublica extends Model
{
    use HasFactory;

    protected $fillable = [
        'persona_id',
        'partido_id',
        'cargo',
        'fecha',
        'fecha_final',
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

    public function Partido(){
        return $this->hasOne(Partido::class, 'id', 'partido_id')
                    ->select(['id', 'nombre'])
                    ->with("partidoImagen");
    }
}
