<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
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

        return back()->with('success', 'Food item added to your log.');
    }
} 