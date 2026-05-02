import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { TaskService } from '../../core/services/task.service';
import { Task, TaskStatus } from '../../core/models/task.model';

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: Math.random().toString(36).slice(2),
  title: 'Default Task',
  description: 'Default description',
  status: 'backlog',
  priority: 'medium',
  assignee: { name: 'Bob', avatar: 'https://example.com/bob.svg' },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides
});

const seedTasks: Task[] = [
  makeTask({ id: '1', status: 'backlog',   priority: 'low' }),
  makeTask({ id: '2', status: 'wip',       priority: 'medium' }),
  makeTask({ id: '3', status: 'completed', priority: 'high' }),
  makeTask({ id: '4', status: 'blocked',   priority: 'high' }),
  makeTask({ id: '5', status: 'approved',  priority: 'low' }),
];

function makeTaskServiceMock(tasks: Task[] = seedTasks) {
  const taskSignal = signal<Task[]>(tasks);
  return {
    tasks: taskSignal.asReadonly(),
    addTask: jasmine.createSpy('addTask').and.callFake(
      (t: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        taskSignal.update(prev => [...prev, { ...t, id: 'new', createdAt: '', updatedAt: '' }]);
      }
    ),
    updateTask: jasmine.createSpy('updateTask').and.callFake(
      (id: string, updates: Partial<Task>) => {
        taskSignal.update(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
      }
    ),
    deleteTask: jasmine.createSpy('deleteTask').and.callFake(
      (id: string) => { taskSignal.update(prev => prev.filter(t => t.id !== id)); }
    ),
    updateTaskStatus: jasmine.createSpy('updateTaskStatus').and.callFake(
      (id: string, status: TaskStatus) => {
        taskSignal.update(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      }
    )
  };
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let taskServiceMock: ReturnType<typeof makeTaskServiceMock>;

  beforeEach(async () => {
    taskServiceMock = makeTaskServiceMock();

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: TaskService, useValue: taskServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('statuses', () => {
    it('should list all 5 task statuses in correct order', () => {
      expect(component.statuses).toEqual(['backlog', 'wip', 'completed', 'blocked', 'approved']);
    });
  });

  describe('view mode', () => {
    it('should default to kanban view', () => {
      expect(component.viewMode()).toBe('kanban');
    });

    it('should switch to list view', () => {
      component.viewMode.set('list');
      expect(component.viewMode()).toBe('list');
    });

    it('should render a table in list mode', () => {
      component.viewMode.set('list');
      fixture.detectChanges();
      expect((fixture.nativeElement as HTMLElement).querySelector('table')).not.toBeNull();
    });

    it('should not render a table in kanban mode', () => {
      expect((fixture.nativeElement as HTMLElement).querySelector('table')).toBeNull();
    });
  });

  describe('getTasksByStatus', () => {
    it('should return only tasks matching the given status', () => {
      const result = component.getTasksByStatus('backlog');
      expect(result.every(t => t.status === 'backlog')).toBeTrue();
    });

    it('should return one task per distinct status in seed data', () => {
      (['backlog', 'wip', 'completed', 'blocked', 'approved'] as TaskStatus[]).forEach(s => {
        expect(component.getTasksByStatus(s).length).toBe(1);
      });
    });

    it('should return an empty array for a status with no tasks', () => {
      taskServiceMock = makeTaskServiceMock([]);
      TestBed.overrideProvider(TaskService, { useValue: taskServiceMock });
      fixture = TestBed.createComponent(DashboardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.getTasksByStatus('backlog')).toEqual([]);
    });
  });

  describe('getStatusBarClass', () => {
    it('should return bg-success for completed', () => {
      expect(component.getStatusBarClass('completed')).toBe('bg-success');
    });

    it('should return bg-primary for approved', () => {
      expect(component.getStatusBarClass('approved')).toBe('bg-primary');
    });

    it('should return bg-error for blocked', () => {
      expect(component.getStatusBarClass('blocked')).toBe('bg-error');
    });

    it('should return bg-warning for wip', () => {
      expect(component.getStatusBarClass('wip')).toBe('bg-warning');
    });

    it('should return a muted class for backlog', () => {
      expect(component.getStatusBarClass('backlog')).toContain('bg-base-content');
    });
  });

  describe('getStatusIconBgClass', () => {
    it('should contain text-success for completed', () => {
      expect(component.getStatusIconBgClass('completed')).toContain('text-success');
    });

    it('should contain text-primary for approved', () => {
      expect(component.getStatusIconBgClass('approved')).toContain('text-primary');
    });

    it('should contain text-error for blocked', () => {
      expect(component.getStatusIconBgClass('blocked')).toContain('text-error');
    });

    it('should contain text-warning for wip', () => {
      expect(component.getStatusIconBgClass('wip')).toContain('text-warning');
    });
  });

  describe('getStatusIcon', () => {
    it('should return check-circle for completed', () => {
      expect(component.getStatusIcon('completed')).toBe('check-circle');
    });

    it('should return thumbs-up for approved', () => {
      expect(component.getStatusIcon('approved')).toBe('thumbs-up');
    });

    it('should return alert-circle for blocked', () => {
      expect(component.getStatusIcon('blocked')).toBe('alert-circle');
    });

    it('should return clock for wip', () => {
      expect(component.getStatusIcon('wip')).toBe('clock');
    });

    it('should return inbox for backlog', () => {
      expect(component.getStatusIcon('backlog')).toBe('inbox');
    });
  });

  describe('getStatusBadgeClass', () => {
    it('should return badge-success for completed', () => {
      expect(component.getStatusBadgeClass('completed')).toBe('badge-success');
    });

    it('should return badge-primary for approved', () => {
      expect(component.getStatusBadgeClass('approved')).toBe('badge-primary');
    });

    it('should return badge-error for blocked', () => {
      expect(component.getStatusBadgeClass('blocked')).toBe('badge-error');
    });

    it('should return badge-warning for wip', () => {
      expect(component.getStatusBadgeClass('wip')).toBe('badge-warning');
    });

    it('should return badge-ghost for backlog', () => {
      expect(component.getStatusBadgeClass('backlog')).toBe('badge-ghost');
    });
  });

  describe('getPriorityBadgeClass', () => {
    it('should return badge-error for high', () => {
      expect(component.getPriorityBadgeClass('high')).toBe('badge-error');
    });

    it('should return badge-warning for medium', () => {
      expect(component.getPriorityBadgeClass('medium')).toBe('badge-warning');
    });

    it('should return badge-info for low', () => {
      expect(component.getPriorityBadgeClass('low')).toBe('badge-info');
    });
  });

  describe('dialog management', () => {
    it('should have dialog closed by default', () => {
      expect(component.isDialogOpen()).toBeFalse();
    });

    it('should have no editing task by default', () => {
      expect(component.editingTask()).toBeNull();
    });

    describe('addNewTask', () => {
      it('should open the dialog', () => {
        component.addNewTask();
        expect(component.isDialogOpen()).toBeTrue();
      });

      it('should set editingTask to null (create mode)', () => {
        component.addNewTask();
        expect(component.editingTask()).toBeNull();
      });
    });

    describe('onEditTask', () => {
      const taskToEdit = makeTask({ id: 'edit-me', title: 'Edit this' });

      it('should open the dialog', () => {
        component.onEditTask(taskToEdit);
        expect(component.isDialogOpen()).toBeTrue();
      });

      it('should set editingTask to the selected task', () => {
        component.onEditTask(taskToEdit);
        expect(component.editingTask()?.id).toBe('edit-me');
      });
    });

    describe('onDialogClose', () => {
      it('should close the dialog', () => {
        component.addNewTask();
        component.onDialogClose();
        expect(component.isDialogOpen()).toBeFalse();
      });

      it('should clear editingTask', () => {
        const t = makeTask({ id: 'x' });
        component.onEditTask(t);
        component.onDialogClose();
        expect(component.editingTask()).toBeNull();
      });
    });

    describe('onDialogSave in create mode', () => {
      beforeEach(() => component.addNewTask());

      it('should call taskService.addTask with form data', () => {
        component.onDialogSave({ title: 'My Task', description: 'My Desc', priority: 'high' });
        expect(taskServiceMock.addTask).toHaveBeenCalledWith(
          jasmine.objectContaining({ title: 'My Task', description: 'My Desc', priority: 'high' })
        );
      });

      it('should close the dialog after saving', () => {
        component.onDialogSave({ title: 'T', description: 'D', priority: 'low' });
        expect(component.isDialogOpen()).toBeFalse();
      });
    });

    describe('onDialogSave in edit mode', () => {
      const taskToEdit = makeTask({ id: 'edit-me', title: 'Original' });

      beforeEach(() => component.onEditTask(taskToEdit));

      it('should call taskService.updateTask with the task id and new data', () => {
        component.onDialogSave({ title: 'Updated', description: 'New Desc', priority: 'low' });
        expect(taskServiceMock.updateTask).toHaveBeenCalledWith(
          'edit-me',
          jasmine.objectContaining({ title: 'Updated', description: 'New Desc', priority: 'low' })
        );
      });

      it('should NOT call addTask when editing an existing task', () => {
        component.onDialogSave({ title: 'Updated', description: 'D', priority: 'medium' });
        expect(taskServiceMock.addTask).not.toHaveBeenCalled();
      });

      it('should close the dialog after saving', () => {
        component.onDialogSave({ title: 'Updated', description: 'D', priority: 'medium' });
        expect(component.isDialogOpen()).toBeFalse();
      });
    });
  });
});
