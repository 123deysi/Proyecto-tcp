<?php

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
Route::get('/resoluciones/por-fecha', [ResolucionController::class, 'resolucionesPorFecha']);
// Route::get('/casosFechaIngreso', [CasoController::class,'casosPorFechaIngreso']);
Route::get('/unicoGestion', [CasoController::class,'obtenerAniosUnicos']);
Route::get('/accionConstitucional', [AccionConstitucionalController::class,'showAccionConstitucional']);
Route::get('/lista/Casos', [CasoController::class,'todosLosAtributos']);
Route::get('/obtenerDatosIniciales', [DatosInicialesController::class, 'obtenerDatosIniciales']);
Route::get('/contarCasos', [CasoController::class, 'contarCasos']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/users', [UserController::class, 'index']);
Route::post('/register', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
