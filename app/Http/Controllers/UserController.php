<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use App\Services\UserService;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ){}

    public function index(Request $request)
    {
        $users = $this->userService->getData($request, true, 'id','desc');
        return Inertia::render('users/index', [
            'users'   => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('users/create', [
            'roles' => ['admin','cashier'],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users,email',
            'password'   => ['required', 'confirmed', Password::min(8)],
            'is_active'  => 'boolean',
            'role'       => 'required|in:admin,cashier',
        ]);

        $this->userService->store($validated);

        return redirect()
            ->route('users.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        return Inertia::render('users/edit', [
            'user'  => $user,
            'roles' => ['admin','cashier'],
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password'   => ['nullable', 'confirmed', Password::min(8)],
            'is_active'  => 'boolean',
            'role'       => 'required|in:admin,cashier',
        ]);

        $this->userService->update($user, $validated);

        return redirect()
            ->route('users.index')
            ->with('success', 'User updated successfully.');
    }
}
