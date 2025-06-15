<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    Route::get('/', function () {
        return Inertia::render('landing');
    })->name('home');

    Route::get('bmi-test', function () {
        return Inertia::render('bmi-test');
    })->name('bmi-test');

    Route::get('subscribe', function () {
        return Inertia::render('subscribe');
    })->name('subscribe');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('onboarding', function () {
        return Inertia::render('onboarding');
    })->name('onboarding');
    Route::post('onboarding', [\App\Http\Controllers\OnboardingController::class, 'store']);
    Route::get('onboarding', [\App\Http\Controllers\OnboardingController::class, 'show'])->name('onboarding');

    Route::resource('foods', App\Http\Controllers\FoodController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';