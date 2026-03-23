<?php

namespace App\Policies;

use App\Models\ChecklistTemplate;
use App\Models\User;

class ChecklistTemplatePolicy
{
    public function viewAny(User $user)
    {
        return true;
    }

    public function view(User $user, ChecklistTemplate $template)
    {
        return true;
    }

    public function create(User $user)
    {
        return $user->isAdmin();
    }

    public function update(User $user, ChecklistTemplate $template)
    {
        return $user->isAdmin() || $user->id === $template->created_by;
    }

    public function delete(User $user, ChecklistTemplate $template)
    {
        return $user->isAdmin() || $user->id === $template->created_by;
    }
}
