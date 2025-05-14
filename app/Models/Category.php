<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'slug',
        'name',
        'description',
        'banner',
        'image',
        'featured',
        'visible',
        'status',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'visible' => 'boolean',
        'status' => 'boolean',
    ];

    public function subcategories()
    {
        return $this->hasMany(SubCategory::class)->where('status', true);
    }
}
