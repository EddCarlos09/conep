<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SlidePrincipalCv extends Model
{
    use HasFactory;
    protected $fillable = [
        'informacion_sitio_id',  
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
    public function infoSitio(){
        return $this->hasOne('App\Models\InformacionSitio','id','informacion_sitio_id');
    }
}
