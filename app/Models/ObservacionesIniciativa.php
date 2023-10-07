<?php
    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class ObservacionesIniciativa extends Model
    {
        use HasFactory;
        public $table = "observaciones_usuario_proyectos";

        public static $rulesPost         = [
            'email'                 => 'required|max:50|min:3',
            'observacionesIniciativa' => 'required|min:3',
        ];
        public static $rulesPostMessages = [
            'email.required'                 => 'Debe iniciar sesión nuevamente.',
            'email.max'                      => 'Debe iniciar sesión nuevamente.',
            'email.min'                      => 'Debe iniciar sesión nuevamente.',

            'observacionesIniciativa.required'                 => 'La observación es requerida.',
            'observacionesIniciativa.min'                      => 'La observación no puede ser menor a :min caracteres.'
        ];
        public static $rulesPut          = [
            'email'                 => 'required|max:50|min:3',
            'observacionesIniciativa' => 'required|min:3',
        ];
        public static $rulesPutMessages  = [
            'email.required'                 => 'Debe iniciar sesión nuevamente.',
            'email.max'                      => 'Debe iniciar sesión nuevamente.',
            'email.min'                      => 'Debe iniciar sesión nuevamente.',

            'observacionesIniciativa.required'                 => 'La observación es requerida.',
            'observacionesIniciativa.min'                      => 'La observación no puede ser menor a :min caracteres.'
        ];
        protected     $fillable          = [
            'proyecto_ley_id',
            'email',
            'observacionesIniciativa',
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

        public function Usuario()
        {
            return $this->hasOne('App\Models\UsuarioCuenta', 'email', 'email');
        }
    }
