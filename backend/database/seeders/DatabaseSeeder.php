<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ChecklistTemplate;
use App\Models\ChecklistField;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create sample doctors
        $doctors = [
            [
                'name' => 'Dr. John Doe',
                'email' => 'doctor1@example.com',
            ],
            [
                'name' => 'Dr. Jane Smith',
                'email' => 'doctor2@example.com',
            ],
        ];

        foreach ($doctors as $doctor) {
            User::create([
                'name' => $doctor['name'],
                'email' => $doctor['email'],
                'password' => Hash::make('password'),
                'role' => 'doctor',
                'is_active' => true,
            ]);
        }

        // Create sample checklist template
        $template = ChecklistTemplate::create([
            'name' => 'Initial Patient Consultation',
            'description' => 'Standard checklist for initial patient consultation',
            'created_by' => $admin->id,
            'is_active' => true,
        ]);

        // Add fields to template
        $fields = [
            [
                'label' => 'Patient Symptoms',
                'type' => 'textarea',
                'required' => true,
                'order' => 1,
                'help_text' => 'Describe the patient\'s symptoms',
            ],
            [
                'label' => 'Blood Pressure',
                'type' => 'text',
                'required' => true,
                'order' => 2,
                'help_text' => 'e.g., 120/80',
            ],
            [
                'label' => 'Temperature',
                'type' => 'number',
                'required' => true,
                'order' => 3,
                'help_text' => 'In Celsius',
            ],
            [
                'label' => 'Allergies',
                'type' => 'text',
                'required' => false,
                'order' => 4,
                'help_text' => 'List any known allergies',
            ],
            [
                'label' => 'Previous Medical History',
                'type' => 'textarea',
                'required' => false,
                'order' => 5,
                'help_text' => 'Any significant past medical conditions',
            ],
        ];

        foreach ($fields as $field) {
            ChecklistField::create(array_merge($field, ['template_id' => $template->id]));
        }

        echo "Database seeded successfully!\n";
        echo "Admin Email: admin@example.com\n";
        echo "Doctor Email: doctor1@example.com or doctor2@example.com\n";
        echo "Default Password: password\n";
    }
}
