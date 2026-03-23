<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Patient::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('mobile_number', 'like', "%{$search}%");
        }

        if (!$user->isAdmin() && $user->isDoctor()) {
            $query->where('assigned_doctor_id', $user->id);
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date_of_birth' => 'nullable|date',
            'mobile_number' => 'required|string|unique:patients',
            'city_village' => 'nullable|string|max:255',
            'assigned_doctor_id' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $patient = Patient::create($validated);

        return response()->json([
            'message' => 'Patient created successfully',
            'patient' => $patient,
        ], 201);
    }

    public function show(Patient $patient)
    {
        $this->authorize('view', $patient);

        return response()->json($patient->load('checklists', 'doctor'));
    }

    public function update(Request $request, Patient $patient)
    {
        $this->authorize('update', $patient);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'date_of_birth' => 'nullable|date',
            'mobile_number' => 'sometimes|required|string|unique:patients,mobile_number,' . $patient->id,
            'city_village' => 'nullable|string|max:255',
            'assigned_doctor_id' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $patient->update($validated);

        return response()->json([
            'message' => 'Patient updated successfully',
            'patient' => $patient,
        ]);
    }

    public function destroy(Patient $patient)
    {
        $this->authorize('delete', $patient);

        $patient->delete();

        return response()->json(['message' => 'Patient deleted successfully']);
    }
}
