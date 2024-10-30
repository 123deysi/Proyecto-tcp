<?php
namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Resolucion;
use Illuminate\Http\Request;

class ResolucionController extends Controller
{
    /**
     * Muestra una lista de las resoluciones.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $resoluciones = Resolucion::with(['tipoResolucion', 'tipoResolucion2', 'caso'])->get();
        return response()->json($resoluciones);
    }

    /**
     * Almacena una nueva resolución en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'numres2' => 'required|string|max:20',
            'res_fecha' => 'required|date',
            'res_tipo_id' => 'nullable|exists:tipos_resoluciones,id',
            'res_tipo2_id' => 'nullable|exists:tipos_resoluciones2,id',
            'res_fondo' => 'nullable|string|max:50',
            'resresul' => 'nullable|string|max:50',
            'revresul' => 'nullable|string|max:50',
            'resfinal' => 'nullable|string|max:50',
            'relator' => 'nullable|integer',
            'restiempo' => 'nullable|numeric',
            'caso_id' => 'nullable|exists:casos,id',
        ]);
        $resolucion = Resolucion::create($request->all());
        return response()->json($resolucion, 201);
    }
    /**
     * Muestra una resolución específica.
     *
     * @param  \App\Models\Resolucion  $resolucion
     * @return \Illuminate\Http\Response
     */
    public function show(Resolucion $resolucion)
    {
        $resolucion->load(['tipoResolucion', 'tipoResolucion2', 'caso']);
        return response()->json($resolucion);
    }
    /**
     * Actualiza una resolución existente en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Resolucion  $resolucion
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Resolucion $resolucion)
    {
        $request->validate([
           'numres2' => 'required|string|max:20',
            'res_fecha' => 'required|date',
            'res_tipo_id' => 'nullable|exists:tipos_resoluciones,id',
            'res_tipo2_id' => 'nullable|exists:tipos_resoluciones2,id',
            'res_fondo' => 'nullable|string|max:50',
            'resresul' => 'nullable|string|max:50',
            'revresul' => 'nullable|string|max:50',
            'resfinal' => 'nullable|string|max:50',
            'relator' => 'nullable|integer',
            'restiempo' => 'nullable|numeric',
            'caso_id' => 'nullable|exists:casos,id',
        ]);
        $resolucion->update($request->all());
        return response()->json($resolucion);
    }
    /**
     * Elimina una resolución de la base de datos.
     *
     * @param  \App\Models\Resolucion  $resolucion
     * @return \Illuminate\Http\Response
     */
    public function destroy(Resolucion $resolucion)
    {
        $resolucion->delete();
        return response()->json(null, 204);
    }
    public function resolucionesPorFecha()
    {
        $resolucionesPorFecha = DB::table('resoluciones')
            ->select(DB::raw('YEAR(res_fecha) AS anio'), DB::raw('MONTH(res_fecha) AS mes'), DB::raw('COUNT(numres2) AS cantidad_resoluciones'))
            ->whereNotNull('res_fecha')
            ->groupBy(DB::raw('YEAR(res_fecha), MONTH(res_fecha)'))
            ->orderBy('anio')
            ->orderBy('mes')
            ->get();
        return response()->json($resolucionesPorFecha);
    }
    public function resolucionesPorAccionConstitucional()
    {
        $resultados = DB::table('casos as c')
            ->join('resoluciones as r', 'c.id', '=', 'r.caso_id')
            ->join('acciones_constitucionales as ac2', 'c.accion_const2_id', '=', 'ac2.id')
            ->join('subtipos_acciones as sa', 'c.accion_const_id', '=', 'sa.id')
            ->select(
                'ac2.nombre as accion_const2_nombre',
                'sa.nombre as accion_const_nombre',
                DB::raw('COUNT(r.id) as cantidad_resoluciones')
            )
            ->groupBy('ac2.nombre', 'sa.nombre')
            ->orderBy('ac2.nombre')
            ->orderBy('sa.nombre')
            ->get();

        return response()->json($resultados);
    }

    public function resolucionesPorAccionConst(Request $request)
{
    // Obtener el ID de acción constitucional del request, si no se proporciona, será nulo.
    $accionConst2Id = $request->input('accion_const2_id');

    // Definir la dirección de orden
    $orderDirection = $request->input('order', 'asc'); // Valor por defecto es 'asc'
    if (!in_array($orderDirection, ['asc', 'desc'])) {
        $orderDirection = 'asc'; // Si no es válido, usar 'asc'
    }

    // Construir la consulta
    $query = DB::table('casos as c')
        ->join('resoluciones as r', 'c.id', '=', 'r.caso_id')
        ->join('acciones_constitucionales as ac2', 'c.accion_const2_id', '=', 'ac2.id')
        ->join('subtipos_acciones as sa', 'c.accion_const_id', '=', 'sa.id')
        ->select(
            'ac2.nombre as accion_const2_nombre',
            'sa.nombre as accion_const_nombre',
            DB::raw('COUNT(r.id) as cantidad_resoluciones')
        );

    // Filtrar por ID si se proporciona
    if (!empty($accionConst2Id)) {
        $query->where('c.accion_const2_id', $accionConst2Id);
    }

    // Agrupar y ordenar resultados
    $resolucionesPorAccionConst = $query
        ->groupBy('ac2.nombre', 'sa.nombre')
        ->orderBy('ac2.nombre', $orderDirection)
        ->orderBy('sa.nombre', $orderDirection)
        ->get();

    return response()->json($resolucionesPorAccionConst);
}


    public function accionesConstitucionales()
    {
        $acciones = DB::table('acciones_constitucionales')->select('id', 'nombre')->get();
        return response()->json($acciones);
    }

    public function resolucionesPorDepartamento()
{
    $resolucionesPorDepartamento = DB::table('resoluciones as r')
        ->join('casos as c', 'r.caso_id', '=', 'c.id')
        ->join('departamentos as d', 'c.departamento_id', '=', 'd.id') // Asegúrate de que esta relación exista
        ->select('d.nombre as departamento_nombre', DB::raw('COUNT(r.id) as cantidad_resoluciones'))
        ->groupBy('d.nombre')
        ->orderBy('cantidad_resoluciones', 'desc') // Para ordenar por cantidad
        ->get();

    return response()->json($resolucionesPorDepartamento);
}

}



