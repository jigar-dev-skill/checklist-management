<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChecklistTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChecklistTemplateController extends Controller
{
    public function index(Request $request)
    {
        $query = ChecklistTemplate::where('is_active', true);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function store(Request $request)
    {
        $this->authorize('create', ChecklistTemplate::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'fields' => 'required|array|min:1',
            'fields.*.label' => 'required|string|max:255',
            'fields.*.type' => 'required|in:text,checkbox,radio,dropdown,textarea,date,email,number',
            'fields.*.required' => 'nullable|boolean',
            'fields.*.options' => 'nullable|array',
            'fields.*.help_text' => 'nullable|string',
        ]);

        $template = ChecklistTemplate::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'created_by' => Auth::id(),
        ]);

        foreach ($validated['fields'] as $index => $field) {
            $template->fields()->create([
                'label' => $field['label'],
                'type' => $field['type'],
                'required' => $field['required'] ?? false,
                'options' => $field['options'] ?? null,
                'help_text' => $field['help_text'] ?? null,
                'order' => $index,
            ]);
        }

        return response()->json([
            'message' => 'Template created successfully',
            'template' => $template->load('fields'),
        ], 201);
    }

    public function show(ChecklistTemplate $template)
    {
        return response()->json($template->load('fields'));
    }

    public function update(Request $request, ChecklistTemplate $template)
    {
        $this->authorize('update', $template);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'fields' => 'sometimes|array|min:1',
            'fields.*.label' => 'required|string|max:255',
            'fields.*.type' => 'required|in:text,checkbox,radio,dropdown,textarea,date,email,number',
            'fields.*.required' => 'nullable|boolean',
            'fields.*.options' => 'nullable|array',
            'fields.*.help_text' => 'nullable|string',
        ]);

        if (isset($validated['name'])) {
            $template->update(['name' => $validated['name']]);
        }

        if (isset($validated['description'])) {
            $template->update(['description' => $validated['description']]);
        }

        if (isset($validated['fields'])) {
            $template->fields()->delete();
            foreach ($validated['fields'] as $index => $field) {
                $template->fields()->create([
                    'label' => $field['label'],
                    'type' => $field['type'],
                    'required' => $field['required'] ?? false,
                    'options' => $field['options'] ?? null,
                    'help_text' => $field['help_text'] ?? null,
                    'order' => $index,
                ]);
            }
        }

        return response()->json([
            'message' => 'Template updated successfully',
            'template' => $template->load('fields'),
        ]);
    }

    public function destroy(ChecklistTemplate $template)
    {
        $this->authorize('delete', $template);

        $template->delete();

        return response()->json(['message' => 'Template deleted successfully']);
    }
}
