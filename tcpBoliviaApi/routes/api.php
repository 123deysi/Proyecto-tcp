<?php
use App\Http\Controllers\Api\ResEmisorController;
use App\Http\Controllers\Api\AccionConstitucionalController;
use App\Http\Controllers\Api\CasoController;
use App\Http\Controllers\Api\ResolucionController;
use App\Http\Controllers\Api\DepartamentoController;
use App\Http\Controllers\Api\SalaController;
use App\Http\Controllers\Api\SubtipoAccionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\DatosInicialesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ExcelController;
use Illuminate\Support\Facades\Route;

Route::post('/upload', [ExcelController::class, 'upload']);
Route::get('/casos', [CasoController::class, 'casosPorDepartamento']);
Route::get('/departamentos', [DepartamentoController::class, 'showDepartamentos']);
Route::get('/casos/municipios', [CasoController::class, 'casosPorDepartamentoYMunicipio']);

Route::get('/resoluciones/departamento-tipo', [CasoController::class, 'resolucionesPorDepartamentoYTipo']);
Route::get('/resoluciones/tipo', [CasoController::class, 'resolucionesPorTipo2']);


Route::get('/resoluciones/por-fecha', [ResolucionController::class, 'resolucionesPorFecha']);
Route::get('/casos/por-fecha', [CasoController::class, 'casosPorFechaIngreso']);

Route::get('/resoluciones/por-accion-constitucional', [ResolucionController::class, 'resolucionesPorAccionConstitucional']);
Route::get('/resoluciones/accion-const', [ResolucionController::class, 'resolucionesPorAccionConst']);
Route::get('/acciones-constitucionales', [ResolucionController::class, 'accionesConstitucionales']);

Route::get('/unicoGestion', [CasoController::class,'obtenerAniosUnicos']);
//actualizacion 
Route::get('/casosPorPeriodo', [CasoController::class,'casosPorPeriodo']);
Route::get('/casosPorResEmisor', [CasoController::class,'contarCasosResEmisor']);
Route::get('/resEmisor', [ResEmisorController::class,'showResEmisor']);
Route::get('/casosPorAnio', [CasoController::class,'casosPorAnio']);

Route::get('/resolucionesPorAnio', [ResolucionController::class,'resolucionesPorAnio']);
Route::get('/tiemposResolucion', [ResolucionController::class, 'obtenerTiemposDeResolucion']);
Route::get('/resolucionPorResFondo', [ResolucionController::class, 'resolucionesPorFondo']);
Route::get('/resolucionesPorRelator', [ResolucionController::class, 'resolucionesPorRelator']);




Route::get('/accionConstitucional', [AccionConstitucionalController::class,'showAccionConstitucional']);
Route::get('/lista/Casos', [CasoController::class,'todosLosAtributos']);
Route::get('/obtenerDatosIniciales', [DatosInicialesController::class, 'obtenerDatosIniciales']);
Route::get('/contarCasos', [CasoController::class, 'contarCasos']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/users', [UserController::class, 'index']);
Route::post('/register', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

//estadistica de total casos y causas resueltos 
Route::get('/contar/casos/resoluciones', [CasoController::class, 'contarCasosYResoluciones']);
Route::get('resoluciones/departamento', [ResolucionController::class, 'resolucionesPorDepartamento']);



Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
