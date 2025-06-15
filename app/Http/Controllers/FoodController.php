<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

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

    public function store(Request $request)
    {
        \Log::info('Food store request data:', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'calories' => 'required|numeric|min:0',
            'protein_g' => 'required|numeric|min:0',
            'carbs_g' => 'required|numeric|min:0',
            'fat_g' => 'required|numeric|min:0',
            'consumed_at' => 'required|date',
            'description' => 'nullable|string',
        ]);

        \Log::info('Validated data:', $validated);

        try {
            $food = $request->user()->foods()->create($validated);
            \Log::info('Food created:', $food->toArray());

            if ($request->wantsJson()) {
                return response()->json(['success' => true, 'food' => $food]);
            }

            return redirect()->route('foods.index')->with('success', 'Food item created successfully.');
        } catch (\Exception $e) {
            \Log::error('Error creating food:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            if ($request->wantsJson()) {
                return response()->json(['success' => false, 'message' => 'Failed to create food item'], 500);
            }

            return redirect()->back()->with('error', 'Failed to create food item');
        }
    }

    public function edit(Request $request, $id)
    {
        $food = $request->user()->foods()->findOrFail($id);
        return inertia('foods/edit', ['food' => $food]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'calories' => 'required|numeric|min:0',
            'protein_g' => 'required|numeric|min:0',
            'carbs_g' => 'required|numeric|min:0',
            'fat_g' => 'required|numeric|min:0',
            'consumed_at' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $food = $request->user()->foods()->findOrFail($id);

        $food->update($validated);

        return redirect()->route('foods.index')->with('success', 'Food item updated successfully.');
    }

    public function destroy(Request $request, $id)
    {
        $food = $request->user()->foods()->findOrFail($id);
        $food->delete();

        return redirect()->route('foods.index')->with('success', 'Food item deleted successfully.');
    }
}