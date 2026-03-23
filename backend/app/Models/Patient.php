<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'date_of_birth',
        'mobile_number',
        'city_village',
        'assigned_doctor_id',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'is_active' => 'boolean',
    ];

    public function doctor()
    {
        return $this->belongsTo(User::class, 'assigned_doctor_id');
    }

    public function checklists()
    {
        return $this->hasMany(Checklist::class);
    }
}
