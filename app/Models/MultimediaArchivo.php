<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MultimediaArchivo extends Model
{
    use HasFactory;
    protected $fillable = [        
        'archivo',
        'multimedia_id',
        'urlVideo',
        'urlAudio',
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

    public function Multimedia()
    {
        return $this->hasOne('App\Models\Multimedia', 'id', 'multimedia_id');
    }
}
