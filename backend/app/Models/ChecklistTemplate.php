<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChecklistTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'created_by',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function fields()
    {
        return $this->hasMany(ChecklistField::class, 'template_id')
            ->orderBy('order');
    }

    public function checklists()
    {
        return $this->hasMany(Checklist::class, 'template_id');
    }
}
