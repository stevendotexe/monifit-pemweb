<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function show(Request $request)
    {
        $user = Auth::user();
        if (
            !empty($user->gender) &&
            !empty($user->birth_date) &&
            !empty($user->weight_kg) &&
            !empty($user->height_cm)
        ) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('onboarding');
    }

    public function store(Request $request)
    {
        $request->validate([
            'gender' => 'required|string',
            'birth_date' => 'required|date',
            'weight_kg' => 'required|numeric',
            'height_cm' => 'required|numeric',
        ]);

        $user = Auth::user();
        $user->update($request->only('gender', 'birth_date', 'weight_kg', 'height_cm'));

        return redirect()->route('dashboard');
    }
} 