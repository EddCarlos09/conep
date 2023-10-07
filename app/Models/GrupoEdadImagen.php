<?php
    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class GrupoEdadImagen extends Model
    {
        use HasFactory;

        protected $fillable = [
            'grupo_edad_id',
            'imagen',
            'usercreated',
            'activo',
            'usercreated',
            'usermodifed',
            'created_at',
            'updated_at'
        ];
        protected $hidden   = [
            'usercreated',
            'usermodifed',
            'created_at',
            'updated_at'
        ];

        public function GrupoEdad()
        {
            return $this->hasOne(
                GrupoEdad::class,
                'id',
                'grupo_edad_id'
            );
        }
    }


