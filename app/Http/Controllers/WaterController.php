<?php

namespace App\Http\Controllers;

use App\Models\DailyTotal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WaterController extends Controller
{
    public function log(Request $request)
    {
        $request->validate([
            'amount' => 'required|integer|min:1'
        ]);

        // Get today's record or create a new one
        $today = DailyTotal::firstOrCreate(
            [
                'user_id' => Auth::id(),
                'date' => now()->toDateString()
            ],
            [
                'calories' => 0,
                'protein_g' => 0,
                'carbs_g' => 0,
                'fat_g' => 0,
                'water_ml' => 0
            ]
        );

        // Add the new water amount to the existing total
        $today->water_ml = ($today->water_ml ?? 0) + $request->amount;
        $today->save();

        return back();
    }
}
