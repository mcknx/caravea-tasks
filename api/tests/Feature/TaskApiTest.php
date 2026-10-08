<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_tasks_newest_first(): void
    {
        $old = Task::factory()->create(['created_at' => now()->subDay()]);
        $new = Task::factory()->create();

        $this->getJson('/api/tasks')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.id', $new->id)
            ->assertJsonPath('data.1.id', $old->id);
    }

    public function test_it_filters_by_status(): void
    {
        Task::factory()->create(['status' => 'todo']);
        $done = Task::factory()->create(['status' => 'done']);

        $this->getJson('/api/tasks?status=done')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $done->id);
    }

    public function test_it_creates_a_task_with_defaults(): void
    {
        $this->postJson('/api/tasks', ['title' => 'Call the plumber'])
            ->assertCreated()
            ->assertJsonPath('data.title', 'Call the plumber')
            ->assertJsonPath('data.status', 'todo')
            ->assertJsonPath('data.priority', 'medium');

        $this->assertDatabaseHas('tasks', ['title' => 'Call the plumber']);
    }

    public function test_it_rejects_invalid_input(): void
    {
        $this->postJson('/api/tasks', ['title' => '', 'status' => 'someday', 'due_date' => 'tomorrow-ish'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'status', 'due_date']);

        $this->assertDatabaseCount('tasks', 0);
    }

    public function test_it_shows_one_task_and_404s_for_a_missing_one(): void
    {
        $task = Task::factory()->create();

        $this->getJson("/api/tasks/{$task->id}")
            ->assertOk()
            ->assertJsonPath('data.title', $task->title);

        $this->getJson('/api/tasks/999')->assertNotFound();
    }

    public function test_it_updates_only_the_fields_sent(): void
    {
        $task = Task::factory()->create(['title' => 'Keep me', 'status' => 'todo']);

        $this->patchJson("/api/tasks/{$task->id}", ['status' => 'done'])
            ->assertOk()
            ->assertJsonPath('data.status', 'done')
            ->assertJsonPath('data.title', 'Keep me');
    }

    public function test_it_deletes_a_task(): void
    {
        $task = Task::factory()->create();

        $this->deleteJson("/api/tasks/{$task->id}")->assertNoContent();

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }
}
