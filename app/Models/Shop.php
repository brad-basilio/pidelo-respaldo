<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    use HasFactory, HasUuids;
    public $incrementing = false;
    protected $keyType ='string';
   

    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo',
        'phone',
        'email',
        'address',
        'website',
        'visible',
        'status'
    ];
    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
