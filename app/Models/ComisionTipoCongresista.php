<?php
    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class ComisionTipoCongresista extends Model
    {
        use HasFactory;

        protected $fillable = [
            'nombre',
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

        public function ComisionCargoCongresista()
        {
            return $this->hasMany(
                ComisionCargoCongresista::class,
                'comision_tipo_congresista_id',
                'id'
            );
        }
    }
