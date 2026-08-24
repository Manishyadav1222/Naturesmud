<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reel;

class ReelController extends Controller
{
    public function index()
    {
        $reels = Reel::where('is_active', true)->orderBy('sort_order')->get();

        return response()->json([
            'data' => $reels,
        ]);
    }
}
