<?php

namespace App\Http\Controllers\CLIENTAPI;

use App\Http\Controllers\API\LoginController;
use App\Http\Controllers\API\NotificacionController;
use Illuminate\Support\Facades\Route;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');

//Login
Route::post('login', [LoginController::class, 'login']);

// Congresistas
Route::get('congresistas/totalrecords', [CongresistaController::class, 'totalrecords']);
Route::get('congresistas', [CongresistaController::class, 'index']);
Route::get('congresistas/{id}', [CongresistaController::class, 'show']);
Route::get('congresistas/totalrecordsAutoriasByIdCongresista/{id}', [CongresistaController::class, 'totalrecordsAutoriasByIdCongresista']);
Route::get('congresistas/getAutoriasByIdCongresista/{id}', [CongresistaController::class, 'getAutoriasByIdCongresista']);
Route::get('congresistas/totalrecordsPonenciasByIdCongresista/{id}', [CongresistaController::class, 'totalrecordsPonenciasByIdCongresista']);
Route::get('congresistas/getPonenciasByIdCongresista/{id}', [CongresistaController::class, 'getPonenciasByIdCongresista']);
Route::get('congresistas/totalrecordsCitantesByIdCongresista/{id}', [CongresistaController::class, 'totalrecordsCitantesByIdCongresista']);
Route::get('congresistas/getCitantesByIdCongresista/{id}', [CongresistaController::class, 'getCitantesByIdCongresista']);
//CongresoVisible
Route::get('congresoVisible',[CongresoVisibleController::class ,'index']);
Route::get('congresoVisibleEquipo',[CongresoVisibleController::class ,'indexEquipo']);
Route::get('congresoVisibleAliado',[CongresoVisibleController::class ,'indexAliado']);

//Multimedia
Route::get('informesPnud',[MultimediaController::class ,'index']);

//Elecciones
Route::get('elecciones',[EleccionesController::class ,'index']);
Route::get('elecciones/{id}',[EleccionesController::class ,'show']);

//Partido
Route::get('partido',[PartidoController::class ,'index']);
Route::get('partido/{id}',[PartidoController::class ,'show']);

//Comisiones
Route::get('comisions', [ComisionsController::class, 'index']);
Route::get('comisions/totalrecords', [ComisionsController::class, 'totalrecords']);
Route::get('comisions/getControlPoliticoFilter', [ComisionsController::class, 'getControlPoliticoFilter']);
Route::get('comisions/getProyectoLeyFilter', [ComisionsController::class, 'getProyectoLeyFilter']);
Route::get('comisions/getSecretariosFilter', [ComisionsController::class, 'getSecretariosFilter']);
Route::get('comisions/getMiembrosFilter', [ComisionsController::class, 'getMiembrosFilter']);
Route::get('comisions/getAgendaActividad', [ComisionsController::class, 'getAgenda']);
Route::get('comisions/totalrecordsAgendaActividad', [ComisionsController::class, 'totalrecordsAgenda']);
Route::get('comisions/getDataByYearAndMonth', [ComisionsController::class, 'getDataByYearAndMonth']);
Route::get('comisions/{id}', [ComisionsController::class, 'show']);

//Proyectos de ley
Route::get('proyectoley', [ProyectoLeyController::class, 'index']);
Route::get('proyectoley/totalrecords', [ProyectoLeyController::class, 'totalrecords']);
Route::get('proyectoley/getAutoresFilter', [ProyectoLeyController::class, 'getAutoresFilter']);
Route::get('proyectoley/getPonentesFilter', [ProyectoLeyController::class, 'getPonentesFilter']);
Route::get('proyectoley/getCountVotos', [ProyectoLeyController::class, 'getCountVotos']);
Route::get('proyectoley/getRecientesEditados', [ProyectoLeyController::class, 'getRecientesEditados']);
Route::get('proyectoley/{id}', [ProyectoLeyController::class, 'show']);

//Control politico
Route::get('controlpolitico', [ControlPoliticosController::class, 'index']);
Route::get('controlpolitico/getCitantesFilter', [ControlPoliticosController::class, 'getCitantesFilter']);
Route::get('controlpolitico/getCitadosFilter', [ControlPoliticosController::class, 'getCitadosFilter']);
Route::get('controlpolitico/{id}', [ControlPoliticosController::class, 'show']);

//Blog Nuestra Democracia
Route::get('blognd',[BlogNdsController::class ,'index']);
Route::get('blogndultpub',[BlogNdsController::class ,'indexUltimasPublicaciones']);
Route::get('blogndest',[BlogNdsController::class ,'destacadoBlog']);
Route::get('blognd/{id}',[BlogNdsController::class ,'detalleBlog']);
Route::get('blognd/totalrecords', [BlogNdsController::class, 'totalrecords']);
Route::get('blognd/getComboTemaBlog', [BlogNdsController::class, 'getComboTemaBlog']);
Route::get('blognd/getComboTipoPublicacion', [BlogNdsController::class, 'getComboTipoPublicacion']);

