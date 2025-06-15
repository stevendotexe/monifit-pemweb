<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreAddedFood extends Model
{
    use HasFactory;

    protected $table = 'pre_added_foods';

    protected $fillable = [
        'name',
        'description',
        'calories',
        'protein_g',
        'carbs_g',
        'fat_g',
        'is_vegetarian',
        'is_vegan',
        'is_gluten_free',
        'is_halal',
        'image_url',
    ];

    protected $casts = [
        'calories' => 'decimal:2',
        'protein_g' => 'decimal:2',
        'carbs_g' => 'decimal:2',
        'fat_g' => 'decimal:2',
        'is_vegetarian' => 'boolean',
        'is_vegan' => 'boolean',
        'is_gluten_free' => 'boolean',
    ];
}
