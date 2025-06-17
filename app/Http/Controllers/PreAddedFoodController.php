<?php

namespace App\Http\Controllers;

use App\Models\PreAddedFood;
use App\Models\Food;
use App\Models\DailyTotal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PreAddedFoodController extends Controller
{
    public function index()
    {
        return Inertia::render('foods/pre-added', [
            'preAddedFoods' => PreAddedFood::take(100)->get(),
        ]);
    }

    private function updateDailyTotals($userId, $date)
    {
        // Calculate totals for the day
        $totals = Food::where('user_id', $userId)
            ->whereDate('consumed_at', $date)
            ->selectRaw('
                COALESCE(SUM(calories),0) as calories,
                COALESCE(SUM(protein_g),0) as protein_g,
                COALESCE(SUM(carbs_g),0) as carbs_g,
                COALESCE(SUM(fat_g),0) as fat_g
            ')
            ->first();

        // Get existing daily total or create new one
        $dailyTotal = DailyTotal::firstOrNew([
            'user_id' => $userId,
            'date' => $date,
        ]);

        // Update the values
        $dailyTotal->calories = (int) $totals->calories;
        $dailyTotal->protein_g = (int) $totals->protein_g;
        $dailyTotal->carbs_g = (int) $totals->carbs_g;
        $dailyTotal->fat_g = (int) $totals->fat_g;
        $dailyTotal->save();
    }

    public function addToLog(Request $request, $id)
    {
        $preAddedFood = PreAddedFood::findOrFail($id);

        $food = Food::create([
            'user_id' => auth()->id(),
            'name' => $preAddedFood->name,
            'description' => $preAddedFood->description,
            'calories' => $preAddedFood->calories,
            'protein_g' => $preAddedFood->protein_g,
            'carbs_g' => $preAddedFood->carbs_g,
            'fat_g' => $preAddedFood->fat_g,
            'consumed_at' => now(),
        ]);

        // Update daily totals after creating the food entry
        $this->updateDailyTotals(auth()->id(), now()->toDateString());

        return Inertia::render('foods/pre-added', [
            'preAddedFoods' => PreAddedFood::all(),
            'success' => true,
            'food' => $food,
        ]);
    }
}
