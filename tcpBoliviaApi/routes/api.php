<?php

use App\Http\Controllers\Api\AccionConstitucionalController;
use App\Http\Controllers\Api\CasoController;
use App\Http\Controllers\Api\DepartamentoController;
use App\Http\Controllers\Api\SalaController;
use App\Http\Controllers\Api\SubtipoAccionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DatosInicialesController;

/*Programador Giancarlos → Usar controlador */
use App\Http\Controllers\Api\AuthController;

// routes/api.php
use App\Http\Controllers\UserController;

// routes/api.php
use App\Http\Controllers\ExcelController;

Route::post('/upload', [ExcelController::class, 'upload']);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/




/* */
Route::get('casos',[CasoController::class, 'casosPorDepartamento']);
Route::get('/casosFechaIngreso', [CasoController::class,'casosPorFechaIngreso']);
Route::get('/departamentos', [DepartamentoController::class,'showDepartamentos']);
Route::get('/accionConstitucional', [AccionConstitucionalController::class,'showAccionConstitucional']);

Route::get('/unicoGestion', [CasoController::class,'obtenerAniosUnicos']);
Route::get('/salas', [SalaController::class,'index']);
Route::get('/subtiposAccion/{id}', [SubtipoAccionController::class, 'indexSubtipo']);
Route::get('/subtipoAccion/{id}', [SubtipoAccionController::class,'indexSubtipo']);
Route::get('/lista/Casos', [CasoController::class,'todosLosAtributos']);


Route::get('/obtenerDatosIniciales', [DatosInicialesController::class, 'obtenerDatosIniciales']);


Route::get('/contarCasos', [CasoController::class, 'contarCasos']);


/*Programador Giancarlos → Lgon Ruta */
Route::post('/login', [AuthController::class, 'login']);

Route::get('/users', [UserController::class, 'index']);
Route::post('/register', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {

    return $request->user();
});
