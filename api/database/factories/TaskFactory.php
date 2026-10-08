<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'notes' => fake()->optional()->paragraph(),
            'due_date' => fake()->optional()->dateTimeBetween('now', '+1 month'),
            'status' => fake()->randomElement(Task::STATUSES),
            'priority' => fake()->randomElement(Task::PRIORITIES),
        ];
    }
}
