<?php

namespace App\Http\Controllers\API;

use Illuminate\Support\Facades\Route;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');

//Login
Route::post('login', [LoginController::class, 'login']);

//Partidos
Route::get('partidos/totalrecords', [PartidosController::class, 'totalrecords'])->middleware(['jwt.cid:147']);
Route::get('partidos', [PartidosController::class, 'index'])->middleware(['jwt.cid:147']);
Route::post('partidos', [PartidosController::class, 'store'])->middleware(['jwt.cid:143']);
Route::get('partidos/{id}', [PartidosController::class, 'show'])->middleware(['jwt.cid:146']);
Route::put('partidos/{id}', [PartidosController::class, 'update'])->middleware(['jwt.cid:144']);
Route::delete('partidos/{id}', [PartidosController::class, 'destroy'])->middleware(['jwt.cid:145']);
Route::post('archivos', [PartidosController::class, 'archivos'])->middleware(['jwt.cid:0']);

//DatosContacto
Route::post('datoscontactos', [DatosContactosController::class, 'store'])->middleware(['jwt.cid:161']);
Route::put('datoscontactos/{id}', [DatosContactosController::class, 'update'])->middleware(['jwt.cid:162']);
Route::delete('datoscontactos/{id}', [DatosContactosController::class, 'destroy'])->middleware(['jwt.cid:163']);
Route::get('datoscontactos/{id}', [DatosContactosController::class, 'show'])->middleware(['jwt.cid:164']);
Route::get('datoscontactos', [DatosContactosController::class, 'index'])->middleware(['jwt.cid:165']);

//GrupoDeEdad
Route::get('grupoEdad/totalrecords', [GrupoEdadController::class, 'totalrecords'])->middleware(['jwt.cid:0']);
Route::post('grupoEdad', [GrupoEdadController::class, 'store'])->middleware(['jwt.cid:197']);
Route::put('grupoEdad/{id}', [GrupoEdadController::class, 'update'])->middleware(['jwt.cid:198']);
Route::delete('grupoEdad/{id}', [GrupoEdadController::class, 'destroy'])->middleware(['jwt.cid:199']);
Route::get('grupoEdad/{id}', [GrupoEdadController::class, 'show'])->middleware(['jwt.cid:200']);
Route::get('grupoEdad', [GrupoEdadController::class, 'index'])->middleware(['jwt.cid:201']);

//Circunscripcion
Route::get('circunscripcion/totalrecords', [CircunscripcionController::class, 'totalrecords'])->middleware(['jwt.cid:0']);
Route::post('circunscripcion', [CircunscripcionController::class, 'store'])->middleware(['jwt.cid:203']);
Route::put('circunscripcion/{id}', [CircunscripcionController::class, 'update'])->middleware(['jwt.cid:204']);
Route::delete('circunscripcion/{id}', [CircunscripcionController::class, 'destroy'])->middleware(['jwt.cid:205']);
Route::get('circunscripcion/{id}', [CircunscripcionController::class, 'show'])->middleware(['jwt.cid:206']);
Route::get('circunscripcion', [CircunscripcionController::class, 'index'])->middleware(['jwt.cid:207']);

//TipoComisions
Route::get('tipocomisions', [TipoComisionsController::class, 'index']);

//Géneros
Route::post('generos', [GenerosController::class, 'store'])->middleware(['jwt.cid:185']);
Route::put('generos/{id}', [GenerosController::class, 'update'])->middleware(['jwt.cid:186']);
Route::delete('generos/{id}', [GenerosController::class, 'destroy'])->middleware(['jwt.cid:187']);
Route::get('generos/{id}', [GenerosController::class, 'show'])->middleware(['jwt.cid:188']);
Route::get('generos', [GenerosController::class, 'index'])->middleware(['jwt.cid:189']);

//cargoLegislativo
Route::get('cargoLegislativo/totalrecords', [CargoLegislativoController::class, 'totalrecords'])->middleware(['jwt.cid:213']);
Route::get('cargoLegislativo', [CargoLegislativoController::class, 'index'])->middleware(['jwt.cid:213']);
Route::post('cargoLegislativo', [CargoLegislativoController::class, 'store'])->middleware(['jwt.cid:209']);
Route::get('cargoLegislativo/{id}', [CargoLegislativoController::class, 'show'])->middleware(['jwt.cid:212']);
Route::put('cargoLegislativo/{id}', [CargoLegislativoController::class, 'update'])->middleware(['jwt.cid:210']);
Route::delete('cargoLegislativo/{id}', [CargoLegislativoController::class, 'destroy'])->middleware(['jwt.cid:211']);

