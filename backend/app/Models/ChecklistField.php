<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChecklistField extends Model
{
    use HasFactory;

    protected $fillable = [
        'template_id',
        'label',
        'type',
        'options',
        'required',
        'order',
        'help_text',
    ];

    protected $casts = [
        'options' => 'json',
        'required' => 'boolean',
    ];

    public function template()
    {
        return $this->belongsTo(ChecklistTemplate::class, 'template_id');
    }

    public function responses()
    {
        return $this->hasMany(ChecklistResponse::class, 'field_id');
    }
}
