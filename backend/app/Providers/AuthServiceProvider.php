<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        \App\Models\Patient::class => \App\Policies\PatientPolicy::class,
        \App\Models\Checklist::class => \App\Policies\ChecklistPolicy::class,
        \App\Models\ChecklistTemplate::class => \App\Policies\ChecklistTemplatePolicy::class,
        \App\Models\User::class => \App\Policies\UserPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
