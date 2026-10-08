<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['status' => ['nullable', Rule::in(Task::STATUSES)]]);

        // ponytail: no pagination; add ->paginate() when a list outgrows one screen.
        $tasks = Task::query()
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->latest('id')
            ->get();

        return TaskResource::collection($tasks);
    }

    public function store(TaskRequest $request)
    {
        $task = Task::create($request->validated());

        return TaskResource::make($task)->response()->setStatusCode(201);
    }

    public function show(Task $task)
    {
        return TaskResource::make($task);
    }

    public function update(TaskRequest $request, Task $task)
    {
        $task->update($request->validated());

        return TaskResource::make($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return response()->noContent();
    }
}
