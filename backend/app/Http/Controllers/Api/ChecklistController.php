<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Checklist;
use App\Models\ChecklistResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChecklistController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Checklist::query();

        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->input('patient_id'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if (!$user->isAdmin()) {
            $query->where('doctor_id', $user->id);
        }

        return response()->json(
            $query->with(['patient', 'doctor', 'template'])
                ->latest()
                ->paginate(15)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'template_id' => 'required|exists:checklist_templates,id',
        ]);

        $checklist = Checklist::create([
            'patient_id' => $validated['patient_id'],
            'doctor_id' => Auth::id(),
            'template_id' => $validated['template_id'],
            'status' => 'draft',
        ]);

        return response()->json([
            'message' => 'Checklist created successfully',
            'checklist' => $checklist->load(['patient', 'template.fields']),
        ], 201);
    }

    public function show(Checklist $checklist)
    {
        $this->authorize('view', $checklist);

        return response()->json(
            $checklist->load(['patient', 'template.fields', 'responses.field'])
        );
    }

    public function submitResponses(Request $request, Checklist $checklist)
    {
        $this->authorize('update', $checklist);

        $validated = $request->validate([
            'responses' => 'required|array',
            'responses.*.field_id' => 'required|exists:checklist_fields,id',
            'responses.*.value' => 'nullable',
        ]);

        foreach ($validated['responses'] as $response) {
            ChecklistResponse::updateOrCreate(
                [
                    'checklist_id' => $checklist->id,
                    'field_id' => $response['field_id'],
                ],
                ['value' => $response['value']]
            );
        }

        $checklist->update([
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        return response()->json([
            'message' => 'Responses submitted successfully',
            'checklist' => $checklist->load(['patient', 'template.fields', 'responses.field']),
        ]);
    }

    public function complete(Request $request, Checklist $checklist)
    {
        $this->authorize('update', $checklist);

        $validated = $request->validate([
            'prescribed_medicine' => 'nullable|string',
        ]);

        $checklist->update([
            'status' => 'completed',
            'completed_at' => now(),
            'prescribed_medicine' => $validated['prescribed_medicine'] ?? null,
        ]);

        return response()->json([
            'message' => 'Checklist completed successfully',
            'checklist' => $checklist->load(['patient', 'template.fields', 'responses.field']),
        ]);
    }

    public function update(Request $request, Checklist $checklist)
    {
        $this->authorize('update', $checklist);

        if ($checklist->status !== 'draft') {
            return response()->json([
                'message' => 'Cannot update a checklist that is not in draft status',
            ], 422);
        }

        $validated = $request->validate([
            'responses' => 'required|array',
            'responses.*.field_id' => 'required|exists:checklist_fields,id',
            'responses.*.value' => 'nullable',
        ]);

        foreach ($validated['responses'] as $response) {
            ChecklistResponse::updateOrCreate(
                [
                    'checklist_id' => $checklist->id,
                    'field_id' => $response['field_id'],
                ],
                ['value' => $response['value']]
            );
        }

        return response()->json([
            'message' => 'Checklist updated successfully',
            'checklist' => $checklist->load(['patient', 'template.fields', 'responses.field']),
        ]);
    }

    public function destroy(Checklist $checklist)
    {
        $this->authorize('delete', $checklist);

        $checklist->delete();

        return response()->json(['message' => 'Checklist deleted successfully']);
    }
}