//Utils
Route::get('utils/getComboDatosContacto', [UtilsController::class, 'getComboDatosContacto']);
Route::get('utils/getComboComisionTipoCongresista', [UtilsController::class, 'getComboComisionTipoCongresista']);
Route::get('utils/getComboGeneros', [UtilsController::class, 'getComboGeneros']);
Route::get('utils/getComboCuatrienio', [UtilsController::class, 'getComboCuatrienio']);
Route::get('utils/getComboPartido', [UtilsController::class, 'getComboPartido']);
Route::get('utils/getComboPartidoPorCongresistaEnComision', [UtilsController::class, 'getComboPartidoPorCongresistaEnComision']);
Route::get('utils/getComboPartidoPorCongresistaEnProyecto', [UtilsController::class, 'getComboPartidoPorCongresistaEnProyecto']);
Route::get('utils/getComboCorporacion', [UtilsController::class, 'getComboCorporacion']);
Route::get('utils/getComboTipoComision', [UtilsController::class, 'getComboTipoComision']);
Route::get('utils/getComboGradoEstudio', [UtilsController::class, 'getComboGradoEstudio']);
Route::get('utils/getComboCargoCongresista', [UtilsController::class, 'getComboCargoCongresista']);
Route::get('utils/getComboCargoMiembrosCongresista', [UtilsController::class, 'getComboCargoMiembrosCongresista']);
Route::get('utils/getComboCargoMesaDirectivaCongresista', [UtilsController::class, 'getComboCargoMesaDirectivaCongresista']);
Route::get('utils/getComboCongresistasComision', [UtilsController::class, 'getComboCongresistasComision']);
Route::get('utils/getComboSecretariosComision', [UtilsController::class, 'getComboSecretariosComision']);
Route::get('utils/getComboCongresistas', [UtilsController::class, 'getComboCongresistas']);
Route::get('utils/getComboCongresistaByType', [UtilsController::class, 'getComboCongresistaByType']);
Route::get('utils/getDataCuruls', [UtilsController::class, 'getDataCuruls']);
Route::get('utils/getCurules', [UtilsController::class, 'getCurules']);
Route::get('utils/getCurulesInVotacion', [UtilsController::class, 'getCurulesInVotacion']);
Route::get('utils/getComboNivelBlog', [UtilsController::class, 'getComboNivelBlog']);
Route::get('utils/getComboTemaBlog', [UtilsController::class, 'getComboTemaBlog']);
Route::get('utils/getComboComisiones', [UtilsController::class, 'getComboComisiones']);
Route::get('utils/getComboLegislatura', [UtilsController::class, 'getComboLegislatura']);
Route::get('utils/getComboEstadoControlPolitico', [UtilsController::class, 'getComboEstadoControlPolitico']);
Route::post('utils/getComboTemaFilter', [UtilsController::class, 'getComboTemaFilter']);
Route::get('utils/getComboEquipoCV', [UtilsController::class, 'getComboEquipoCV']);
Route::get('utils/getComboEquipoCVByType', [UtilsController::class, 'getComboEquipoCVByType']);
Route::get('utils/getComboBalanceCuatrienioYearInicio', [UtilsController::class, 'getComboBalanceCuatrienioYearInicio']);
Route::get('utils/getComboTipoPublicacion', [UtilsController::class, 'getComboTipoPublicacion']);
Route::get('utils/getComboGlosarioLegislativo', [UtilsController::class, 'getComboGlosarioLegislativo']);
Route::get('utils/getComboGlosarioLegislativoByType', [UtilsController::class, 'getComboGlosarioLegislativoByType']);
Route::get('utils/getComboTipoProyecto', [UtilsController::class, 'getComboTipoProyecto']);
Route::get('utils/getComboTipoCitacion', [UtilsController::class, 'getComboTipoCitacion']);
Route::get('utils/getComboEstadoProyecto', [UtilsController::class, 'getComboEstadoProyecto']);
Route::get('utils/getComboCargoIntegrante',[UtilsController::class,'getComboCargoIntegrante']);
Route::post('utils/getComboTipoComisionFilter',[UtilsController::class,'getComboTipoComisionFilter']);
Route::post('utils/getCongresistasFilter',[UtilsController::class,'getCongresistasFilter']);
Route::post('utils/getAutoresOtrosFilter',[UtilsController::class,'getAutoresOtrosFilter']);
Route::post('utils/getComboComisionesFilter',[UtilsController::class,'getComboComisionesFilter']);
Route::get('utils/getComboTipoMultimedia',[UtilsController::class,'getComboTipoMultimedia']);
Route::post('utils/getComboTipoPublicacionProyectoLeyFilter',[UtilsController::class,'getComboTipoPublicacionProyectoLeyFilter']);
Route::post('utils/getComboIniciativaFilter',[UtilsController::class,'getComboIniciativaFilter']);
Route::post('utils/getComboTipoFechaProyectoLeyFilter',[UtilsController::class,'getComboTipoFechaProyectoLeyFilter']);
Route::post('utils/getComboTemaProyectoLeyFilter',[UtilsController::class,'getComboTemaProyectoLeyFilter']);
Route::get('utils/getComboGenero',[UtilsController::class,'getComboGenero']);
Route::get('utils/getComboCircunscripcion',[UtilsController::class,'getComboCircunscripcion']);
Route::get('utils/getComboTipoActividadAgenda',[UtilsController::class,'getComboTipoActividadAgenda']);
Route::post('utils/getComboLegislaturaFilter',[UtilsController::class,'getComboLegislaturaFilter']);
Route::post('utils/getComboComisionMiembro',[UtilsController::class,'getComboComisionMiembro']);
Route::get('utils/getComboProyectosDeLeyByLegislaturaCuatrienio',[UtilsController::class,'getComboProyectosDeLeyByLegislaturaCuatrienio']);
Route::get('utils/getComboGruposEdad',[UtilsController::class,'getComboGruposEdad']);
Route::get('utils/getComboTipoRespuestaVotacion',[UtilsController::class,'getComboTipoRespuestaVotacion']);
Route::get('utils/getControlPoliticoFilter',[UtilsController::class,'getControlPoliticoFilter']);
Route::post('utils/getComboTemaControlPoliticoFilter',[UtilsController::class,'getComboTemaControlPoliticoFilter']);
Route::post('utils/getComboMunicipioFilter',[UtilsController::class,'getComboMunicipioFilter']);
Route::post('utils/getComboProfesionFilter',[UtilsController::class,'getComboProfesionFilter']);
Route::post('utils/getComboGeneroFilter',[UtilsController::class,'getComboGeneroFilter']);
Route::post('utils/getComboGradoEstudioFilter',[UtilsController::class,'getComboGradoEstudioFilter']);
Route::post('utils/getComboPartidoFilter',[UtilsController::class,'getComboPartidoFilter']);
Route::post('utils/getComboDepartamentoFilter',[UtilsController::class,'getComboDepartamentoFilter']);
Route::get('utils/getComboDepartamento',[UtilsController::class,'getComboDepartamento']);
Route::get('utils/getComboCargoLegislativo',[UtilsController::class,'getComboCargoLegislativo']);
Route::get('utils/getComboTipoInvestigacion',[UtilsController::class,'getComboTipoInvestigacion']);
Route::get('utils/getAllPersonasNoCongresistas',[UtilsController::class,'getAllPersonasNoCongresistas']);
Route::get('utils/totalrecordsPersonasNoCongresistas',[UtilsController::class,'totalrecordsPersonasNoCongresistas']);
Route::post('utils/getComboAlcanceFilter',[UtilsController::class,'getComboAlcanceFilter']);
Route::get('utils/getComboPersonas',[UtilsController::class,'getComboPersonas']);
Route::get('utils/getComboTipoVotacion',[UtilsController::class,'getComboTipoVotacion']);
Route::get('utils/getComboClaseVotacion',[UtilsController::class,'getComboClaseVotacion']);
Route::get('utils/totalrecordsComboPersonas',[UtilsController::class,'totalrecordsComboPersonas']);
Route::get('utils/getComboAlcanceFilter',[UtilsController::class,'getComboAlcanceFilter']);
Route::post('utils/getProyectoLeyFilter',[UtilsController::class,'getProyectoLeyFilter']);
Route::get('utils/getAllProyectosLeySearch',[UtilsController::class,'getAllProyectosLeySearch']);
Route::get('utils/getAllProyectosLeySearchtotalrecords',[UtilsController::class,'getAllProyectosLeySearchtotalrecords']);
Route::get('utils/getEstadosByProyectoId',[UtilsController::class,'getEstadosByProyectoId']);
Route::post('utils/getProyectoLeyFilterTotalRecords',[UtilsController::class,'getProyectoLeyFilterTotalRecords']);
Route::post('utils/getComisionFilterPagination',[UtilsController::class,'getComisionFilterPagination']);
Route::post('utils/getComisionFilterPaginationTotalRecord',[UtilsController::class,'getComisionFilterPaginationTotalRecord']);
Route::post('utils/getPonenteFilterPagination',[UtilsController::class,'getPonenteFilterPagination']);
Route::post('utils/getPonenteFilterPaginationTotalRecord',[UtilsController::class,'getPonenteFilterPaginationTotalRecord']);
Route::post('utils/getAutorFilterPagination',[UtilsController::class,'getAutorFilterPagination']);
Route::post('utils/getAutorFilterPaginationTotalRecord',[UtilsController::class,'getAutorFilterPaginationTotalRecord']);

//Departamento
Route::get('departamento/totalrecords', [DepartamentosController::class, 'totalrecords'])->middleware(['jwt.cid:0']);
Route::post('departamento', [DepartamentosController::class, 'store'])->middleware(['jwt.cid:173']);
Route::put('departamento/{id}', [DepartamentosController::class, 'update'])->middleware(['jwt.cid:174']);
Route::delete('departamento/{id}', [DepartamentosController::class, 'destroy'])->middleware(['jwt.cid:175']);
Route::get('departamento/{id}', [DepartamentosController::class, 'show'])->middleware(['jwt.cid:176']);
Route::get('departamento', [DepartamentosController::class, 'index'])->middleware(['jwt.cid:177']);

