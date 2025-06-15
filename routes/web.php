<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use App\Models\Food;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\WaterController;
use App\Models\DailyTotal;
use App\Http\Controllers\WeightController;
use App\Http\Controllers\PreAddedFoodController;

Route::get('/', function () {
    return Inertia::render('landing');
})->name('home');

Route::get('bmi-test', function () {
    return Inertia::render('bmi-test');
})->name('bmi-test');

Route::get('subscribe', function () {
    return Inertia::render('subscribe');
})->name('subscribe');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user();
        $today = Carbon::today();

        // Get food totals
        $totals = Food::where('user_id', $user->id)
            ->whereDate('consumed_at', $today)
            ->selectRaw('
                COALESCE(SUM(calories),0) as calories,
                COALESCE(SUM(protein_g),0) as protein_g,
                COALESCE(SUM(carbs_g),0) as carbs_g,
                COALESCE(SUM(fat_g),0) as fat_g
            ')
            ->first();

        // Get water total
        $waterTotal = DailyTotal::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->value('water_ml') ?? 0;

        $todayFoods = Food::where('user_id', $user->id)
            ->whereDate('consumed_at', $today)
            ->orderBy('consumed_at', 'desc')
            ->get();

        return Inertia::render('dashboard', [
            'todayTotals' => [
                'calories' => (int) $totals->calories,
                'protein_g' => (float) $totals->protein_g,
                'carbs_g' => (float) $totals->carbs_g,
                'fat_g' => (float) $totals->fat_g,
                'water_ml' => (int) $waterTotal,
            ],
            'todayFoods' => $todayFoods
        ]);
    })->name('dashboard');
    Route::get('onboarding', function () {
        return Inertia::render('onboarding');
    })->name('onboarding');
    Route::post('onboarding', [\App\Http\Controllers\OnboardingController::class, 'store']);
    Route::get('onboarding', [\App\Http\Controllers\OnboardingController::class, 'show'])->name('onboarding');

    // Pre-added foods route
    Route::get('/foods/pre-added', [PreAddedFoodController::class, 'index'])->name('foods.pre-added');

    // Foods resource route
    Route::resource('foods', App\Http\Controllers\FoodController::class);

    // Vendor routes
    Route::get('vendors', [VendorController::class, 'index'])->name('vendors.index');
    Route::get('vendors/{vendor}', [VendorController::class, 'show'])->name('vendors.show');

    // Food logging routes
    Route::post('/items', [ItemController::class, 'store'])->name('items.store');

    // Water logging route
    Route::post('/water/log', [WaterController::class, 'log'])->name('water.log');

    // Weight logging routes
    Route::post('/weight/log', [WeightController::class, 'log'])->name('weight.log');
    Route::get('/data/history', [WeightController::class, 'history'])->name('data.history');

    // Pre-added foods add to log route
    Route::post('/pre-added-foods/{id}/add-to-log', [PreAddedFoodController::class, 'addToLog'])->name('pre-added-foods.add-to-log');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';