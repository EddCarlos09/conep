<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Rules\CompareFieldGreaterThan;

class PaseLista extends Model
{
    use HasFactory;

    public static function rulesPost () {
        return [
            'fecha' => 'required',
            'legislatura_id' => 'numeric|required|min:0|not_in:0',
            'cuatrienio_id' => 'numeric|required|min:0|not_in:0',
            'corporacion_id' => 'numeric|required|min:0|not_in:0',
            'tipo_pase_lista_id' => 'numeric|required|min:0|not_in:0',

            'tipo_comision_id' => [new CompareFieldGreaterThan('tipo_pase_lista_id', 2, '==', 0, '>', 'El tipo comisión es requerido.')],
            'comision_id' => [new CompareFieldGreaterThan('tipo_pase_lista_id', 2, '==', 0, '>', 'La comisión es requerido.')],
        ];
    }

    public static $rulesPostMessages = [
        'nombre.required' => 'El nombre del grupo de edad es requerido.',

        'legislatura_id.numeric' => 'El tipo legislatura es requerido.',
        'legislatura_id.required' => 'El tipo legislatura es requerido.',
        'legislatura_id.min' => 'El tipo legislatura es requerido.',
        'legislatura_id.not_in' => 'El tipo legislatura es requerido.',

        'cuatrienio_id.numeric' => 'El tipo cuatrienio es requerido.',
        'cuatrienio_id.required' => 'El tipo cuatrienio es requerido.',
        'cuatrienio_id.min' => 'El tipo cuatrienio es requerido.',
        'cuatrienio_id.not_in' => 'El tipo cuatrienio es requerido.',

        'corporacion_id.numeric' => 'El tipo corporación es requerido.',
        'corporacion_id.required' => 'El tipo corporación es requerido.',
        'corporacion_id.min' => 'El tipo corporación es requerido.',
        'corporacion_id.not_in' => 'El tipo corporación es requerido.',

        'tipo_pase_lista_id.numeric' => 'El tipo pase de lista es requerido.',
        'tipo_pase_lista_id.required' => 'El tipo pase de lista es requerido.',
        'tipo_pase_lista_id.min' => 'El tipo pase de lista es requerido.',
        'tipo_pase_lista_id.not_in' => 'El tipo pase de lista es requerido.',
    ];

    public static function rulesPut ()  {
        return [
            'fecha' => 'required',
            'legislatura_id' => 'numeric|required|min:0|not_in:0',
            'cuatrienio_id' => 'numeric|required|min:0|not_in:0',
            'corporacion_id' => 'numeric|required|min:0|not_in:0',
            'tipo_pase_lista_id' => 'numeric|required|min:0|not_in:0',

            'tipo_comision_id' => [new CompareFieldGreaterThan('tipo_pase_lista_id', 2, '==', 0, '>', 'El tipo comisión es requerido.')],
            'comision_id' => [new CompareFieldGreaterThan('tipo_pase_lista_id', 2, '==', 0, '>', 'La comisión es requerido.')],
        ];
    }

    public static $rulesPutMessages = [
        'nombre.required' => 'El nombre del grupo de edad es requerido.',

        'legislatura_id.numeric' => 'El tipo legislatura es requerido.',
        'legislatura_id.required' => 'El tipo legislatura es requerido.',
        'legislatura_id.min' => 'El tipo legislatura es requerido.',
        'legislatura_id.not_in' => 'El tipo legislatura es requerido.',

        'cuatrienio_id.numeric' => 'El tipo cuatrienio es requerido.',
        'cuatrienio_id.required' => 'El tipo cuatrienio es requerido.',
        'cuatrienio_id.min' => 'El tipo cuatrienio es requerido.',
        'cuatrienio_id.not_in' => 'El tipo cuatrienio es requerido.',

        'corporacion_id.numeric' => 'El tipo corporación es requerido.',
        'corporacion_id.required' => 'El tipo corporación es requerido.',
        'corporacion_id.min' => 'El tipo corporación es requerido.',
        'corporacion_id.not_in' => 'El tipo corporación es requerido.',

        'tipo_pase_lista_id.numeric' => 'El tipo pase de lista es requerido.',
        'tipo_pase_lista_id.required' => 'El tipo pase de lista es requerido.',
        'tipo_pase_lista_id.min' => 'El tipo pase de lista es requerido.',
        'tipo_pase_lista_id.not_in' => 'El tipo pase de lista es requerido.',
    ];

    protected $fillable = [
        'fecha',
        'legislatura_id',
        'cuatrienio_id',
        'corporacion_id',
        'tipo_pase_lista_id',
        'tipo_comision_id',
        'comision_id',
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

    public function Legislatura(){
        return $this->hasOne(Legislatura::class, 'id', 'legislatura_id');
    }
    public function Cuatrienio(){
        return $this->hasOne(Cuatrienio::class, 'id', 'cuatrienio_id');
    }
    public function Corporacion(){
        return $this->hasOne(Corporacion::class, 'id', 'corporacion_id');
    }
    public function TipoPaseLista(){
        return $this->hasOne(TipoPaseLista::class, 'id', 'tipo_pase_lista_id');
    }
    public function TipoComision(){
        return $this->hasOne(TipoComision::class, 'id', 'tipo_comision_id');
    }
    public function Comision(){
        return $this->hasOne(Comision::class, 'id', 'comision_id');
    }
    public function PaseListaCongresista(){
        return $this->hasMany(PaseListaCongresista::class)->where('activo', 1)->with('Congresista');
    }
}
