<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpinionCongresistaImagen extends Model
{
    use HasFactory;
    protected $fillable = [
        'opinion_congresista_id',
        'imagen',
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
    public function opinionCongresista()
    {
        return $this->hasOne('App\Models\OpinionCongresista', 'id', 'opinion_congresista_id');
    }
}
