<?php

namespace App\Policies;

use App\Models\Checklist;
use App\Models\User;

class ChecklistPolicy
{
    public function viewAny(User $user)
    {
        return true;
    }

    public function view(User $user, Checklist $checklist)
    {
        return $user->isAdmin() || $user->id === $checklist->doctor_id;
    }

    public function create(User $user)
    {
        return $user->isDoctor();
    }

    public function update(User $user, Checklist $checklist)
    {
        return $user->isAdmin() || ($user->id === $checklist->doctor_id && $checklist->status === 'draft');
    }

    public function delete(User $user, Checklist $checklist)
    {
        return $user->isAdmin();
    }
}