//GradoEstudios
Route::post('gradoestudio', [GradoEstudiosController::class, 'store'])->middleware(['jwt.cid:191']);
Route::put('gradoestudio/{id}', [GradoEstudiosController::class, 'update'])->middleware(['jwt.cid:192']);
Route::delete('gradoestudio/{id}', [GradoEstudiosController::class, 'destroy'])->middleware(['jwt.cid:193']);
Route::get('gradoestudio/{id}', [GradoEstudiosController::class, 'show'])->middleware(['jwt.cid:194']);
Route::get('gradoestudio', [GradoEstudiosController::class, 'index'])->middleware(['jwt.cid:195']);
//GradoEstudios
Route::post('profesion', [ProfesionController::class, 'store'])->middleware(['jwt.cid:346']);
Route::put('profesion/{id}', [ProfesionController::class, 'update'])->middleware(['jwt.cid:347']);
Route::delete('profesion/{id}', [ProfesionController::class, 'destroy'])->middleware(['jwt.cid:348']);
Route::get('profesion/{id}', [ProfesionController::class, 'show'])->middleware(['jwt.cid:349']);
Route::get('profesion', [ProfesionController::class, 'index'])->middleware(['jwt.cid:350']);

//Cuatrienios
Route::post('cuatrienios', [CuatrieniosController::class, 'store'])->middleware(['jwt.cid:167']);
Route::put('cuatrienios/{id}', [CuatrieniosController::class, 'update'])->middleware(['jwt.cid:168']);
Route::delete('cuatrienios/{id}', [CuatrieniosController::class, 'destroy'])->middleware(['jwt.cid:169']);
Route::get('cuatrienios/{id}', [CuatrieniosController::class, 'show'])->middleware(['jwt.cid:170']);
Route::get('cuatrienios', [CuatrieniosController::class, 'index'])->middleware(['jwt.cid:171']);

//Geografía
Route::get('geografia/totalrecords', [GeografiaController::class, 'totalrecords'])->middleware(['jwt.cid:183']);
Route::get('geografia', [GeografiaController::class, 'index'])->middleware(['jwt.cid:183']);
Route::post('geografia', [GeografiaController::class, 'store'])->middleware(['jwt.cid:179']);
Route::get('geografia/{id}', [GeografiaController::class, 'show'])->middleware(['jwt.cid:182']);
Route::put('geografia/{id}', [GeografiaController::class, 'update'])->middleware(['jwt.cid:180']);
Route::delete('geografia/{id}', [GeografiaController::class, 'destroy'])->middleware(['jwt.cid:181']);

//Iniciativas
Route::get('iniciativas/totalrecords', [IniciativasController::class, 'totalrecords'])->middleware(['jwt.cid:0']);
Route::post('iniciativas', [IniciativasController::class, 'store'])->middleware(['jwt.cid:227']);
Route::put('iniciativas/{id}', [IniciativasController::class, 'update'])->middleware(['jwt.cid:228']);
Route::delete('iniciativas/{id}', [IniciativasController::class, 'destroy'])->middleware(['jwt.cid:229']);
Route::get('iniciativas/{id}', [IniciativasController::class, 'show'])->middleware(['jwt.cid:230']);
Route::get('iniciativas', [IniciativasController::class, 'index'])->middleware(['jwt.cid:231']);

//Legislaturas
Route::post('legislaturas', [LegislaturasController::class, 'store'])->middleware(['jwt.cid:233']);
Route::put('legislaturas/{id}', [LegislaturasController::class, 'update'])->middleware(['jwt.cid:234']);
Route::delete('legislaturas/{id}', [LegislaturasController::class, 'destroy'])->middleware(['jwt.cid:235']);
Route::get('legislaturas/{id}', [LegislaturasController::class, 'show'])->middleware(['jwt.cid:236']);
Route::get('legislaturas', [LegislaturasController::class, 'index'])->middleware(['jwt.cid:237']);

//Temas
Route::get('temaproyectoleys', [TemasController::class, 'index'])->middleware(['jwt.cid:243']);
Route::post('temaproyectoleys', [TemasController::class, 'store'])->middleware(['jwt.cid:239']);
Route::get('temaproyectoleys/{id}', [TemasController::class, 'show'])->middleware(['jwt.cid:242']);
Route::put('temaproyectoleys/{id}', [TemasController::class, 'update'])->middleware(['jwt.cid:240']);
Route::delete('temaproyectoleys/{id}', [TemasController::class, 'destroy'])->middleware(['jwt.cid:241']);

//EstadoProyectosLeys
Route::get('estadoproyectoleys', [EstadoProyectoLeysController::class, 'index'])->middleware(['jwt.cid:225']);
Route::post('estadoproyectoleys', [EstadoProyectoLeysController::class, 'store'])->middleware(['jwt.cid:221']);
Route::get('estadoproyectoleys/{id}', [EstadoProyectoLeysController::class, 'show'])->middleware(['jwt.cid:224']);
Route::put('estadoproyectoleys/{id}', [EstadoProyectoLeysController::class, 'update'])->middleware(['jwt.cid:222']);
Route::delete('estadoproyectoleys/{id}', [EstadoProyectoLeysController::class, 'destroy'])->middleware(['jwt.cid:223']);

// Congresistas
Route::get('congresistas/totalrecords', [CongresistaController::class, 'totalrecords'])->middleware(['jwt.cid:58']);
Route::get('congresistas', [CongresistaController::class, 'index'])->middleware(['jwt.cid:58']);
Route::post('congresistas', [CongresistaController::class, 'store'])->middleware(['jwt.cid:53']);
Route::get('congresistas/{id}', [CongresistaController::class, 'show'])->middleware(['jwt.cid:56']);
Route::put('congresistas/{id}', [CongresistaController::class, 'update'])->middleware(['jwt.cid:54']);
Route::delete('congresistas/{id}', [CongresistaController::class, 'destroy'])->middleware(['jwt.cid:55']);
Route::post('congresistas/getCongresistas', [CongresistaController::class, 'getCongresistas'])->middleware(['jwt.cid:0']);

//Comision
Route::get('comisions/totalrecords', [ComisionsController::class, 'totalrecords'])->middleware(['jwt.cid:64']);
Route::get('comisions', [ComisionsController::class, 'index'])->middleware(['jwt.cid:64']);
Route::post('comisions', [ComisionsController::class, 'store'])->middleware(['jwt.cid:59']);
Route::get('comisions/{id}', [ComisionsController::class, 'show'])->middleware(['jwt.cid:62']);
Route::put('comisions/{id}', [ComisionsController::class, 'update'])->middleware(['jwt.cid:60']);
Route::delete('comisions/{id}', [ComisionsController::class, 'destroy'])->middleware(['jwt.cid:61']);
Route::post('comisions/getCongresistas', [ComisionsController::class, 'getCongresistas'])->middleware(['jwt.cid:0']);

//Tipopublicacionproyectoley
Route::get('tipopublicacionproyectoleys', [TipoPublicacionProyectoLeysController::class, 'index'])->middleware(['jwt.cid:255']);
Route::post('tipopublicacionproyectoleys', [TipoPublicacionProyectoLeysController::class, 'store'])->middleware(['jwt.cid:251']);
Route::get('tipopublicacionproyectoleys/{id}', [TipoPublicacionProyectoLeysController::class, 'show'])->middleware(['jwt.cid:254']);
Route::put('tipopublicacionproyectoleys/{id}', [TipoPublicacionProyectoLeysController::class, 'update'])->middleware(['jwt.cid:252']);
Route::delete('tipopublicacionproyectoleys/{id}', [TipoPublicacionProyectoLeysController::class, 'destroy'])->middleware(['jwt.cid:253']);

