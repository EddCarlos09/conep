<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogNdPortada extends Model
{
    use HasFactory;
    public $table='blog_nd_portadas';
    protected $fillable = [
        'blog_nd_id',
        'portada',
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

    public function blogNd()
    {
        return $this->hasOne('App\Models\BlogNd', 'id', 'blog_nd_id');
    }
}
