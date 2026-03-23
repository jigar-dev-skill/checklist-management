<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Checklist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function getReports(Request $request)
    {
        $user = Auth::user();

        $query = Checklist::query()
            ->with(['patient', 'doctor', 'template']);

        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->input('start_date'));
        }

        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->input('end_date'));
        }

        if (!$user->isAdmin()) {
            $query->where('doctor_id', $user->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $reports = $query->get();

        return response()->json([
            'reports' => $reports,
        ]);
    }

    public function exportPDF(Request $request)
    {
        // TODO: Implement PDF export using barryvdh/laravel-dompdf
        return response()->json(['message' => 'PDF export not yet implemented']);
    }

    public function exportExcel(Request $request)
    {
        // TODO: Implement Excel export using maatwebsite/excel
        return response()->json(['message' => 'Excel export not yet implemented']);
    }
}
