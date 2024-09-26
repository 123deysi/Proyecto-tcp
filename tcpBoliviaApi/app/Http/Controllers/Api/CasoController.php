<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Caso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class CasoController extends Controller
{
    /**
     * Muestra una lista de los casos.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $casos = Caso::with(['accionConstitucional', 'sala', 'departamento', 'municipio'])->get();
        return response()->json($casos);
    }

    public function todosLosAtributos()
{

    $casos = Caso::all();

    return response()->json($casos);
}


    /**
     * Almacena un nuevo caso en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'exp' => 'required|string|max:50',

            'accion_const_id' => 'nullable|exists:subtipos_acciones,id',
            'accion_const2_id' => 'nullable|exists:acciones_constitucionales,id',

            'departamento_id' => 'nullable|exists:departamentos,id',
            'municipio_id' => 'nullable|exists:municipios,id',
           'fecha_ingreso' => 'nullable|date_format:Y-m-d',

        ]);

        $caso = Caso::create($request->all());

        return response()->json($caso, 201);
    }

    /**
     * Muestra un caso específico.
     *
     * @param  \App\Models\Caso  $caso
     * @return \Illuminate\Http\Response
     */
    public function show(Caso $caso)
    {
        $caso->load(['accionConstitucional', 'sala', 'departamento', 'municipio']);
        return response()->json($caso);
    }



public function casosPorFechaIngreso()
{
    // Obtener casos agrupados por año de fecha_ingreso y contar la cantidad de casos
    $casosPorFechaIngreso = DB::table('casos')
        ->select(DB::raw('YEAR(fecha_ingreso) AS año'), DB::raw('COUNT(id) AS cantidad_casos'))
        ->groupBy(DB::raw('YEAR(fecha_ingreso)'))
        ->orderBy(DB::raw('YEAR(fecha_ingreso)'), 'asc')
        ->get();

    return response()->json($casosPorFechaIngreso);
}

public function obtenerAniosUnicos()
{
    // Obtener años únicos de la columna fecha_ingreso
    $aniosUnicos = DB::table('casos')
        ->select(DB::raw('YEAR(fecha_ingreso) AS año'))
        ->distinct()  // Asegura que solo se devuelvan años únicos
        ->orderBy(DB::raw('YEAR(fecha_ingreso)'), 'asc')
        ->pluck('año');

    return response()->json($aniosUnicos);
}

    public function casosPorDepartamento()
{
    // Obtener el total de casos
    $totalCasos = DB::table('casos')->count();

    // Obtener casos por departamento y calcular el porcentaje
    $casosPorDepartamento = DB::table('departamentos')
        ->leftJoin('casos', 'departamentos.id', '=', 'casos.departamento_id')
        ->select('departamentos.nombre AS departamento', DB::raw('COUNT(casos.id) AS cantidad_casos'))
        ->groupBy('departamentos.nombre')
        ->get()
        ->map(function ($item) use ($totalCasos) {
            $item->porcentaje = $totalCasos > 0 ? ($item->cantidad_casos / $totalCasos) * 100 : 0;
            return $item;
        });

    return response()->json($casosPorDepartamento);
}


    /**
     * Actualiza un caso existente en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Caso  $caso
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Caso $caso)
    {
        $request->validate([
            'exp' => 'required|string|max:50',
            'ref' => 'nullable|string',
            'accion_constitucional_id' => 'nullable|exists:acciones_constitucionales,id',
            'año_codif' => 'nullable|integer',
            'sala_id' => 'nullable|exists:salas,id',
            'departamento_id' => 'nullable|exists:departamentos,id',
            'municipio_id' => 'nullable|exists:municipios,id',
            'restiempo' => 'nullable|numeric',
            'codificador' => 'nullable|string|max:100',
            'observaciones' => 'nullable|string',
            'fecha_ingreso' => 'nullable|date',
        ]);

        $caso->update($request->all());

        return response()->json($caso);
    }

    /**
     * Elimina un caso de la base de datos.
     *
     * @param  \App\Models\Caso  $caso
     * @return \Illuminate\Http\Response
     */
    public function destroy(Caso $caso)
    {
        $caso->delete();

        return response()->json(null, 204);
    }
    public function contarCasos(Request $request)
    {
        // Obtener los filtros del request
        $departamentoId = $request->query('departamento_id');
        $salaId = $request->query('sala_id');
        $periodo = $request->query('periodo'); // Asumiendo que es el año de fecha_ingreso
        $accionId = $request->query('accion_id');
        $subtipoId = $request->query('subtipo_id');

        // Construir la consulta de casos
        $query = Caso::query();

        // Aplicar filtros dinámicos
        if ($departamentoId) {
            $query->where('departamento_id', $departamentoId);
        }

        if ($salaId) {
            $query->where('sala_id', $salaId);
        }

        if ($periodo) {
            $query->whereYear('fecha_ingreso', $periodo);
        }

        if ($accionId) {
            $query->where('subtipo_accion_id', function ($subquery) use ($accionId) {
                $subquery->select('id')
                    ->from('subtipos_accion')
                    ->where('accion_id', $accionId);
            });
        }

        if ($subtipoId) {
            $query->where('subtipo_accion_id', $subtipoId);
        }

        // Contar los casos que cumplen con los filtros
        $conteo = $query->get(); // Obtén todos los casos que cumplen con los filtros

        // Retornar la cantidad de casos como un array
        return response()->json(['conteo' => $conteo]);
    }




}
