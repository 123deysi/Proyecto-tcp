<?php

namespace App\Imports;

use App\Models\ExcelDBRegistro;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\Importable;
use Illuminate\Support\Collection;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Illuminate\Support\Facades\Log;

class ExcelImport implements ToCollection
{
    use Importable;

    public function collection(Collection $collection)
    {
        Log::info('Contenido del archivo importado: ' . json_encode($collection->toArray()));

        $rows = $collection->skip(1);

        foreach ($rows as $row) {
            Log::info('Fila importada: ' . json_encode($row));

            if (count($row) != 18) {
                Log::error('Número incorrecto de columnas en la fila: ' . json_encode($row));
                continue;
            }

            try {
                ExcelDBRegistro::create([
                    'numres2'         => $row[0] ?? null,
                    'res_fecha'       => isset($row[1]) && !empty($row[1]) ? \Carbon\Carbon::parse($row[1])->format('Y-m-d') : null,
                    'res_tipo'        => $row[2] ?? null,
                    'res_tipo2'       => $row[3] ?? null,
                    'res_fondo_voto' => isset($row[4]) && is_numeric($row[4]) ? (int)$row[4] : null,
                    'resresul'        => $row[5] ?? null,
                    'revresul'        => $row[6] ?? null,
                    'resfinal'        => $row[7] ?? null,
                    'relator'         => $row[8] ?? null,
                    'restiempo'       => isset($row[9]) && is_numeric($row[9]) ? (float)$row[9] : null,
                    'caso_id'         => $row[10] ?? null,
                    'sala'            => $row[11] ?? null,
                    'accion_const'    => $row[12] ?? null,
                    'accion_const2'   => $row[13] ?? null,
                    'res_emisor'      => $row[14] ?? null,
                    'departamento_id' => $row[15] ?? null,
                    'municipio_id'    => $row[16] ?? null,
                    'fecha_ingreso'   => isset($row[17]) && !empty($row[17]) ? \Carbon\Carbon::parse($row[17])->format('Y-m-d') : null,
                ]);
            } catch (\Exception $e) {
                Log::error('Error al guardar la fila: ' . json_encode($row) . ' - Error: ' . $e->getMessage());
            }
        }
    }
}
