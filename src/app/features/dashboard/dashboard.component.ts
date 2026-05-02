import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../core/services/task.service';
import { TaskCardComponent } from '../../shared/components/task-card/task-card.component';
import { TaskDialogComponent } from '../../shared/components/task-dialog/task-dialog.component';
import { LucideAngularModule } from 'lucide-angular';
import { Task, TaskStatus, TaskPriority } from '../../core/models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, TaskDialogComponent, LucideAngularModule],
  templateUrl: 'dashboard.component.html',
  styles: [`
    :host { display: block; }
    .grid { scrollbar-width: thin; }
  `]
})
export class DashboardComponent {
  taskService = inject(TaskService);
  viewMode = signal<'kanban' | 'list'>('kanban');

  // Dialog state
  isDialogOpen = signal(false);
  editingTask = signal<Task | null>(null);

  statuses: TaskStatus[] = ['backlog', 'wip', 'completed', 'blocked', 'approved'];

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.taskService.tasks().filter((t: Task) => t.status === status);
  }

  getStatusBarClass(status: TaskStatus): string {
    switch (status) {
      case 'completed': return 'bg-success';
      case 'approved': return 'bg-primary';
      case 'blocked': return 'bg-error';
      case 'wip': return 'bg-warning';
      default: return 'bg-base-content/20';
    }
  }

  getStatusIconBgClass(status: TaskStatus): string {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success';
      case 'approved': return 'bg-primary/10 text-primary';
      case 'blocked': return 'bg-error/10 text-error';
      case 'wip': return 'bg-warning/10 text-warning';
      default: return 'bg-base-content/10 text-base-content';
    }
  }

  getStatusIcon(status: TaskStatus): string {
    switch (status) {
      case 'completed': return 'check-circle';
      case 'approved': return 'thumbs-up';
      case 'blocked': return 'alert-circle';
      case 'wip': return 'clock';
      case 'backlog': return 'inbox';
      default: return 'help-circle';
    }
  }

  getStatusBadgeClass(status: TaskStatus): string {
    switch (status) {
      case 'completed': return 'badge-success';
      case 'approved': return 'badge-primary';
      case 'blocked': return 'badge-error';
      case 'wip': return 'badge-warning';
      default: return 'badge-ghost';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'high': return 'badge-error';
      case 'medium': return 'badge-warning';
      default: return 'badge-info';
    }
  }

  // --- Dialog handlers ---

  addNewTask() {
    this.editingTask.set(null);
    this.isDialogOpen.set(true);
  }

  onEditTask(task: Task) {
    this.editingTask.set(task);
    this.isDialogOpen.set(true);
  }

  onDialogClose() {
    this.isDialogOpen.set(false);
    this.editingTask.set(null);
  }

  onDialogSave(data: { title: string; description: string; priority: TaskPriority }) {
    const current = this.editingTask();
    if (current) {
      // Edit mode
      this.taskService.updateTask(current.id, {
        title: data.title,
        description: data.description,
        priority: data.priority
      });
    } else {
      // Create mode
      this.taskService.addTask({
        title: data.title,
        description: data.description,
        status: 'backlog',
        priority: data.priority,
        assignee: { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' }
      });
    }
    this.onDialogClose();
  }
}
