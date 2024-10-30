<?php

namespace App\Imports;

use App\Models\ExcelDBRegistro;
use App\Models\Departamentos;
use App\Models\Municipio;
use App\Models\ResEmisor;
use App\Models\AccionConstitucional;
use App\Models\SubtipoAccion;
use App\Models\TipoResolucion2;
use App\Models\TipoResolucion;
use App\Models\Caso;
use App\Models\Resolucion;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\Importable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Carbon\Carbon;

class ExcelImport implements ToCollection, WithHeadingRow
{
    use Importable;

    public function collection(Collection $collection)
    {
        Log::info('Contenido del archivo importado: ' . json_encode($collection->toArray()));

        $rows = $collection->toArray();
        foreach ($rows as $index => $row) {
            try {
                // Manejo de Departamentos
                $idDepartamento = null;
                $nombreDepartamento = trim($row['departamento'] ?? '');
                if ($nombreDepartamento !== '' && $nombreDepartamento !== 'NULL') {
                    $departamento = Departamentos::where('nombre', $nombreDepartamento)->first();
                    if (!$departamento) {
                        $departamento = new Departamentos();
                        $departamento->nombre = $nombreDepartamento;
                        $departamento->save();
                    }
                    $idDepartamento = $departamento->id;
                }
                
                // Manejo de Municipios
                $idMunicipio = null;
                $nombreMunicipio = trim($row['municipio'] ?? '');
                if ($nombreMunicipio !== '' && $nombreMunicipio !== 'NULL') {
                    $municipio = Municipio::where('nombre', $nombreMunicipio)->first();
                    if (!$municipio) {
                        $municipio = new Municipio();
                        $municipio->nombre = $nombreMunicipio;

                        // Verificar si el departamento existe
                        if ($idDepartamento) {
                            $municipio->departamento_id = $idDepartamento;
                            $municipio->save();
                        }
                    }
                    $idMunicipio = $municipio->id;
                }


                // Manejo de Acciones Constitucionales
                $idAccionConstitucional = null;
                $nombreAccionConstitucional = trim($row['accion_const2'] ?? '');
                if ($nombreAccionConstitucional !== '' && $nombreAccionConstitucional !== 'NULL') {
                    $accionConstitucional = AccionConstitucional::where('nombre', $nombreAccionConstitucional)->first();
                    if (!$accionConstitucional) {
                        $accionConstitucional = new AccionConstitucional();
                        $accionConstitucional->nombre = $nombreAccionConstitucional;
                        $accionConstitucional->save();
                    }
                    $idAccionConstitucional = $accionConstitucional->id;
                }
                
               // Manejo de Subtipos de Acción
               $idSubtipoAccion = null;
               $nombreSubtipoAccion = trim($row['accion_const'] ?? '');
               if ($nombreSubtipoAccion !== '' && $nombreSubtipoAccion !== 'NULL') {
                   $subtipoAccion = SubtipoAccion::where('nombre', $nombreSubtipoAccion)->first();
                   if (!$subtipoAccion) {
                       $subtipoAccion = new SubtipoAccion();
                       $subtipoAccion->nombre = $nombreSubtipoAccion;

                       // Verificar si la acción constitucional existe
                       if ($idAccionConstitucional) {
                           $subtipoAccion->accion_id = $idAccionConstitucional;
                           $subtipoAccion->save();
                       }
                   }
                   $idSubtipoAccion = $subtipoAccion->id;
               }

                // Manejo de Res Emisores
                $idResEmisor = null;
                $nombreResEmisor = trim($row['res_emisor'] ?? '');
                if ($nombreResEmisor !== '' && $nombreResEmisor !== 'NULL') {
                    $resEmisor = ResEmisor::where('nombre', $nombreResEmisor)->first();
                    if (!$resEmisor) {
                        $resEmisor = new ResEmisor();
                        $resEmisor->nombre = $nombreResEmisor;
                        $resEmisor->save();
                    }
                    $idResEmisor = $resEmisor->id;
                }

                // Manejo de Tipo Resolucion2
                $idTipoResolucion2 = null;
                $descripcionTipoResolucion2 = trim($row['res_tipo2'] ?? '');
                if ($descripcionTipoResolucion2 !== '' && $descripcionTipoResolucion2 !== 'NULL') {
                    $tipoResolucion2 = TipoResolucion2::where('descripcion', $descripcionTipoResolucion2)->first();
                    if (!$tipoResolucion2) {
                        $tipoResolucion2 = new TipoResolucion2();
                        $tipoResolucion2->codigo = null;
                        $tipoResolucion2->descripcion = $descripcionTipoResolucion2;
                        $tipoResolucion2->created_at = now();
                        $tipoResolucion2->updated_at = now();
                        $tipoResolucion2->save();
                    }
                    $idTipoResolucion2 = $tipoResolucion2->id;
                }

                // Manejo de Tipo Resolucion
                $idTipoResolucion = null;
                $descripcionTipoResolucion = trim($row['res_tipo'] ?? '');
                if ($descripcionTipoResolucion !== '' && $descripcionTipoResolucion !== 'NULL') {
                    $tipoResolucion = TipoResolucion::where('descripcion', $descripcionTipoResolucion)->first();
                    if (!$tipoResolucion) {
                        $tipoResolucion = new TipoResolucion();
                        $tipoResolucion->codigo = null;
                        $tipoResolucion->descripcion = $descripcionTipoResolucion;
                        $tipoResolucion->res_tipo2_id = $idTipoResolucion2; // Asignar el ID de TipoResolucion2
                        $tipoResolucion->created_at = now();
                        $tipoResolucion->updated_at = now();
                        $tipoResolucion->save();
                    }
                    $idTipoResolucion = $tipoResolucion->id;
                }
              // Crear o actualizar el registro en Casos
                $idCaso = null;
                $id2 = trim($row['id2'] ?? '');

                if ($id2 !== '' && $id2 !== 'NULL') {
                    $caso = Caso::firstOrNew(['id2' => $id2]);
                    $caso->exp = $row['exp'] ?? null;
                    $caso->sala = $row['sala'] ?? null;
                    $caso->accion_const_id = $idSubtipoAccion;
                    $caso->accion_const2_id = $idAccionConstitucional;
                    $caso->res_emisor_id = $idResEmisor;
                    $caso->departamento_id = $idDepartamento;
                    $caso->municipio_id = $idMunicipio;

                    // Manejo de la fecha de ingreso
                    if (isset($row['fecha_ingreso']) && !empty($row['fecha_ingreso'])) {
                        Log::info('Fecha de ingreso recibida: ' . $row['fecha_ingreso']);
                        
                        // Asignar la fecha directamente sin conversión
                        $caso->fecha_ingreso = $row['fecha_ingreso'];
                        Log::info('Fecha de ingreso asignada: ' . $caso->fecha_ingreso);
                    } else {
                        Log::info('No se proporcionó fecha de ingreso. Asignando null.');
                        $caso->fecha_ingreso = null; // Asignar null si no hay fecha
                    }
                    

                    // Guardar el caso
                    if (!$caso->save()) {
                        Log::error('Error al guardar el caso: ' . json_encode($caso->getErrors()));
                    } else {
                        Log::info('Caso guardado con éxito: ' . json_encode($caso));
                    }
                }

                // Crear o actualizar el registro en Resolucion

                $idResolucion = null;
                $id2 = trim($row['id2'] ?? ''); // Tomar el 'id2' desde el archivo importado
                if ($id2 !== '' && $id2 !== 'NULL') {
                    // Buscar el caso por el campo 'id2' en lugar de 'exp'
                    $caso = Caso::where('id2', $id2)->first();

                    if ($caso) {
                        // Buscar o crear la resolución basada en 'numres2'
                        $resolucion = Resolucion::firstOrNew(['numres2' => $row['numres2']]);

                        // Asignar los valores al objeto Resolución
                        $resolucion->res_fecha = !empty($row['res_fecha']) ? Carbon::parse($row['res_fecha'])->format('Y-m-d') : null;
                        $resolucion->res_tipo_id = $idTipoResolucion ?? null;
                        $resolucion->res_tipo2_id = $idTipoResolucion2 ?? null;
                        $resolucion->res_fondo_voto = is_numeric($row['res_fondo_voto']) ? (int)$row['res_fondo_voto'] : null;
                        $resolucion->resresul = $row['resresul'] ?? null;
                        $resolucion->revresul = $row['revresul'] ?? null;
                        $resolucion->resfinal = $row['resfinal'] ?? null;
                        $resolucion->relator = $row['relator'] ?? null;
                        //$resolucion->restiempo = is_numeric($row['restiempo']) ? (float)$row['restiempo'] : null;
                        $resolucion->restiempo = is_numeric(str_replace(',', '.', $row['restiempo'])) ? (float)str_replace(',', '.', $row['restiempo']) : null;
                        $resolucion->caso_id = $caso->id; // Asignar la relación con el caso
                        
                        // Guardar la resolución
                        $resolucion->save();
                        
                        // Obtener el ID de la resolución
                        $idResolucion = $resolucion->id;
                    }
            }
            } catch (\Exception $e) {
                Log::error('Error al guardar la fila: ' . json_encode($row) . ' - Error: ' . $e->getMessage());
            }
        } 
    }
}