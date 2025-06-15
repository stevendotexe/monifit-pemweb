<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Food extends Model
{
    protected $table = 'foods';
    protected $fillable = ['user_id', 'name', 'calories', 'protein_g', 'carbs_g', 'fat_g', 'consumed_at', 'description'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}