//Tipofechaproyectoley
Route::get('tipofechaproyectoleys', [TipoFechaProyectoLeysController::class, 'index'])->middleware(['jwt.cid:261']);
Route::post('tipofechaproyectoleys', [TipoFechaProyectoLeysController::class, 'store'])->middleware(['jwt.cid:257']);
Route::get('tipofechaproyectoleys/{id}', [TipoFechaProyectoLeysController::class, 'show'])->middleware(['jwt.cid:260']);
Route::put('tipofechaproyectoleys/{id}', [TipoFechaProyectoLeysController::class, 'update'])->middleware(['jwt.cid:258']);
Route::delete('tipofechaproyectoleys/{id}', [TipoFechaProyectoLeysController::class, 'destroy'])->middleware(['jwt.cid:259']);

//EstadoControlPolitico
Route::get('estadoControlPolitico/totalrecords', [EstadoControlPoliticoController::class, 'totalrecords'])->middleware(['jwt.cid:267']);
Route::get('estadoControlPolitico', [EstadoControlPoliticoController::class, 'index'])->middleware(['jwt.cid:267']);
Route::post('estadoControlPolitico', [EstadoControlPoliticoController::class, 'store'])->middleware(['jwt.cid:263']);
Route::get('estadoControlPolitico/{id}', [EstadoControlPoliticoController::class, 'show'])->middleware(['jwt.cid:266']);
Route::put('estadoControlPolitico/{id}', [EstadoControlPoliticoController::class, 'update'])->middleware(['jwt.cid:264']);
Route::delete('estadoControlPolitico/{id}', [EstadoControlPoliticoController::class, 'destroy'])->middleware(['jwt.cid:265']);

//GlosarioLegislativo
Route::get('glosarioLegislativo/totalrecords', [GlosarioLegislativoController::class, 'totalrecords'])->middleware(['jwt.cid:0']);
Route::post('glosarioLegislativo', [GlosarioLegislativoController::class, 'store'])->middleware(['jwt.cid:269']);
Route::put('glosarioLegislativo/{id}', [GlosarioLegislativoController::class, 'update'])->middleware(['jwt.cid:270']);
Route::delete('glosarioLegislativo/{id}', [GlosarioLegislativoController::class, 'destroy'])->middleware(['jwt.cid:271']);
Route::get('glosarioLegislativo/{id}', [GlosarioLegislativoController::class, 'show'])->middleware(['jwt.cid:272']);
Route::get('glosarioLegislativo', [GlosarioLegislativoController::class, 'index'])->middleware(['jwt.cid:273']);

//NivelDificultadBlogNd
Route::get('nivelDificultadBlogNd/totalrecords', [NivelDificultadBlogNdController::class, 'totalrecords']);
Route::get('nivelDificultadBlogNd', [NivelDificultadBlogNdController::class, 'index']);
Route::post('nivelDificultadBlogNd', [NivelDificultadBlogNdController::class, 'store']);
Route::get('nivelDificultadBlogNd/{id}', [NivelDificultadBlogNdController::class, 'show']);
Route::put('nivelDificultadBlogNd/{id}', [NivelDificultadBlogNdController::class, 'update']);
Route::delete('nivelDificultadBlogNd/{id}', [NivelDificultadBlogNdController::class, 'destroy']);

//TemaBlogNd
Route::get('temaBlogNd/totalrecords', [TemaBlogNdController::class, 'totalrecords']);
Route::get('temaBlogNd', [TemaBlogNdController::class, 'index']);
Route::post('temaBlogNd', [TemaBlogNdController::class, 'store']);
Route::get('temaBlogNd/{id}', [TemaBlogNdController::class, 'show']);
Route::put('temaBlogNd/{id}', [TemaBlogNdController::class, 'update']);
Route::delete('temaBlogNd/{id}', [TemaBlogNdController::class, 'destroy']);

//Corporación
Route::get('corporacions', [CorporacionsController::class, 'index'])->middleware(['jwt.cid:291']);;
Route::get('corporacions/{id}', [CorporacionsController::class, 'show'])->middleware(['jwt.cid:290']);;
Route::put('corporacions/{id}', [CorporacionsController::class, 'update'])->middleware(['jwt.cid:288']);;
Route::delete('corporacions/{id}', [CorporacionsController::class, 'destroy'])->middleware(['jwt.cid:289']);;

//TipoActividadAgendaLegislativa
Route::get('tipoActividadAgendaLegislativa/totalrecords', [TipoActividadAgendaLegislativaController::class, 'totalrecords']);
Route::get('tipoActividadAgendaLegislativa', [TipoActividadAgendaLegislativaController::class, 'index']);
Route::post('tipoActividadAgendaLegislativa', [TipoActividadAgendaLegislativaController::class, 'store']);
Route::get('tipoActividadAgendaLegislativa/{id}', [TipoActividadAgendaLegislativaController::class, 'show']);
Route::put('tipoActividadAgendaLegislativa/{id}', [TipoActividadAgendaLegislativaController::class, 'update']);
Route::delete('tipoActividadAgendaLegislativa/{id}', [TipoActividadAgendaLegislativaController::class, 'destroy']);

//BlogNd
Route::get('utils/getComboBlogNdAnno', [UtilsController::class, 'getComboBlogNdAnno'])->middleware(['jwt.cid:0']);
Route::get('blogNd/totalrecords', [BlogNdsController::class, 'totalrecords'])->middleware(['jwt.cid:76']);
Route::get('blogNd', [BlogNdsController::class, 'index'])->middleware(['jwt.cid:76']);
Route::post('blogNd', [BlogNdsController::class, 'store'])->middleware(['jwt.cid:71']);
Route::get('blogNd/{id}', [BlogNdsController::class, 'show'])->middleware(['jwt.cid:74']);
Route::put('blogNd/{id}', [BlogNdsController::class, 'update'])->middleware(['jwt.cid:72']);
Route::delete('blogNd/{id}', [BlogNdsController::class, 'destroy'])->middleware(['jwt.cid:73']);

// Votaciones
Route::get('votacion/totalrecords', [VotacionController::class, 'totalrecords'])->middleware(['jwt.cid:153']);
Route::get('votacion', [VotacionController::class, 'index'])->middleware(['jwt.cid:153']);
Route::post('votacion', [VotacionController::class, 'store'])->middleware(['jwt.cid:149']);
Route::get('votacion/{id}', [VotacionController::class, 'show'])->middleware(['jwt.cid:152']);
Route::put('votacion/{id}', [VotacionController::class, 'update'])->middleware(['jwt.cid:150']);
Route::delete('votacion/{id}', [VotacionController::class, 'destroy'])->middleware(['jwt.cid:151']);
Route::get('votacion/votar/{id}', [VotacionController::class, 'showVotar'])->middleware(['jwt.cid:0']);
Route::put('votacion/updateVotaciones/{id}', [VotacionController::class, 'updateVotaciones'])->middleware(['jwt.cid:0']);

//Tipo citación
Route::get('tipoCitacions', [TipoCitacionsController::class, 'index'])->middleware(['jwt.cid:297']);
Route::post('tipoCitacions', [TipoCitacionsController::class, 'store'])->middleware(['jwt.cid:293']);
Route::get('tipoCitacions/{id}', [TipoCitacionsController::class, 'show'])->middleware(['jwt.cid:296']);
Route::put('tipoCitacions/{id}', [TipoCitacionsController::class, 'update'])->middleware(['jwt.cid:294']);
Route::delete('tipoCitacions/{id}', [TipoCitacionsController::class, 'destroy'])->middleware(['jwt.cid:295']);

