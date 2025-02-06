<?php

namespace Database\Seeders;

use App\Models\SystemColor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SystemColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colors = [
            [
                'name' => 'primary',
                'description' => '#007BFF',
            ],
            [
                'name' => 'secondary',
                'description' => '#28A745',
            ],
            [
                'name' => 'accent',
                'description' => '#FFC107',
            ],
            [
                'name' => 'neutral-light',
                'description' => '#F8F9FA',
            ],
            [
                'name' => 'neutral-dark',
                'description' => '#343A40',
            ],

        ];

        SystemColor::truncate();
        foreach ($colors as $color) {
            SystemColor::updateOrCreate(['name' => $color['name']], $color);
        }
    }
}
