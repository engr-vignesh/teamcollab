import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly TASKS_KEY = 'tc_tasks';
  private _tasks = signal<Task[]>([]);

  tasks = computed(() => this._tasks());

  constructor() {
    this.loadTasks();
  }

  private loadTasks() {
    const savedTasks = localStorage.getItem(this.TASKS_KEY);
    if (savedTasks) {
      this._tasks.set(JSON.parse(savedTasks));
    } else {
      // Initialize with seed data
      const seedData: Task[] = [
        {
          id: '1',
          title: 'Setup Project Architecture',
          description: 'Define the core structure and services.',
          status: 'completed',
          priority: 'high',
          assignee: { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Implement Kanban Board',
          description: 'Create the drag and drop kanban interface.',
          status: 'wip',
          priority: 'medium',
          assignee: { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Design Task List View',
          description: 'Simple list view toggle for tasks.',
          status: 'backlog',
          priority: 'low',
          assignee: { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.saveTasks(seedData);
    }
  }

  private saveTasks(tasks: Task[]) {
    this._tasks.set(tasks);
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const newSmall: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.saveTasks([...this._tasks(), newSmall]);
  }

  updateTask(id: string, updates: Partial<Task>) {
    const updatedTasks = this._tasks().map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    );
    this.saveTasks(updatedTasks);
  }

  deleteTask(id: string) {
    this.saveTasks(this._tasks().filter(t => t.id !== id));
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    this.updateTask(id, { status });
  }
}
