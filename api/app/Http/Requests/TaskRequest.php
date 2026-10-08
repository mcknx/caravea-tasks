<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        // No accounts in this module; every request may manage tasks.
        return true;
    }

    public function rules(): array
    {
        // Creating needs a title; updating (PUT/PATCH) only validates what was sent.
        $title = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'title' => [$title, 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'due_date' => ['nullable', 'date_format:Y-m-d'],
            'status' => ['sometimes', Rule::in(Task::STATUSES)],
            'priority' => ['sometimes', Rule::in(Task::PRIORITIES)],
        ];
    }
}