//Pase de lista
Route::get('paseLista/totalrecords', [PaseListaController::class, 'totalrecords']);
Route::get('paseLista', [PaseListaController::class, 'index']);
Route::post('paseLista', [PaseListaController::class, 'store']);
Route::get('paseLista/{id}', [PaseListaController::class, 'show']);
Route::put('paseLista/{id}', [PaseListaController::class, 'update']);
Route::delete('paseLista/{id}', [PaseListaController::class, 'destroy']);
Route::get('paseLista/getPaseListaCongresistas', [PaseListaController::class, 'getPaseListaCongresistas']);

//Congreso Visible
Route::get('congresoVisible',[CongresoVisibleController::class,'index'])->middleware(['jwt.cid:81']);
Route::get('congresoVisible/{id}',[CongresoVisibleController::class,'show'])->middleware(['jwt.cid:80']);
Route::put('congresoVisible/{id}', [CongresoVisibleController::class, 'update'])->middleware(['jwt.cid:78']);

Route::get('congresoVisibleEquipo',[CongresoVisibleController::class,'indexEquipos'])->middleware(['jwt.cid:323']);
Route::get('congresoVisibleEquipo/{id}',[CongresoVisibleController::class,'showEquipo'])->middleware(['jwt.cid:325']);
Route::post('congresoVisibleEquipo', [CongresoVisibleController::class, 'storeEquipo'])->middleware(['jwt.cid:324']);
Route::put('congresoVisibleEquipo/{id}', [CongresoVisibleController::class,'updateEquipo'])->middleware(['jwt.cid:326']);
Route::delete('congresoVisibleEquipo/{id}', [CongresoVisibleController::class,'destroyEquipo'])->middleware(['jwt.cid:327']);

Route::get('congresoVisibleAliado',[CongresoVisibleController::class,'indexAliados'])->middleware(['jwt.cid:335']);
Route::get('congresoVisibleAliado/{id}',[CongresoVisibleController::class,'showAliado'])->middleware(['jwt.cid:337']);
Route::post('congresoVisibleAliado', [CongresoVisibleController::class, 'storeAliado'])->middleware(['jwt.cid:336']);
Route::put('congresoVisibleAliado/{id}', [CongresoVisibleController::class,'updateAliado'])->middleware(['jwt.cid:338']);
Route::delete('congresoVisibleAliado/{id}', [CongresoVisibleController::class,'destroyAliado'])->middleware(['jwt.cid:339']);

Route::get('congresoVisibleEquipoIntegrante',[CongresoVisibleController::class,'indexIntegrante'])->middleware(['jwt.cid:329']);
Route::get('congresoVisibleEquipoIntegrante/{id}',[CongresoVisibleController::class,'showIntegrante'])->middleware(['jwt.cid:331']);
Route::post('congresoVisibleEquipoIntegrante',[CongresoVisibleController::class,'storeIntegrante'])->middleware(['jwt.cid:330']);
Route::put('congresoVisibleEquipoIntegrante/{id}', [CongresoVisibleController::class,'updateIntegrante'])->middleware(['jwt.cid:332']);
Route::delete('congresoVisibleEquipoIntegrante/{id}', [CongresoVisibleController::class,'destroyIntegrante'])->middleware(['jwt.cid:333']);

//Congreso Visible
Route::post('cargoIntegrante',[CargoIntegranteController::class,'store'])->middleware(['jwt.cid:215']);
Route::put('cargoIntegrante/{id}', [CargoIntegranteController::class,'update'])->middleware(['jwt.cid:216']);
Route::delete('cargoIntegrante/{id}', [CargoIntegranteController::class,'destroy'])->middleware(['jwt.cid:217']);
Route::get('cargoIntegrante/{id}',[CargoIntegranteController::class,'show'])->middleware(['jwt.cid:218']);
Route::get('cargoIntegrante',[CargoIntegranteController::class,'index'])->middleware(['jwt.cid:219']);

//Proyecto de ley
Route::get('proyectoLey/totalrecords', [ProyectoLeyController::class, 'totalrecords'])->middleware(['jwt.cid:0']);
Route::get('proyectoLey/totalrecordsDocumento', [ProyectoLeyController::class, 'totalrecordsDocumento'])->middleware(['jwt.cid:69']);
Route::get('proyectoLey/getAllDocumentos', [ProyectoLeyController::class, 'indexDocumentos'])->middleware(['jwt.cid:69']);
Route::post('proyectoLey/storeDocumento', [ProyectoLeyController::class, 'storeDocumento'])->middleware(['jwt.cid:65']);
Route::post('proyectoLey', [ProyectoLeyController::class, 'store'])->middleware(['jwt.cid:65']);
Route::put('proyectoLey/{id}', [ProyectoLeyController::class, 'update'])->middleware(['jwt.cid:66']);
Route::delete('proyectoLey/{id}', [ProyectoLeyController::class, 'destroy'])->middleware(['jwt.cid:67']);
Route::delete('proyectoLey/deleteDocumento/{id}', [ProyectoLeyController::class, 'destroyDocumento'])->middleware(['jwt.cid:69']);
Route::patch('proyectoLey/{id}', [ProyectoLeyController::class, 'setLey'])->middleware(['jwt.cid:67']);
Route::get('proyectoLey/{id}', [ProyectoLeyController::class, 'show'])->middleware(['jwt.cid:68']);
Route::get('proyectoLey', [ProyectoLeyController::class, 'index'])->middleware(['jwt.cid:69']);

//ControlPolitico
Route::get('controlPolitico/totalrecords', [ControlPoliticosController::class, 'totalrecords']);
Route::get('controlPolitico', [ControlPoliticosController::class, 'index']);
Route::post('controlPolitico', [ControlPoliticosController::class, 'store']);
Route::get('controlPolitico/{id}', [ControlPoliticosController::class, 'show']);
Route::put('controlPolitico/{id}', [ControlPoliticosController::class, 'update']);
Route::delete('controlPolitico/{id}', [ControlPoliticosController::class, 'destroy']);

Route::get('controlPoliticoProposicion/totalrecords', [ControlPoliticoProposicionsController::class, 'totalrecords']);
Route::get('controlPoliticoProposicion', [ControlPoliticoProposicionsController::class, 'index']);
Route::post('controlPoliticoProposicion', [ControlPoliticoProposicionsController::class, 'store']);
Route::get('controlPoliticoProposicion/{id}', [ControlPoliticoProposicionsController::class, 'show']);
Route::put('controlPoliticoProposicion/{id}', [ControlPoliticoProposicionsController::class, 'update']);
Route::delete('controlPoliticoProposicion/{id}', [ControlPoliticoProposicionsController::class, 'destroy']);

Route::get('controlPoliticoRespuesta/totalrecords', [ControlPoliticoRespuestasController::class, 'totalrecords']);
Route::get('controlPoliticoRespuesta', [ControlPoliticoRespuestasController::class, 'index']);
Route::post('controlPoliticoRespuesta', [ControlPoliticoRespuestasController::class, 'store']);
Route::get('controlPoliticoRespuesta/{id}', [ControlPoliticoRespuestasController::class, 'show']);
Route::put('controlPoliticoRespuesta/{id}', [ControlPoliticoRespuestasController::class, 'update']);
Route::delete('controlPoliticoRespuesta/{id}', [ControlPoliticoRespuestasController::class, 'destroy']);

