<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Podcast extends Model
{
    use HasFactory;
    public $table = "podcasts";
    public static $rulesPost = [
        'titulo' => 'required|max:250|min:3',
        'presentadores' => 'required|max:300|min:3',
        'invitados' => 'required|max:500|min:3',
        'fecha' => 'required',
        'resumen' => 'required|min:3',
        'esEnlace' => 'required',
        'audio' => 'exclude_if:esEnlace,true',
        'urlExterno' => 'exclude_if:esEnlace,false|string|max:300',
        'imagen' => 'required'
    ];
    public static $messagesPost = [
        'titulo.required' => 'El título es requerido.',
        'titulo.max' => 'El título no puede ser mayor a :max caracteres.',
        'titulo.min' => 'El título no puede ser menor a :min caracteres.',

        'presentadores.required' => 'El presentador o presentadores son requeridos.',
        'presentadores.max' => 'El presentador o presentadores no pueden ser mayor a :max caracteres.',
        'presentadores.min' => 'El presentador o presentadores no pueden ser menor a :min caracteres.',

        'invitados.required' => 'El invitado o invitados son requeridos.',
        'invitados.max' => 'El invitado o invitados no pueden ser mayor a :max caracteres.',
        'invitados.min' => 'El invitado o invitados no pueden ser menor a :min caracteres.',

        'fecha.required' => 'La fecha es requerida.',

        'resumen.required' => 'El resumen es requerido.',
        'resumen.min' => 'El resumen no puede ser menor a :min caracteres.',

        'audio.required' => 'El archivo de audio es requerido.',
        'urlExterno.required' => 'La url externa es requerida.',
        'imagen.required' => 'La imagen es requerida.'
    ];

    public static $rulesPut = [
        'titulo' => 'required|max:250|min:3',
        'presentadores' => 'required|max:300|min:3',
        'invitados' => 'required|max:500|min:3',
        'fecha' => 'required',
        'esEnlace' => 'required',
        'urlExterno' => 'required_if:esEnlace,true|string|max:300',
        'resumen' => 'required|min:3'
    ];
    public static $messagesPut = [
        'titulo.required' => 'El título es requerido.',
        'titulo.max' => 'El título no puede ser mayor a :max caracteres.',
        'titulo.min' => 'El título no puede ser menor a :min caracteres.',

        'presentadores.required' => 'El presentador o presentadores son requeridos.',
        'presentadores.max' => 'El presentador o presentadores no pueden ser mayor a :max caracteres.',
        'presentadores.min' => 'El presentador o presentadores no pueden ser menor a :min caracteres.',

        'invitados.required' => 'El invitado o invitados son requeridos.',
        'invitados.max' => 'El invitado o invitados no pueden ser mayor a :max caracteres.',
        'invitados.min' => 'El invitado o invitados no pueden ser menor a :min caracteres.',

        'fecha.required' => 'La fecha es requerida.',

        'resumen.required' => 'El resumen es requerido.',
        'resumen.min' => 'El resumen no puede ser menor a :min caracteres.',
        'urlExterno.required' => 'La url externa es requerida.',
    ];
    
    
    protected $fillable = [
        'titulo',
        'presentadores',
        'invitados',
        'fecha',
        'resumen',
        'urlAudio',
        'esEnlace',
        'urlExterno',
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


    public function podcastImagen()
    {
        return $this->hasMany('App\Models\PodcastImagen')->where('activo',1);
    }
}
