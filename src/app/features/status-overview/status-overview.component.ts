import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../core/services/task.service';
import { LucideAngularModule } from 'lucide-angular';
import { TaskStatus } from '../../core/models/task.model';

@Component({
  selector: 'app-status-overview',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="p-6 md:p-10 max-w-[1200px] mx-auto">
      <div class="mb-10">
        <h1 class="text-4xl font-extrabold tracking-tight">Task Status Analytics</h1>
        <p class="text-base-content/60 mt-1">A detailed breakdown of project progress and task distribution.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Status Distribution Card -->
        <div class="col-span-1 lg:col-span-2 bg-base-100 rounded-3xl border border-base-200 p-8 shadow-sm">
          <h2 class="text-xl font-bold mb-6">Status Distribution</h2>
          <div class="flex flex-col gap-6">
            @for (status of statuses; track status) {
              <div class="space-y-2">
                <div class="flex justify-between items-center text-sm">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full" [ngClass]="getStatusColor(status)"></span>
                    <span class="font-semibold uppercase tracking-wider">{{ status.replace('-', ' ') }}</span>
                  </div>
                  <span class="font-mono">{{ getCount(status) }} tasks ({{ getPercentage(status) }}%)</span>
                </div>
                <div class="w-full bg-base-200 h-3 rounded-full overflow-hidden shadow-inner">
                  <div class="h-full transition-all duration-1000 ease-out" 
                       [ngClass]="getStatusColor(status)" 
                       [style.width.%]="getPercentage(status)">
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Quick Stats Card -->
        <div class="flex flex-col gap-6">
          <div class="bg-primary text-primary-content rounded-3xl p-8 shadow-lg shadow-primary/20">
            <h3 class="text-lg font-medium opacity-80">Completion Rate</h3>
            <div class="text-5xl font-black mt-2">{{ getPercentage('completed') + getPercentage('approved') }}%</div>
            <p class="text-sm mt-4 opacity-70">Based on approved and completed tasks.</p>
          </div>

          <div class="bg-base-200 rounded-3xl p-8 border border-base-300">
            <h3 class="text-lg font-medium opacity-60">Total Tasks</h3>
            <div class="text-5xl font-black mt-2">{{ taskService.tasks().length }}</div>
            <div class="mt-6 flex items-center gap-2 text-sm text-error font-bold" *ngIf="getCount('blocked') > 0">
              <i-lucide name="alert-circle" class="w-4 h-4"></i-lucide>
              {{ getCount('blocked') }} tasks are blocked
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class StatusOverviewComponent {
  taskService = inject(TaskService);
  statuses: TaskStatus[] = ['backlog', 'wip', 'completed', 'blocked', 'approved'];

  getCount(status: TaskStatus): number {
    return this.taskService.tasks().filter(t => t.status === status).length;
  }

  getPercentage(status: TaskStatus): number {
    const total = this.taskService.tasks().length;
    if (total === 0) return 0;
    return Math.round((this.getCount(status) / total) * 100);
  }

  getStatusColor(status: TaskStatus) {
    switch (status) {
      case 'completed': return 'bg-success';
      case 'approved': return 'bg-primary';
      case 'blocked': return 'bg-error';
      case 'wip': return 'bg-warning';
      default: return 'bg-base-content/20';
    }
  }
}
