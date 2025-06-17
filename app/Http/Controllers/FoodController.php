<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\DailyTotal;
use App\Models\Food;

class FoodController extends Controller
{
    public function index(Request $request)
    {
        $foodsByDay = $request->user()
            ->foods()
            ->latest('consumed_at')
            ->get()
            ->groupBy(function ($food) {
                return Carbon::parse($food->consumed_at)->format('Y-m-d');
            })
            ->map(function ($dayFoods, $date) {
                $carbonDate = Carbon::parse($date);
                $formattedDate = '';

                if ($carbonDate->isToday()) {
                    $formattedDate = 'Today, ' . $carbonDate->format('F j');
                } elseif ($carbonDate->isYesterday()) {
                    $formattedDate = 'Yesterday, ' . $carbonDate->format('F j');
                } else {
                    $formattedDate = $carbonDate->format('l, F j, Y');
                }

                return [
                    'date' => $date,
                    'formatted_date' => $formattedDate,
                    'foods' => $dayFoods,
                    'totals' => [
                        'calories' => $dayFoods->sum('calories'),
                        'protein_g' => $dayFoods->sum('protein_g'),
                        'carbs_g' => $dayFoods->sum('carbs_g'),
                        'fat_g' => $dayFoods->sum('fat_g'),
                    ],
                ];
            })
            ->values();

        return inertia('foods/index', ['foodsByDay' => $foodsByDay]);
    }

    public function create()
    {
        return inertia('foods/create');
    }

    public function show(Request $request, $id)
    {
        $food = $request->user()->foods()->findOrFail($id);
        return inertia('foods/show', ['food' => $food]);
    }

    private function updateDailyTotals($userId, $date)
    {
        $date = date('Y-m-d', strtotime($date));

        $totals = Food::where('user_id', $userId)
            ->whereDate('consumed_at', $date)
            ->selectRaw('
                COALESCE(SUM(calories),0) as calories,
                COALESCE(SUM(protein_g),0) as protein_g,
                COALESCE(SUM(carbs_g),0) as carbs_g,
                COALESCE(SUM(fat_g),0) as fat_g
            ')
            ->first();

            $dailyTotal = DailyTotal::where('user_id', $userId)
            ->whereDate('date', $date)
            ->first();

        if ($dailyTotal) {
            // Update existing record
            $dailyTotal->calories = (int) $totals->calories;
            $dailyTotal->protein_g = (int) $totals->protein_g;
            $dailyTotal->carbs_g = (int) $totals->carbs_g;
            $dailyTotal->fat_g = (int) $totals->fat_g;
            $dailyTotal->save();
        } else {
            // Create new record only if there are food items
            if ($totals->calories > 0 || $totals->protein_g > 0 || $totals->carbs_g > 0 || $totals->fat_g > 0) {
                DailyTotal::create([
                    'user_id' => $userId,
                    'date' => $date,
                    'calories' => (int) $totals->calories,
                    'protein_g' => (int) $totals->protein_g,
                    'carbs_g' => (int) $totals->carbs_g,
                    'fat_g' => (int) $totals->fat_g,
                ]);
            }
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'calories' => 'required|numeric|min:0',
            'protein_g' => 'required|numeric|min:0',
            'carbs_g' => 'required|numeric|min:0',
            'fat_g' => 'required|numeric|min:0',
            'consumed_at' => 'required|date',
        ]);

        $food = $request->user()->foods()->create($request->all());

        // Update daily totals after creating the food entry
        $this->updateDailyTotals($request->user()->id, $request->consumed_at);

        return redirect()->route('foods.index');
    }

    public function edit(Request $request, $id)
    {
        $food = $request->user()->foods()->findOrFail($id);
        return inertia('foods/edit', ['food' => $food]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'calories' => 'required|numeric|min:0',
            'protein_g' => 'required|numeric|min:0',
            'carbs_g' => 'required|numeric|min:0',
            'fat_g' => 'required|numeric|min:0',
            'consumed_at' => 'required|date',
        ]);

        $food = $request->user()->foods()->findOrFail($id);
        $oldDate = $food->consumed_at;
        $food->update($request->all());

        // Update daily totals for both old and new dates
        $this->updateDailyTotals($request->user()->id, $oldDate);
        $this->updateDailyTotals($request->user()->id, $request->consumed_at);

        return redirect()->route('foods.index');
    }

    public function destroy(Request $request, $id)
    {
        $food = $request->user()->foods()->findOrFail($id);
        $date = $food->consumed_at;
        
        // Delete the food entry
        $food->delete();

        // Update daily totals after deleting the food entry
        $this->updateDailyTotals($request->user()->id, $date);

        return redirect()->route('foods.index');
    }
}