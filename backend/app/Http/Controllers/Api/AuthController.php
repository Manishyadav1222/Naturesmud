<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['required', 'confirmed', 'min:6'],
        ], [
            'email.unique' => 'This email is already registered. Please log in instead.',
            'password.confirmed' => 'The password confirmation does not match.',
            'password.min' => 'Password must be at least 6 characters.',
        ]);

        $user = User::create([
            'name' => trim($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'phone' => !empty($validated['phone']) ? trim($validated['phone']) : null,
            'password' => $validated['password'],
            'is_active' => true,
        ]);

        try {
            $user->assignRole('customer');
        } catch (\Throwable $e) {
            // Role fallback
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Account registered successfully.',
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'Email or phone number is required.',
            'password.required' => 'Password is required.',
        ]);

        $loginInput = trim($credentials['email']);
        $user = User::where('email', strtolower($loginInput))
            ->orWhere('phone', $loginInput)
            ->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Invalid email/phone or password. Please try again.'], 401);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Your account is deactivated. Please contact support.'], 403);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Logged in successfully.',
        ]);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()?->delete();
        }

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('addresses', 'wishlist.product'));
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        if (isset($validated['name'])) $user->name = trim($validated['name']);
        if (isset($validated['email'])) $user->email = strtolower(trim($validated['email']));
        if (isset($validated['phone'])) $user->phone = trim($validated['phone']);
        $user->save();

        return response()->json([
            'user' => $user,
            'message' => 'Profile updated successfully.',
        ]);
    }
}