// Contenido multimedia
Route::get('contenidomultimedia/totalrecordsInformesPNUD', [ContenidoMultimediaController::class, 'totalrecordsInformesPNUD']);
Route::get('contenidomultimedia/getInformesPNUD', [ContenidoMultimediaController::class, 'getInformesPNUD']);
Route::get('contenidomultimedia/totalrecordsBalanceCuatrienio', [ContenidoMultimediaController::class, 'totalrecordsBalanceCuatrienio']);
Route::get('contenidomultimedia/getBalanceCuatrienio', [ContenidoMultimediaController::class, 'getBalanceCuatrienio']);
Route::get('contenidomultimedia/totalrecordsOpiniones', [ContenidoMultimediaController::class, 'totalrecordsOpiniones']);
Route::get('contenidomultimedia/getOpiniones', [ContenidoMultimediaController::class, 'getOpiniones']);
Route::get('contenidomultimedia/getOpinion/{id}', [ContenidoMultimediaController::class, 'getOpinioneById']);
Route::get('contenidomultimedia/getOpinionCongresista/{id}', [ContenidoMultimediaController::class, 'getOpinioneCongresistaById']);
Route::get('contenidomultimedia/totalrecordsOpinionesCongresistas', [ContenidoMultimediaController::class, 'totalrecordsOpinionesCongresistas']);
Route::get('contenidomultimedia/getOpinionesCongresistas', [ContenidoMultimediaController::class, 'getOpinionesCongresistas']);
Route::get('contenidomultimedia/totalrecordsPodcast', [ContenidoMultimediaController::class, 'totalrecordsPodcast']);
Route::get('contenidomultimedia/getPodcast', [ContenidoMultimediaController::class, 'getPodcast']);
Route::get('contenidomultimedia/totalrecordsMultimedia', [ContenidoMultimediaController::class, 'totalrecordsMultimedia']);
Route::get('contenidomultimedia/getMultimedia', [ContenidoMultimediaController::class, 'getMultimedia']);

// Actividades legislativas
Route::get('actividadeslegislativas/totalrecordsAgenda', [ActividadesLegislativasController::class, 'totalrecordsAgenda']);
Route::get('actividadeslegislativas/getAgenda', [ActividadesLegislativasController::class, 'getAgenda']);
Route::get('actividadeslegislativas/getDetalle/{id}', [ActividadesLegislativasController::class, 'getAgendaDetalle']);
Route::get('actividadeslegislativas/totalrecordsVotaciones', [ActividadesLegislativasController::class, 'totalrecordsVotaciones']);
Route::get('actividadeslegislativas/getVotaciones', [ActividadesLegislativasController::class, 'getVotaciones']);
Route::get('actividadeslegislativas/totalrecordsControlPolitico', [ActividadesLegislativasController::class, 'totalrecordsControlPolitico']);
Route::get('actividadeslegislativas/getControlPolitico', [ActividadesLegislativasController::class, 'getControlPolitico']);
Route::get('actividadeslegislativas/totalrecordsElecciones', [ActividadesLegislativasController::class, 'totalrecordsElecciones']);
Route::get('actividadeslegislativas/getElecciones', [ActividadesLegislativasController::class, 'getElecciones']);
Route::get('actividadeslegislativas/totalrecordsPartidos', [ActividadesLegislativasController::class, 'totalrecordsPartidos']);
Route::get('actividadeslegislativas/getPartidos', [ActividadesLegislativasController::class, 'getPartidos']);
Route::get('actividadeslegislativas/getAgendaActividad', [ActividadesLegislativasController::class, 'getAgendaActividad']);
Route::get('actividadeslegislativas/getDataByYearAndMonth', [ActividadesLegislativasController::class, 'getDataByYearAndMonth']);
Route::get('actividadeslegislativas/totalrecordsAgendaActividad', [ActividadesLegislativasController::class, 'totalrecordsAgendaActividad']);
// Detalle balance cuatrienio
Route::get('balancecuatrienio/{id}',[BalanceCuatrienioController::class ,'detalleBalanceCuatrienio']);
Route::get('balancecuatrienio/getInformeById/{id}',[BalanceCuatrienioController::class ,'getInformeById']);
Route::get('balancecuatrienio/getInformes/{id}',[BalanceCuatrienioController::class ,'getInformes']);
Route::get('balancecuatrienio/totalrecordsInformes/{id}',[BalanceCuatrienioController::class ,'totalrecordsInformes']);

//Informacion del sitio
Route::get('informacionSitio',[InformacionSitioController::class ,'InformacionSitioHome']);
Route::get('slideCongresoVisible',[InformacionSitioController::class ,'slideCongresoVisible']);

// Votaciones
Route::get('votaciones/{id}',[VotacionController::class ,'detalleVotacion']);

// Notificaciones
Route::get('notificacion/get_all/{email}/{limite}', [NotificacionController::class, 'show_all'])->middleware(['jwt.cid:0']);
Route::delete('notificacion/{email}/{proyecto_ley_id}', [NotificacionController::class, 'destroy'])->middleware(['jwt.cid:0']);

// Observaciones Iniciativa
Route::post('observacionesIniciativa', [ObservacionesIniciativaController::class, 'store'])->middleware(['jwt.cid:0']);
Route::put('observacionesIniciativa/{id}', [ObservacionesIniciativaController::class, 'update'])->middleware(['jwt.cid:0']);
Route::get('observacionesIniciativa', [ObservacionesIniciativaController::class, 'index'])->middleware(['jwt.cid:0']);