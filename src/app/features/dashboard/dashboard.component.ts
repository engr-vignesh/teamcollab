import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../core/services/task.service';
import { TaskCardComponent } from '../../shared/components/task-card/task-card.component';
import { LucideAngularModule } from 'lucide-angular';
import { Task, TaskStatus } from '../../core/models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, LucideAngularModule],
  templateUrl: 'dashboard.component.html',
  styles: [`
    :host { display: block; }
    .grid { scrollbar-width: thin; }
  `]
})
export class DashboardComponent {
  taskService = inject(TaskService);
  viewMode = signal<'kanban' | 'list'>('kanban');

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

  addNewTask() {
    this.taskService.addTask({
      title: 'New Task ' + (this.taskService.tasks().length + 1),
      description: 'Click to edit task details.',
      status: 'backlog',
      priority: 'medium',
      assignee: { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' }
    });
  }
}
