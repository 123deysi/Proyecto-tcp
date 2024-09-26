<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Admin',
            'email' => 'carlos@gmail.com',
            'password' => Hash::make('carlos123'), // Asegúrate de usar un hash seguro para la contraseña
        ]);
        User::create([
            'name' => 'Admin-deysi',
            'email' => 'deysi@gmail.com',
            'password' => Hash::make('deysi123'), 
        ]);
        User::create([
            'name' => 'Admin-jose',
            'email' => 'jose@gmail.com',
            'password' => Hash::make('jose123'), // Asegúrate de usar un hash seguro para la contraseña
        ]);
    }
}
