<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Checklist extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'template_id',
        'status',
        'prescribed_medicine',
        'submitted_at',
        'completed_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function template()
    {
        return $this->belongsTo(ChecklistTemplate::class);
    }

    public function responses()
    {
        return $this->hasMany(ChecklistResponse::class);
    }

    public function getResponseValue($fieldId)
    {
        return $this->responses()
            ->where('field_id', $fieldId)
            ->first()?->value;
    }
}
