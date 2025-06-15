<?php

namespace App\Http\Controllers;

use App\Models\PreAddedFood;
use App\Models\Food;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PreAddedFoodController extends Controller
{
    public function index()
    {
        return Inertia::render('foods/pre-added', [
            'preAddedFoods' => PreAddedFood::all(),
        ]);
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

        return Inertia::render('foods/pre-added', [
            'preAddedFoods' => PreAddedFood::all(),
            'success' => true,
            'food' => $food,
        ]);
    }
}
