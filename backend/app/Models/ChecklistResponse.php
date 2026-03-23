<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChecklistResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'checklist_id',
        'field_id',
        'value',
    ];

    public function checklist()
    {
        return $this->belongsTo(Checklist::class);
    }

    public function field()
    {
        return $this->belongsTo(ChecklistField::class, 'field_id');
    }
}
