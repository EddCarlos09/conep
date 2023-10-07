<?php
    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class GrupoEdad extends Model
    {
        use HasFactory;

        public static $rulesPost         = [
            'nombre'       => 'required|max:50|min:3',
            'edad_inicial' => 'numeric|required',
            'edad_final'   => 'numeric|required',
            'imagen'       => 'required'
        ];
        public static $rulesPostMessages = [
            'nombre.required'       => 'El nombre del grupo de edad es requerido.',
            'nombre.max'            => 'El nombre del grupo de edad no puede ser mayor a :max caracteres.',
            'nombre.min'            => 'El nombre del grupo de edad no puede ser menor a :min caracteres.',
            'edad_inicial.numeric'  => 'La edad inicial debe ser un número.',
            'edad_inicial.required' => 'La edad inicial es requerida.',
            'edad_final.numeric'    => 'La edad final debe ser un número.',
            'edad_final.required'   => 'La edad final es requerida.',
            'imagen.required'       => 'La imagen es requerida'
        ];
        public static $rulesPut          = [
            'nombre'       => 'required|max:50|min:3',
            'edad_inicial' => 'numeric|required',
            'edad_final'   => 'numeric|required'
        ];
        public static $rulesPutMessages  = [
            'nombre.required'       => 'El nombre del grupo de edad es requerido.',
            'nombre.max'            => 'El nombre del grupo de edad no puede ser mayor a :max caracteres.',
            'nombre.min'            => 'El nombre del grupo de edad no puede ser menor a :min caracteres.',
            'edad_inicial.numeric'  => 'La edad inicial debe ser un número.',
            'edad_inicial.required' => 'La edad inicial es requerida.',
            'edad_final.numeric'    => 'La edad final debe ser un número.',
            'edad_final.required'   => 'La edad final es requerida.'
        ];
        protected     $fillable          = [
            'nombre',
            'edad_inicial',
            'edad_final',
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

        public function GrupoEdadImagen()
        {
            return $this->hasMany(GrupoEdadImagen::class)->where(
                'activo',
                1
            );
        }
    }
