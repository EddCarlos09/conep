<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogNdConcepto extends Model
{
    use HasFactory;

    protected $fillable = [                
        'blog_nd_id',
        'glosario_legislativo_id',
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

    public function glosarioLegislativo()
    {
        return $this->hasMany('App\Models\GlosarioLegislativo', 'id' , 'glosario_legislativo_id')->where('activo',1);
    }

    public function blogNd()
    {
        return $this->hasMany('App\Models\BlogNd', 'id' , 'blog_nd_id')->where('activo',1);
    }
}
