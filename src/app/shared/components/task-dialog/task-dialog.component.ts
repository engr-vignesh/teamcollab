import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskPriority } from '../../../core/models/task.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './task-dialog.component.html',
  styles: [`
    :host { display: contents; }
  `]
})
export class TaskDialogComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() task: Task | null = null;
  @Output() save = new EventEmitter<{ title: string; description: string; priority: TaskPriority }>();
  @Output() closed = new EventEmitter<void>();

  title = '';
  description = '';
  priority: TaskPriority = 'medium';

  get isEditMode(): boolean {
    return this.task !== null;
  }

  get dialogTitle(): string {
    return this.isEditMode ? 'Edit Task' : 'Create New Task';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen) {
      if (this.task) {
        this.title = this.task.title;
        this.description = this.task.description;
        this.priority = this.task.priority;
      } else {
        this.title = '';
        this.description = '';
        this.priority = 'medium';
      }
    }
  }

  onSave() {
    if (!this.title.trim()) return;
    this.save.emit({
      title: this.title.trim(),
      description: this.description.trim(),
      priority: this.priority
    });
    this.closed.emit();
  }

  onClose() {
    this.closed.emit();
  }

  setPriority(p: TaskPriority) {
    this.priority = p;
  }
}
