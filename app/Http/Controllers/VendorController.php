<?php

namespace App\Http\Controllers;

use App\Models\FoodShop;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function index(Request $request)
    {
        $query = FoodShop::query();

        // Search by name or description
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by cuisine type
        if ($request->has('cuisine_type')) {
            $query->where('cuisine_type', $request->input('cuisine_type'));
        }

        // Filter by dietary preferences
        if ($request->has('vegetarian')) {
            $query->where('is_vegetarian_friendly', true);
        }
        if ($request->has('vegan')) {
            $query->where('is_vegan_friendly', true);
        }
        if ($request->has('gluten_free')) {
            $query->where('is_gluten_free_friendly', true);
        }

        $vendors = $query->with(['images' => function($query) {
            $query->where('is_primary', true);
        }])->paginate(9);

        return Inertia::render('Vendors/Index', [
            'vendors' => $vendors,
            'filters' => $request->only(['search', 'cuisine_type', 'vegetarian', 'vegan', 'gluten_free']),
        ]);
    }

    public function show(FoodShop $vendor)
    {
        $vendor->load(['images', 'foods' => function($query) {
            $query->where('is_available', true);
        }]);

        return Inertia::render('Vendors/Show', [
            'vendor' => $vendor,
        ]);
    }
}
