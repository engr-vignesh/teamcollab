import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: "./task-card.component.html",
  styles: [`:host { display: block; }`]
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() statusChange = new EventEmitter<TaskStatus>();
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Task>();

  onCardClick() {
    this.edit.emit(this.task);
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'badge-error';
      case 'medium': return 'badge-warning';
      default: return 'badge-info';
    }
  }

  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case 'completed': return 'badge-success';
      case 'approved': return 'badge-primary';
      case 'blocked': return 'badge-error';
      case 'wip': return 'badge-warning';
      default: return 'badge-ghost';
    }
  }
}