Route::get('controlPoliticoDocumento/totalrecords', [ControlPoliticoDocumentosController::class, 'totalrecords']);
Route::get('controlPoliticoDocumento', [ControlPoliticoDocumentosController::class, 'index']);
Route::post('controlPoliticoDocumento', [ControlPoliticoDocumentosController::class, 'store']);
Route::get('controlPoliticoDocumento/{id}', [ControlPoliticoDocumentosController::class, 'show']);
Route::put('controlPoliticoDocumento/{id}', [ControlPoliticoDocumentosController::class, 'update']);
Route::delete('controlPoliticoDocumento/{id}', [ControlPoliticoDocumentosController::class, 'destroy']);

Route::get('controlPoliticoCitante/totalrecords', [ControlPoliticoCitantesController::class, 'totalrecords']);
Route::get('controlPoliticoCitante', [ControlPoliticoCitantesController::class, 'index']);
Route::post('controlPoliticoCitante', [ControlPoliticoCitantesController::class, 'store']);
Route::get('controlPoliticoCitante/{id}', [ControlPoliticoCitantesController::class, 'show']);
Route::put('controlPoliticoCitante/{id}', [ControlPoliticoCitantesController::class, 'update']);
Route::delete('controlPoliticoCitante/{id}', [ControlPoliticoCitantesController::class, 'destroy']);

Route::get('controlPoliticoCitado/totalrecords', [ControlPoliticoCitadosController::class, 'totalrecords']);
Route::get('controlPoliticoCitado', [ControlPoliticoCitadosController::class, 'index']);
Route::post('controlPoliticoCitado', [ControlPoliticoCitadosController::class, 'store']);
Route::get('controlPoliticoCitado/{id}', [ControlPoliticoCitadosController::class, 'show']);
Route::put('controlPoliticoCitado/{id}', [ControlPoliticoCitadosController::class, 'update']);
Route::delete('controlPoliticoCitado/{id}', [ControlPoliticoCitadosController::class, 'destroy']);
//BalanceCuatrienio
Route::get('balanceCuatrienio/totalrecords', [BalanceCuatrienioController::class, 'totalrecords'])->middleware(['jwt.cid:117']);
Route::get('balanceCuatrienio', [BalanceCuatrienioController::class, 'index'])->middleware(['jwt.cid:117']);
Route::post('balanceCuatrienio', [BalanceCuatrienioController::class, 'store'])->middleware(['jwt.cid:113']);
Route::get('balanceCuatrienio/{id}', [BalanceCuatrienioController::class, 'show'])->middleware(['jwt.cid:116']);
Route::put('balanceCuatrienio/{id}', [BalanceCuatrienioController::class, 'update'])->middleware(['jwt.cid:114']);
Route::delete('balanceCuatrienio/{id}', [BalanceCuatrienioController::class, 'destroy'])->middleware(['jwt.cid:115']);

//BalanceCuatrienioInforme
Route::get('balanceCuatrienioInforme/totalrecords', [BalanceCuatrienioInformeController::class, 'totalrecords'])->middleware(['jwt.cid:117']);
Route::get('balanceCuatrienioInforme', [BalanceCuatrienioInformeController::class, 'index'])->middleware(['jwt.cid:117']);
Route::post('balanceCuatrienioInforme', [BalanceCuatrienioInformeController::class, 'store'])->middleware(['jwt.cid:113']);
Route::get('balanceCuatrienioInforme/{id}', [BalanceCuatrienioInformeController::class, 'show'])->middleware(['jwt.cid:116']);
Route::put('balanceCuatrienioInforme/{id}', [BalanceCuatrienioInformeController::class, 'update'])->middleware(['jwt.cid:114']);
Route::delete('balanceCuatrienioInforme/{id}', [BalanceCuatrienioInformeController::class, 'destroy'])->middleware(['jwt.cid:115']);
//Infomes Pnud
Route::get('informesPnud', [InformesPnudController::class, 'index'])->middleware(['jwt.cid:111']);
Route::get('informesPnud/{id}',[InformesPnudController::class,'show'])->middleware(['jwt.cid:110']);
Route::post('informesPnud',[InformesPnudController::class, 'store'])->middleware(['jwt.cid:107']);
Route::put('informesPnud/{id}',[InformesPnudController::class, 'update'])->middleware(['jwt.cid:108']);
Route::delete('informesPnud/{id}',[InformesPnudController::class, 'destroy'])->middleware(['jwt.cid:109']);

Route::get('documentosInformes/{id}',[InformesPnudController::class,'indexDocumento']);
Route::post('documentosInforme',[InformesPnudController::class,'storeDocumento']);
Route::get('documentosInforme/{id}',[InformesPnudController::class,'showDocumento']);
Route::delete('documentosInforme/{id}',[InformesPnudController::class, 'destroyDocumento']);
Route::put('documentosInforme/{id}', [InformesPnudController::class, 'updateDocumento']);

// Opiniones
Route::get('opinion',[OpinionController::class, 'index'])->middleware(['jwt.cid:123']);
Route::get('opinion/{id}',[OpinionController::class,'show'])->middleware(['jwt.cid:122']);
Route::post('opinion',[OpinionController::class,'store'])->middleware(['jwt.cid:119']);
Route::put('opinion/{id}',[OpinionController::class,'update'])->middleware(['jwt.cid:120']);
Route::delete('opinion/{id}',[OpinionController::class,'destroy'])->middleware(['jwt.cid:121']);

//AgendaLegislativa
Route::get('agendaLegislativa/totalrecords', [AgendaLegislativasController::class, 'totalrecords'])->middleware(['jwt.cid:94']);
Route::get('agendaLegislativa', [AgendaLegislativasController::class, 'index'])->middleware(['jwt.cid:94']);
Route::post('agendaLegislativa', [AgendaLegislativasController::class, 'store'])->middleware(['jwt.cid:89']);
Route::get('agendaLegislativa/{id}', [AgendaLegislativasController::class, 'show'])->middleware(['jwt.cid:92']);
Route::put('agendaLegislativa/{id}', [AgendaLegislativasController::class, 'update'])->middleware(['jwt.cid:90']);
Route::delete('agendaLegislativa/{id}', [AgendaLegislativasController::class, 'destroy'])->middleware(['jwt.cid:91']);

//Tipo investigación
Route::get('tipoInvestigacions/totalrecords', [TipoInvestigacionsController::class, 'totalrecords']);
Route::get('tipoInvestigacions', [TipoInvestigacionsController::class, 'index']);
Route::post('tipoInvestigacions', [TipoInvestigacionsController::class, 'store']);
Route::get('tipoInvestigacions/{id}', [TipoInvestigacionsController::class, 'show']);
Route::put('tipoInvestigacions/{id}', [TipoInvestigacionsController::class, 'update']);
Route::delete('tipoInvestigacions/{id}', [TipoInvestigacionsController::class, 'destroy']);

//AgendaLegislativaActividades
Route::get('agendaLegislativaActividades/totalrecords', [AgendaLegislativaActividadesController::class, 'totalrecords'])->middleware(['jwt.cid:94']);
Route::get('agendaLegislativaActividades', [AgendaLegislativaActividadesController::class, 'index'])->middleware(['jwt.cid:94']);
Route::post('agendaLegislativaActividades', [AgendaLegislativaActividadesController::class, 'store'])->middleware(['jwt.cid:89']);
Route::get('agendaLegislativaActividades/{id}', [AgendaLegislativaActividadesController::class, 'show'])->middleware(['jwt.cid:92']);
Route::put('agendaLegislativaActividades/{id}', [AgendaLegislativaActividadesController::class, 'update'])->middleware(['jwt.cid:90']);
Route::delete('agendaLegislativaActividades/{id}', [AgendaLegislativaActividadesController::class, 'destroy'])->middleware(['jwt.cid:91']);

