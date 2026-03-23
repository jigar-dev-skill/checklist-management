<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'failed_login_attempts',
        'locked_until',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'locked_until' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function patients()
    {
        return $this->hasMany(Patient::class, 'assigned_doctor_id');
    }

    public function checklists()
    {
        return $this->hasMany(Checklist::class, 'doctor_id');
    }

    public function createdTemplates()
    {
        return $this->hasMany(ChecklistTemplate::class, 'created_by');
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isDoctor()
    {
        return $this->role === 'doctor';
    }

    public function isLocked()
    {
        return $this->locked_until && now()->isBefore($this->locked_until);
    }
}
