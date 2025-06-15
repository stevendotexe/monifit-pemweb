<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureProfileComplete
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if (
            $user &&
            (
                !$user->gender ||
                !$user->birth_date ||
                !$user->weight_kg ||
                !$user->height_cm
            )
        ) {
            if (!$request->is('onboarding')) {
                return redirect()->route('onboarding');
            }
        }
        return $next($request);
    }
} 