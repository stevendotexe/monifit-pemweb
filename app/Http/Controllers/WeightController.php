<?php

namespace App\Http\Controllers;

use App\Models\WeightLog;
use App\Models\DailyTotal;
use App\Models\Food;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class WeightController extends Controller
{
    public function log(Request $request)
    {
        $request->validate([
            'weight_kg' => 'required|numeric|min:20|max:300'
        ]);

        WeightLog::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'date' => now()->toDateString()
            ],
            [
                'weight_kg' => $request->weight_kg
            ]
        );

        return back();
    }

    public function history()
    {
        $user = Auth::user();
        $thirtyDaysAgo = Carbon::now()->subDays(30);

        // Get weight logs
        $weightLogs = WeightLog::where('user_id', $user->id)
            ->where('date', '>=', $thirtyDaysAgo)
            ->orderBy('date', 'asc')
            ->get();

        // Get nutrition data
        $nutritionData = Food::where('user_id', $user->id)
            ->where('consumed_at', '>=', $thirtyDaysAgo)
            ->selectRaw('
                DATE(consumed_at) as date,
                SUM(calories) as calories,
                SUM(protein_g) as protein_g,
                SUM(carbs_g) as carbs_g,
                SUM(fat_g) as fat_g
            ')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Get hydration data
        $hydrationData = DailyTotal::where('user_id', $user->id)
            ->where('date', '>=', $thirtyDaysAgo)
            ->select('date', 'water_ml')
            ->orderBy('date', 'asc')
            ->get();

        // Add dummy data if no real data exists
        if ($weightLogs->isEmpty()) {
            $weightLogs = collect();
            $currentWeight = $user->weight_kg;
            for ($i = 30; $i >= 0; $i--) {
                $weightLogs->push([
                    'id' => $i,
                    'weight_kg' => $currentWeight + (rand(-10, 10) / 10),
                    'date' => Carbon::now()->subDays($i)->toDateString()
                ]);
            }
        }

        if ($nutritionData->isEmpty()) {
            $nutritionData = collect();
            for ($i = 30; $i >= 0; $i--) {
                $nutritionData->push([
                    'date' => Carbon::now()->subDays($i)->toDateString(),
                    'calories' => rand(1500, 2500),
                    'protein_g' => rand(50, 100),
                    'carbs_g' => rand(150, 250),
                    'fat_g' => rand(40, 80)
                ]);
            }
        }

        if ($hydrationData->isEmpty()) {
            $hydrationData = collect();
            for ($i = 30; $i >= 0; $i--) {
                $hydrationData->push([
                    'date' => Carbon::now()->subDays($i)->toDateString(),
                    'water_ml' => rand(1000, 3000)
                ]);
            }
        }

        return Inertia::render('data/history', [
            'weightLogs' => $weightLogs,
            'nutritionData' => $nutritionData,
            'hydrationData' => $hydrationData
        ]);
    }
}
