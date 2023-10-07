<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'modulo_id',
        'menu_dependiente_id',
        'nombre_visible',
        'url',
        'visible',
        'orden',
        'class_name',
        'icono',
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

    public function Modulo(){
        return $this->hasOne(Modulo::class, 'id', 'modulo_id')
                    ->where('activo', 1);
    }

    public function MenuDependiente(){
        return $this->hasOne(Menu::class, 'id', 'menu_dependiente_id')
                    ->where('activo', 1);
    }
}
