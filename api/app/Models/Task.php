<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;

    public const STATUSES = ['todo', 'doing', 'done'];

    public const PRIORITIES = ['low', 'medium', 'high'];

    protected $fillable = ['title', 'notes', 'due_date', 'status', 'priority'];

    // The DB column defaults only apply on insert; mirror them here so a
    // freshly created model returns the same values the database stores.
    protected $attributes = ['status' => 'todo', 'priority' => 'medium'];

    protected function casts(): array
    {
        return ['due_date' => 'date:Y-m-d'];
    }
}
