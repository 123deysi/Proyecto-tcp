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
        $casosPorFechaIngreso = DB::table('casos')
            ->select(DB::raw('YEAR(fecha_ingreso) AS anio'), DB::raw('MONTH(fecha_ingreso) AS mes'), DB::raw('COUNT(id) AS cantidad_resoluciones'))
            ->groupBy(DB::raw('YEAR(fecha_ingreso)'), DB::raw('MONTH(fecha_ingreso)'))
            ->orderBy(DB::raw('YEAR(fecha_ingreso)'), 'asc')
            ->orderBy(DB::raw('MONTH(fecha_ingreso)'), 'asc')
            ->get();
    
        return response()->json($casosPorFechaIngreso);
    }
// public function casosPorFechaIngreso()
// {
//     // Obtener casos agrupados por año de fecha_ingreso y contar la cantidad de casos
//     $casosPorFechaIngreso = DB::table('casos')
//         ->select(DB::raw('YEAR(fecha_ingreso) AS año'), DB::raw('COUNT(id) AS cantidad_casos'))
//         ->groupBy(DB::raw('YEAR(fecha_ingreso)'))
//         ->orderBy(DB::raw('YEAR(fecha_ingreso)'), 'asc')
//         ->get();

//     return response()->json($casosPorFechaIngreso);
// }
public function obtenerAniosUnicos()
{
    $aniosUnicos = DB::table('casos')
        ->select(DB::raw('YEAR(fecha_ingreso) AS año'))
        ->distinct()  // Asegura que solo se devuelvan años únicos
        ->orderBy(DB::raw('YEAR(fecha_ingreso)'), 'asc')
        ->pluck('año');
    return response()->json($aniosUnicos);
}
public function casosPorDepartamento(Request $request)
{
    $departamento_id = $request->query('departamento_id');
    $query = DB::table('departamentos')
        ->leftJoin('casos', 'departamentos.id', '=', 'casos.departamento_id')
        ->select('departamentos.nombre AS departamento', DB::raw('COUNT(casos.id) AS cantidad_casos'))
        ->groupBy('departamentos.nombre');
    if ($departamento_id) {
        $query->where('departamentos.id', $departamento_id);
    }
    $casosPorDepartamento = $query->get();
    return response()->json($casosPorDepartamento);
}
public function casosPorMunicipio(Request $request)
{
    $municipios = DB::table('municipios')
        ->join('casos', 'municipios.id', '=', 'casos.municipio_id')
        ->select('municipios.nombre as municipio', DB::raw('COUNT(casos.id) as cantidad_de_casos'))
        ->groupBy('municipios.nombre')
        ->get();
    return response()->json($municipios);
}
public function casosPorDepartamentoYMunicipio(Request $request)
{
    $orderDirection = $request->input('order', 'asc');
    if (!in_array($orderDirection, ['asc', 'desc'])) {
        return response()->json(['error' => 'Invalid order direction'], 400);
    }
    $departmentId = $request->input('departamento_id');
    $query = DB::table('casos as c')
        ->select('d.nombre as departamento', 'm.nombre as municipio', DB::raw('COUNT(c.id) as cantidad_de_casos'))
        ->leftJoin('departamentos as d', 'c.departamento_id', '=', 'd.id')
        ->leftJoin('municipios as m', 'c.municipio_id', '=', 'm.id')
        ->groupBy('d.nombre', 'm.nombre')
        ->orderBy('d.nombre', $orderDirection)
        ->orderBy('m.nombre', $orderDirection);
    if ($departmentId) {
        $query->where('c.departamento_id', $departmentId);
    }
    $results = $query->get();
    return response()->json($results);
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
        $departamentoId = $request->query('departamento_id');
        $salaId = $request->query('sala_id');
        $periodo = $request->query('periodo'); // Asumiendo que es el año de fecha_ingreso
        $accionId = $request->query('accion_id');
        $subtipoId = $request->query('subtipo_id');
        $query = Caso::query();
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
        $conteo = $query->get(); // Obtén todos los casos que cumplen con los filtros
        return response()->json(['conteo' => $conteo]);
    }
    public function resolucionesPorDepartamentoYTipo() {
        $resoluciones = DB::table('resoluciones as r')
            ->leftJoin('tipos_resoluciones as tr', 'r.res_tipo_id', '=', 'tr.id')
            ->leftJoin('tipos_resoluciones2 as tr2', 'r.res_tipo2_id', '=', 'tr2.id')
            ->leftJoin('casos as c', 'r.caso_id', '=', 'c.id')
            ->leftJoin('municipios as m', 'c.municipio_id', '=', 'm.id')
            ->leftJoin('departamentos as d', 'm.departamento_id', '=', 'd.id')
            ->select('d.nombre as departamento', 
                     'tr2.descripcion as tipo_resolucion2', 
                     'tr.descripcion as sub_tipo_resolucion', 
                     DB::raw('COUNT(r.numres2) as cantidad_resoluciones'))
            ->groupBy('d.nombre', 'tr2.descripcion', 'tr.descripcion')
            ->orderBy('d.nombre', 'asc')
            ->orderBy('tr2.descripcion', 'asc')
            ->orderBy('tr.descripcion', 'asc')
            ->get();
        return response()->json($resoluciones);
    }
    
    
}
