<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorFood extends Model
{
    use HasFactory;

    protected $table = 'vendor_foods';

    protected $fillable = [
        'food_shop_id',
        'name',
        'description',
        'price',
        'calories',
        'protein_g',
        'carbs_g',
        'fat_g',
        'image_url',
        'category',
        'is_available',
        'is_vegetarian',
        'is_vegan',
        'is_gluten_free',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'calories' => 'integer',
        'protein_g' => 'decimal:2',
        'carbs_g' => 'decimal:2',
        'fat_g' => 'decimal:2',
        'is_available' => 'boolean',
        'is_vegetarian' => 'boolean',
        'is_vegan' => 'boolean',
        'is_gluten_free' => 'boolean',
    ];

    public function foodShop()
    {
        return $this->belongsTo(FoodShop::class);
    }
} 