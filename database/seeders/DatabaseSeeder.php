<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        
        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
            'role' => 'admin',
            'password' => bcrypt('password'), // password
        ]);

        User::factory()->create([
            'name' => 'cashier',
            'email' => 'cashier@example.com',
            'email_verified_at' => now(),
            'role' => 'cashier',
            'password' => bcrypt('password'), // password
        ]);
    }
}
