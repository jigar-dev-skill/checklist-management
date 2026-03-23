<?php

namespace App\Policies;

use App\Models\Patient;
use App\Models\User;

class PatientPolicy
{
    public function viewAny(User $user)
    {
        return true;
    }

    public function view(User $user, Patient $patient)
    {
        return $user->isAdmin() || $user->id === $patient->assigned_doctor_id;
    }

    public function create(User $user)
    {
        return $user->isAdmin();
    }

    public function update(User $user, Patient $patient)
    {
        return $user->isAdmin() || $user->id === $patient->assigned_doctor_id;
    }

    public function delete(User $user, Patient $patient)
    {
        return $user->isAdmin();
    }
}
