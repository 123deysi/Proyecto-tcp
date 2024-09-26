<?php

namespace App\Http\Controllers\Api;

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
}
