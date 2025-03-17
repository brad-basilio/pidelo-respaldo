<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'nombre',
        'tipo_documento',
        'numero_identidad',
        'celular',
        'correo_electronico',
        'departamento',
        'provincia',
        'distrito',
        'direccion',
        'tipo_producto',
        'monto_reclamado',
        'descripcion_producto',
        'tipo_reclamo',
        'fecha_ocurrencia',
        'numero_pedido',
        'detalle_reclamo',
        'acepta_terminos',
        'recaptcha_token',
    ];
}