//AgendaLegislativaComsion
Route::get('agendaLegislativaComision/totalrecords', [AgendaLegislativaComisionController::class, 'totalrecords']);
Route::get('agendaLegislativaComision', [AgendaLegislativaComisionController::class, 'index']);
Route::post('agendaLegislativaComision', [AgendaLegislativaComisionController::class, 'store']);
Route::get('agendaLegislativaComision/{id}', [AgendaLegislativaComisionController::class, 'show']);
Route::put('agendaLegislativaComision/{id}', [AgendaLegislativaComisionController::class, 'update']);
Route::delete('agendaLegislativaComision/{id}', [AgendaLegislativaComisionController::class, 'destroy']);

// Podcast
Route::get('podcast/totalrecords', [PodcastController::class, 'totalrecords'])->middleware(['jwt.cid:135']);
Route::get('podcast',[PodcastController::class, 'index'])->middleware(['jwt.cid:135']);
Route::get('podcast/{id}',[PodcastController::class,'show'])->middleware(['jwt.cid:134']);
Route::post('podcast',[PodcastController::class,'store'])->middleware(['jwt.cid:131']);
Route::put('podcast/{id}',[PodcastController::class,'update'])->middleware(['jwt.cid:132']);
Route::delete('podcast/{id}',[PodcastController::class,'destroy'])->middleware(['jwt.cid:133']);

// Opiniones Congresistas
Route::get('utils/getComboOpinionCongresistaAnno', [UtilsController::class, 'getComboOpinionCongresistaAnno'])->middleware(['jwt.cid:0']);
Route::get('opinionCongresista',[OpinionCongresistaController::class, 'index'])->middleware(['jwt.cid:129']);
Route::get('opinionCongresista/{id}',[OpinionCongresistaController::class,'show'])->middleware(['jwt.cid:128']);
Route::post('opinionCongresista',[OpinionCongresistaController::class,'store'])->middleware(['jwt.cid:125']);
Route::put('opinionCongresista/{id}',[OpinionCongresistaController::class,'update'])->middleware(['jwt.cid:126']);
Route::delete('opinionCongresista/{id}',[OpinionCongresistaController::class,'destroy'])->middleware(['jwt.cid:127']);


//Multimedia
Route::get('multimedia',[MultimediaController::class, 'index'])->middleware(['jwt.cid:141']);
Route::get('multimedia/{id}',[MultimediaController::class,'show'])->middleware(['jwt.cid:140']);
Route::post('multimedia',[MultimediaController::class,'store'])->middleware(['jwt.cid:137']);
Route::put('multimedia/{id}',[MultimediaController::class,'update'])->middleware(['jwt.cid:138']);
Route::delete('multimedia/{id}',[MultimediaController::class,'destroy'])->middleware(['jwt.cid:139']);

// Utils
Route::post('utils/getComboTipoUsuarioFilter', [UtilsController::class, 'getComboTipoUsuarioFilter'])->middleware(['jwt.cid:0']);
// Route::get('utils/getComboComisiones', [UtilsController::class, 'getComboComisiones'])->middleware(['jwt.cid:0']);
Route::post('utils/getComboTipoSucursalFilter', [UtilsController::class, 'getComboTipoSucursalFilter'])->middleware(['jwt.cid:0']);

// Sucursal
Route::get('sucursal/{id}', [SucursalController::class, 'show'])->middleware(['jwt.cid:7']);

// Usuario
Route::post('usuarioCuenta', [UsuarioCuentaController::class, 'store'])->middleware(['jwt.cid:10']);
Route::put('usuarioCuenta/{id}', [UsuarioCuentaController::class, 'update'])->middleware(['jwt.cid:11']);
Route::delete('usuarioCuenta/{id}', [UsuarioCuentaController::class, 'destroy'])->middleware(['jwt.cid:12']);
Route::get('usuarioCuenta/{id}', [UsuarioCuentaController::class, 'show'])->middleware(['jwt.cid:13']);
Route::get('usuarioCuenta/showAll', [UsuarioCuentaController::class, 'showAll'])->middleware(['jwt.cid:14']);
Route::post('usuarioCuenta/index', [UsuarioCuentaController::class, 'index'])->middleware(['jwt.cid:15']);
Route::get('usuarioCuenta/desbloquear/{id}', [UsuarioCuentaController::class, 'desbloquear'])->middleware(['jwt.cid:16']);

// Asignacion de usuarios
Route::delete('asignacionUsuario/destroyAll/{id}', [SucursalUsuarioCuentaController::class, 'destroyAll'])->middleware(['jwt.cid:19']);
Route::post('asignacionUsuario/showAll', [SucursalUsuarioCuentaController::class, 'showAll'])->middleware(['jwt.cid:21']);

// Usuarios por sucursal
Route::post('usuariosPorSucursal/showFilter', [SucursalUsuarioCuentaController::class, 'showFilter'])->middleware(['jwt.cid:0']);
Route::post('usuariosPorSucursal/getUsuariosFaltantesEnSucursal', [SucursalUsuarioCuentaController::class, 'getUsuariosFaltantesEnSucursal'])->middleware(['jwt.cid:0']);
Route::post('usuariosPorSucursal', [SucursalUsuarioCuentaController::class, 'store'])->middleware(['jwt.cid:23']);
Route::delete('usuariosPorSucursal/destroyAll/{id}', [SucursalUsuarioCuentaRolController::class, 'destroyAll'])->middleware(['jwt.cid:25']);
Route::post('usuariosPorSucursal/showAll', [SucursalUsuarioCuentaRolController::class, 'showAll'])->middleware(['jwt.cid:27']);

// Roles por usuario
Route::get('rol/getByIdSucursalCuentaUsuarioRol/{sucursal_usuario_cuenta_rol_id}', [RolController::class, 'getByIdSucursalCuentaUsuarioRol'])->middleware(['jwt.cid:0']);
Route::post('moduloPermisoRol/getAll', [ModuloPermisoRolController::class, 'getAll'])->middleware(['jwt.cid:0']);
Route::post('moduloPermisoRol/getAllDto', [ModuloPermisoRolController::class, 'getAllDto'])->middleware(['jwt.cid:0']);
Route::post('sucursalUsuarioCuentaRolModuloPermisoRol/getAll', [SucursalUsuarioCuentaRolModuloPermisoRolController::class, 'getAll'])->middleware(['jwt.cid:0']);
Route::post('sucursalUsuarioCuentaRolModuloPermisoRol/postRange', [SucursalUsuarioCuentaRolModuloPermisoRolController::class, 'postRange'])->middleware(['jwt.cid:0']);
Route::put('sucursalUsuarioCuentaRolModuloPermisoRol/putRange/{id}', [SucursalUsuarioCuentaRolModuloPermisoRolController::class, 'putRange'])->middleware(['jwt.cid:0']);
Route::get('rol/getAllByIdTipoUsuario/{tipo_usuario_id}', [RolController::class, 'getAllByIdTipoUsuario'])->middleware(['jwt.cid:0']);
Route::get('rol/getAllByIdTipoUsuarioAndIdSucursalCuentaUsuario/{tipo_usuario_id}/{sucursal_usuario_cuenta_id}', [RolController::class, 'getAllByIdTipoUsuarioAndIdSucursalCuentaUsuario'])->middleware(['jwt.cid:0']);
Route::post('usuarioCuenta/getDto', [UsuarioCuentaController::class, 'getDto'])->middleware(['jwt.cid:14']);
Route::post('rolesPorUsuario/getAllRoles', [SucursalUsuarioCuentaRolController::class, 'getAllRoles'])->middleware(['jwt.cid:33']);
Route::delete('sucursalCuentaUsuarioRolModuloPermisoRol/{id}', [SucursalUsuarioCuentaRolController::class, 'destroy'])->middleware(['jwt.cid:33']);

