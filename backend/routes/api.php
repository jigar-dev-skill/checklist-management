<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\ChecklistTemplateController;
use App\Http\Controllers\Api\ChecklistController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Users (Admin only)
    Route::apiResource('users', UserController::class);
    Route::post('/users/{user}/change-password', [UserController::class, 'changePassword']);

    // Patients
    Route::apiResource('patients', PatientController::class);

    // Checklist Templates (Admin only)
    Route::apiResource('checklist-templates', ChecklistTemplateController::class);

    // Checklists
    Route::apiResource('checklists', ChecklistController::class);
    Route::post('/checklists/{checklist}/submit-responses', [ChecklistController::class, 'submitResponses']);
    Route::post('/checklists/{checklist}/complete', [ChecklistController::class, 'complete']);

    // Dashboard
    Route::get('/dashboard/admin', [DashboardController::class, 'adminDashboard']);
    Route::get('/dashboard/doctor', [DashboardController::class, 'doctorDashboard']);

    // Reports
    Route::get('/reports', [ReportController::class, 'getReports']);
    Route::get('/reports/export-pdf', [ReportController::class, 'exportPDF']);
    Route::get('/reports/export-excel', [ReportController::class, 'exportExcel']);
});
