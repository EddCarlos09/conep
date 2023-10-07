<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpinionImagen extends Model
{
    use HasFactory;
    protected $fillable = [
        'opinion_id',
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

    public function opinion()
    {
        return $this->hasOne('App\Models\Opinion', 'id', 'opinion_id');
    }
}
