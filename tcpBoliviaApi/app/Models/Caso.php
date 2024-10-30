<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Caso extends Model
{
    use HasFactory;

    protected $table = 'casos';

    protected $fillable = [
        'id2',
        'exp',
        'sala',
        'accion_const_id',
        'accion_const2_id',
        'res_emisor_id',
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
<<<<<<< HEAD

    // Accesor para formatear la fecha cuando se lee desde el modelo
    public function getFechaIngresoAttribute($value)
    {
        return $value ? Carbon::parse($value)->format('d/m/Y') : null;
    }

    // Mutador para convertir la fecha a un formato específico antes de guardar
    public function setFechaIngresoAttribute($value)
    {
        $this->attributes['fecha_ingreso'] = $value ? Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d') : null;
    }


    
=======
>>>>>>> ea763639594b34ede0b282b136e6aba82d18378a
}
