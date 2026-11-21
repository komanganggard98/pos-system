<?php

namespace App\Services;
use App\Models\User;
use Illuminate\Support\Facades\{DB, Hash};

class UserService {

    public function getData($request = [], $isPaginate = false, $orderBy = 'id', $orderType = 'asc'){
        $search = $request['search'] ?? null;
        $role = $request['role'] ?? null;

        $users = User::query()
        ->when($search, function($q) use($search){
            $q
            ->where('name','like', "%$search%")
            ->orWhere('email','like', "%$search%");
        })
        ->when($role, function($q) use($role){
            $q->where('role', $role);
        })
        ->orderBy($orderBy, $orderType)
        ->when($isPaginate, fn($q) => $q->paginate(config('app.data_per_page')), fn ($q) => $q->get());
    
        return $users;
    }

    public function store($validated){
        User::create([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
            'is_active' => $validated['is_active'] ?? true,
            'role'      => $validated['role']
        ]);
    }

    public function update($user, $validated){
 
        DB::transaction(function () use ($user, $validated) {
            $updateData = [
                'name'      => $validated['name'],
                'email'     => $validated['email'],
                'is_active' => $validated['is_active'] ?? true,
                'role'      => $validated['role'],
            ];

            // Hanya update password jika admin mengisi kolom password baru
            if (!empty($validated['password'])) {
                $updateData['password'] = Hash::make($validated['password']);
            }

            $user->update($updateData);
        });
    }

}