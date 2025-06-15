<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FoodShopImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'food_shop_id',
        'image_url',
        'image_type',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function foodShop()
    {
        return $this->belongsTo(FoodShop::class);
    }
}