// Roles
Route::delete('moduloPermisoRol/{id}', [ModuloPermisoRolController::class, 'destroy'])->middleware(['jwt.cid:37']);
Route::post('rol/getAll', [RolController::class, 'getAll'])->middleware(['jwt.cid:39']);

// Roles por acción
Route::get('moduloPermiso/getModulosPermisos', [ModuloPermisoController::class, 'getModulosPermisos'])->middleware(['jwt.cid:0']);
Route::get('moduloPermisoRol/getModulosPermisosRolByIdRol/{rol_id}', [ModuloPermisoRolController::class, 'getModulosPermisosRolByIdRol'])->middleware(['jwt.cid:0']);
Route::post('moduloPermisoRol/postRange', [ModuloPermisoRolController::class, 'postRange'])->middleware(['jwt.cid:35']);
Route::put('moduloPermisoRol/putRange/{id}', [ModuloPermisoRolController::class, 'putRange'])->middleware(['jwt.cid:36']);
Route::get('rol/{id}', [RolController::class, 'show'])->middleware(['jwt.cid:38']);

// Tipos de usuario
Route::get('rol/getAllSinAsignarATipoDeUsuario/{id}', [RolController::class, 'getAllSinAsignarATipoDeUsuario'])->middleware(['jwt.cid:0']);
Route::post('tipoUsuario', [TipoUsuarioController::class, 'store'])->middleware(['jwt.cid:41']);
Route::put('tipoUsuario/{id}', [TipoUsuarioController::class, 'update'])->middleware(['jwt.cid:42']);
Route::delete('tipoUsuario/{id}', [TipoUsuarioController::class, 'destroy'])->middleware(['jwt.cid:43']);
Route::get('tipoUsuario/{id}',[TipoUsuarioController::class,'show'])->middleware(['jwt.cid:44']);
Route::post('tipoUsuario/getAllDto', [TipoUsuarioController::class, 'getAllDto'])->middleware(['jwt.cid:45']);
Route::post('rolTipoUsuario', [RolTipoUsuarioController::class, 'store'])->middleware(['jwt.cid:47']);
Route::delete('rolTipoUsuario/{id}',[RolTipoUsuarioController::class,'destroy'])->middleware(['jwt.cid:49']);
Route::post('rolTipoUsuario/getAllDto', [RolTipoUsuarioController::class, 'getAllDto'])->middleware(['jwt.cid:50']);

//Eleccion
Route::get('eleccion',[EleccionsController::class, 'index'])->middleware(['jwt.cid:159']);
Route::get('eleccion/totalrecords', [EleccionsController::class, 'totalrecords'])->middleware(['jwt.cid:159']);
Route::get('eleccion/{id}',[EleccionsController::class,'show'])->middleware(['jwt.cid:158']);
Route::post('eleccion',[EleccionsController::class,'store'])->middleware(['jwt.cid:155']);
Route::put('eleccion/{id}',[EleccionsController::class,'update'])->middleware(['jwt.cid:156']);
Route::delete('eleccion/{id}',[EleccionsController::class,'destroy'])->middleware(['jwt.cid:157']);

// Secretarios
Route::get('secretarios/totalrecords', [SecretariosController::class, 'totalrecords'])->middleware(['jwt.cid:99']);
Route::get('secretarios', [SecretariosController::class, 'index'])->middleware(['jwt.cid:99']);
Route::post('secretarios', [SecretariosController::class, 'store'])->middleware(['jwt.cid:95']);
Route::get('secretarios/{id}', [SecretariosController::class, 'show'])->middleware(['jwt.cid:98']);
Route::put('secretarios/{id}', [SecretariosController::class, 'update'])->middleware(['jwt.cid:96']);
Route::delete('secretarios/{id}', [SecretariosController::class, 'destroy'])->middleware(['jwt.cid:97']);

//Informacion del sitio
Route::get('informacionSitio', [InformacionSitioController::class, 'index'])->middleware(['jwt.cid:106']);
Route::get('informacionSitio/{id}', [InformacionSitioController::class, 'show'])->middleware(['jwt.cid:104']);
Route::put('informacionSitio/{id}', [InformacionSitioController::class, 'update'])->middleware(['jwt.cid:102']);

//Temas control politico
Route::get('temacontrolpoliticos', [TemaControlPoliticosController::class, 'index'])->middleware(['jwt.cid:249']);
Route::post('temacontrolpoliticos', [TemaControlPoliticosController::class, 'store'])->middleware(['jwt.cid:245']);
Route::get('temacontrolpoliticos/{id}', [TemaControlPoliticosController::class, 'show'])->middleware(['jwt.cid:248']);
Route::put('temacontrolpoliticos/{id}', [TemaControlPoliticosController::class, 'update'])->middleware(['jwt.cid:246']);
Route::delete('temacontrolpoliticos/{id}', [TemaControlPoliticosController::class, 'destroy'])->middleware(['jwt.cid:247']);

//Personas
Route::get('personas', [PersonaController::class, 'index'])->middleware(['jwt.cid:344']);
Route::get('personas/totalrecords', [PersonaController::class, 'totalrecords'])->middleware(['jwt.cid:344']);
Route::get('personas/{id}', [PersonaController::class, 'show'])->middleware(['jwt.cid:343']);
Route::post('personas', [PersonaController::class, 'store'])->middleware(['jwt.cid:340']);
Route::put('personas/{id}', [PersonaController::class, 'update'])->middleware(['jwt.cid:341']);
Route::delete('personas/{id}', [PersonaController::class, 'destroy'])->middleware(['jwt.cid:342']);


// Región
Route::post('region', [RegionController::class, 'store'])->middleware(['jwt.cid:352']);
Route::put('region/{id}', [RegionController::class, 'update'])->middleware(['jwt.cid:353']);
Route::delete('region/{id}', [RegionController::class, 'destroy'])->middleware(['jwt.cid:354']);
Route::get('region/{id}', [RegionController::class, 'show'])->middleware(['jwt.cid:355']);
Route::get('region', [RegionController::class, 'index'])->middleware(['jwt.cid:356']);
Route::post('region/totalrecords', [RegionController::class, 'totalrecords'])->middleware(['jwt.cid:0']);

// Municipio
Route::post('municipio', [MunicipioController::class, 'store'])->middleware(['jwt.cid:358']);
Route::put('municipio/{id}', [MunicipioController::class, 'update'])->middleware(['jwt.cid:359']);
Route::delete('municipio/{id}', [MunicipioController::class, 'destroy'])->middleware(['jwt.cid:360']);
Route::get('municipio/{id}', [MunicipioController::class, 'show'])->middleware(['jwt.cid:361']);
Route::get('municipio', [MunicipioController::class, 'index'])->middleware(['jwt.cid:362']);
Route::post('municipio/totalrecords', [MunicipioController::class, 'totalrecords'])->middleware(['jwt.cid:0']);

// Notificación
Route::get('notificacion/get_all/{email}/{limite}', [NotificacionController::class, 'show_all'])->middleware(['jwt.cid:0']);
Route::delete('notificacion/{email}/{proyecto_ley_id}', [NotificacionController::class, 'destroy'])->middleware(['jwt.cid:0']);

// Observaciones Iniciativa
Route::get('observacionesIniciativa', [ObservacionesIniciativaController::class, 'index'])->middleware(['jwt.cid:0']);