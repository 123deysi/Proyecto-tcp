<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon; // Asegúrate de incluir Carbon para manejar fechas

class Caso extends Model
{
    use HasFactory;

    protected $table = 'casos';

    protected $fillable = [
        'id2',
        'exp',
        'sala',
        'accion_const_id',//para el subtipo
        'accion_const2_id',//para el tipo de accion
        'res_emidor_id',
        'departamento_id',
        'municipio_id',
        'fecha_ingreso',
    ];


    public function resEmisor()
    {
        return $this->belongsTo(ResEmisor::class, 'res_emisor_id');
    }
    public function accionConstitucional()
    {
        return $this->belongsTo(SubtipoAccion::class, 'accion_const_id');
    }

    public function accionConstitucional2()
    {
        return $this->belongsTo(AccionConstitucional::class, 'accion_const2_id');
    }



    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'departamento_id');
    }

    public function municipio()
    {
        return $this->belongsTo(Municipio::class, 'municipio_id');
    }

}
