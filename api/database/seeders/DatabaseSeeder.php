<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $tasks = [
            ['Send the April invoice to the client', 'Attach the timesheet.', 'todo', 'high', 2],
            ['Review the pull request for the booking form', null, 'doing', 'medium', 1],
            ['Book the dentist appointment', null, 'todo', 'low', 10],
            ['Back up the production database', 'Check the restore works, not only the backup.', 'done', 'high', null],
            ['Write release notes for v1.2', null, 'todo', 'medium', 5],
        ];

        foreach ($tasks as [$title, $notes, $status, $priority, $dueInDays]) {
            Task::create([
                'title' => $title,
                'notes' => $notes,
                'status' => $status,
                'priority' => $priority,
                'due_date' => $dueInDays ? now()->addDays($dueInDays) : null,
            ]);
        }
    }
}
