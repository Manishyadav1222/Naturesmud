<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $subscriber = NewsletterSubscriber::firstOrCreate(
            ['email' => $validated['email']],
            ['is_active' => true]
        );

        return response()->json([
            'message' => 'Subscribed successfully.',
            'subscriber' => $subscriber,
        ], 201);
    }

    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        NewsletterSubscriber::where('email', $validated['email'])->update(['is_active' => false]);

        return response()->json(['message' => 'Unsubscribed.']);
    }
}