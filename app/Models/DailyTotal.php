<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyTotal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'calories',
        'protein_g',
        'carbs_g',
        'fat_g',
        'water_ml',
    ];

    protected $casts = [
        'date' => 'date',
        'calories' => 'integer',
        'protein_g' => 'integer',
        'carbs_g' => 'integer',
        'fat_g' => 'integer',
        'water_ml' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
