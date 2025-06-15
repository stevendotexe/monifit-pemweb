<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'calories',
        'protein_g',
        'carbs_g',
        'fat_g',
        'consumed_at',
    ];

    protected $casts = [
        'calories' => 'integer',
        'protein_g' => 'double',
        'carbs_g' => 'double',
        'fat_g' => 'double',
        'consumed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 