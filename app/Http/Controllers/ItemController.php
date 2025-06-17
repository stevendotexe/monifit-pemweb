<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DailyTotal;
use App\Models\Food;

class ItemController extends Controller
{
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'calories' => 'required|integer',
            'protein_g' => 'required|numeric',
            'carbs_g' => 'required|numeric',
            'fat_g' => 'required|numeric',
            'consumed_at' => 'required|date',
        ]);

        $item = Item::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'calories' => $validated['calories'],
            'protein_g' => $validated['protein_g'],
            'carbs_g' => $validated['carbs_g'],
            'fat_g' => $validated['fat_g'],
            'consumed_at' => $validated['consumed_at'],
        ]);

        // Update daily totals after creating the item
        $this->updateDailyTotals(auth()->id(), $validated['consumed_at']);

        return back()->with('success', 'Food item added to your log.');
    }
} 