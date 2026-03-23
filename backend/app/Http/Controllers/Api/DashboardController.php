<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Checklist;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function adminDashboard()
    {
        $this->authorize('viewAdminDashboard', User::class);

        $totalPatients = Patient::count();
        $totalDoctors = User::where('role', 'doctor')->count();
        $totalChecklists = Checklist::count();
        $completedChecklists = Checklist::where('status', 'completed')->count();

        $chartData = [
            'monthly_checklists' => $this->getMonthlyChecklistData(),
            'checklist_status' => Checklist::selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get()
                ->keyBy('status'),
        ];

        return response()->json([
            'total_patients' => $totalPatients,
            'total_doctors' => $totalDoctors,
            'total_checklists' => $totalChecklists,
            'completed_checklists' => $completedChecklists,
            'chart_data' => $chartData,
        ]);
    }

    public function doctorDashboard()
    {
        $user = Auth::user();
        $totalPatients = $user->patients()->count();
        $totalChecklists = $user->checklists()->count();
        $completedChecklists = $user->checklists()
            ->where('status', 'completed')
            ->count();

        $chartData = [
            'monthly_checklists' => $this->getMonthlyChecklistDataForDoctor($user->id),
            'checklist_status' => $user->checklists()
                ->selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get()
                ->keyBy('status'),
        ];

        return response()->json([
            'total_patients' => $totalPatients,
            'total_checklists' => $totalChecklists,
            'completed_checklists' => $completedChecklists,
            'chart_data' => $chartData,
        ]);
    }

    private function getMonthlyChecklistData()
    {
        $data = Checklist::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return $data;
    }

    private function getMonthlyChecklistDataForDoctor($doctorId)
    {
        $data = Checklist::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('doctor_id', $doctorId)
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return $data;
    }
}
