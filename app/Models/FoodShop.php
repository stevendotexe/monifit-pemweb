<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FoodShop extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'address',
        'latitude',
        'longitude',
        'phone',
        'email',
        'opening_hours',
        'closing_hours',
        'rating',
        'price_range',
        'cuisine_type',
        'is_vegetarian_friendly',
        'is_vegan_friendly',
        'is_gluten_free_friendly',
    ];

    protected $casts = [
        'is_vegetarian_friendly' => 'boolean',
        'is_vegan_friendly' => 'boolean',
        'is_gluten_free_friendly' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'rating' => 'decimal:1',
    ];

    public function images()
    {
        return $this->hasMany(FoodShopImage::class);
    }

    public function foods()
    {
        return $this->hasMany(VendorFood::class, 'food_shop_id');
    }
} 