<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'gender',
        'birth_date',
        'weight_kg',
        'height_cm',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getBmrAttribute(): ?float
    {
        if (!$this->birth_date || !$this->weight_kg || !$this->height_cm || !$this->gender) {
            return null;
        }

        $age = Carbon::parse($this->birth_date)->age;

        if (strtolower($this->gender) === 'male') {
            // Rumus BMR untuk Pria
            return 88.362 + (13.397 * $this->weight_kg) + (4.799 * $this->height_cm) - (5.677 * $age);
        } elseif (strtolower($this->gender) === 'female') {
            // Rumus BMR untuk Wanita
            return 447.593 + (9.247 * $this->weight_kg) + (3.098 * $this->height_cm) - (4.330 * $age);
        }

        return null;
    }

    public function foods(): HasMany
    {
        return $this->hasMany(Food::class);
    }
}