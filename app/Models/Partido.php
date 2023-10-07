<?php
    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class Partido extends Model
    {
        use HasFactory;

        public static $rulesPost         = [
            'nombre'                 => 'required|max:200|min:3',
            'imagen'                 => 'required',
        ];
        public static $rulesPostMessages = [
            'nombre.required'                 => 'El nombre del partido es requerido.',
            'nombre.max'                      => 'El nombre del partido no puede ser mayor a :max caracteres.',
            'nombre.min'                      => 'El nombre del partido no puede ser menor a :min caracteres.',
            'imagen.required'                 => 'La imagen es requerida'
        ];
        public static $rulesPut          = [
            'nombre'                 => 'required|max:200|min:3'
        ];
        public static $rulesPutMessages  = [
            'nombre.required'                 => 'El nombre del partido es requerido.',
            'nombre.max'                      => 'El nombre del partido no puede ser mayor a :max caracteres.',
            'nombre.min'                      => 'El nombre del partido no puede ser menor a :min caracteres.'
        ];
        protected     $fillable          = [
            'nombre',
            'activo',
            'usercreated',
            'usermodifed',
            'created_at',
            'updated_at'
        ];
        protected     $hidden            = [
            'usercreated',
            'usermodifed',
            'created_at',
            'updated_at'
        ];

        public function partidoImagen()
        {
            return $this->hasMany('App\Models\PartidoImagen')->where(
                'activo',
                1
            );
        }
    }
