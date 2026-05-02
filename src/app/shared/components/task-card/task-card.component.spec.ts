import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCardComponent } from './task-card.component';
import { Task, TaskStatus } from '../../../core/models/task.model';

const mockTask: Task = {
  id: 'card-1',
  title: 'Fix login bug',
  description: 'Users cannot log in with SSO.',
  status: 'wip',
  priority: 'high',
  assignee: { name: 'Alice', avatar: 'https://example.com/alice.svg' },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
};

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    component.task = mockTask;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should display the task title', () => {
      expect((fixture.nativeElement as HTMLElement).textContent).toContain('Fix login bug');
    });

    it('should display the task description', () => {
      expect((fixture.nativeElement as HTMLElement).textContent).toContain('Users cannot log in with SSO.');
    });

    it('should display the assignee name', () => {
      expect((fixture.nativeElement as HTMLElement).textContent).toContain('Alice');
    });

    it('should display the priority', () => {
      expect((fixture.nativeElement as HTMLElement).textContent?.toLowerCase()).toContain('high');
    });

    it('should update display when task input changes', () => {
      component.task = { ...mockTask, title: 'Updated Title' };
      fixture.detectChanges();
      expect((fixture.nativeElement as HTMLElement).textContent).toContain('Updated Title');
    });
  });

  describe('getPriorityClass', () => {
    it('should return error badge class for high priority', () => {
      expect(component.getPriorityClass('high')).toBe('badge-error');
    });

    it('should return warning badge class for medium priority', () => {
      expect(component.getPriorityClass('medium')).toBe('badge-warning');
    });

    it('should return info badge class for low priority', () => {
      expect(component.getPriorityClass('low')).toBe('badge-info');
    });
  });

  describe('getStatusClass', () => {
    it('should return success class for completed', () => {
      expect(component.getStatusClass('completed')).toBe('badge-success');
    });

    it('should return primary class for approved', () => {
      expect(component.getStatusClass('approved')).toBe('badge-primary');
    });

    it('should return error class for blocked', () => {
      expect(component.getStatusClass('blocked')).toBe('badge-error');
    });

    it('should return warning class for wip', () => {
      expect(component.getStatusClass('wip')).toBe('badge-warning');
    });

    it('should return ghost class for backlog', () => {
      expect(component.getStatusClass('backlog')).toBe('badge-ghost');
    });
  });

  describe('edit output', () => {
    it('should emit the task when the card is clicked', () => {
      let emitted: Task | undefined;
      component.edit.subscribe((t: Task) => (emitted = t));

      (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.card')?.click();

      expect(emitted?.id).toBe('card-1');
    });

    it('should emit the task when the edit button is clicked', () => {
      let emitted: Task | undefined;
      component.edit.subscribe((t: Task) => (emitted = t));

      const editBtn = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
        '.btn-circle.hover\\:text-primary'
      );
      editBtn?.click();

      expect(emitted?.id).toBe('card-1');
    });

    it('onCardClick should emit the current task via edit', () => {
      let emitted: Task | undefined;
      component.edit.subscribe((t: Task) => (emitted = t));

      component.onCardClick();

      expect(emitted).toEqual(mockTask);
    });
  });

  describe('delete output', () => {
    it('should emit task id when delete button is clicked', () => {
      let emittedId: string | undefined;
      component.delete.subscribe((id: string) => (emittedId = id));

      const deleteBtn = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
        '.btn-circle.text-error'
      );
      deleteBtn?.click();

      expect(emittedId).toBe('card-1');
    });
  });

  describe('statusChange output', () => {
    it('should emit "completed" when the Completed option is clicked', () => {
      let emittedStatus: TaskStatus | undefined;
      component.statusChange.subscribe((s: TaskStatus) => (emittedStatus = s));

      const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.menu li button');
      const completedBtn = Array.from(buttons).find(b => b.textContent?.trim() === 'Completed');
      completedBtn?.click();

      expect(emittedStatus).toBe('completed');
    });

    it('should emit "backlog" when the Backlog option is clicked', () => {
      let emittedStatus: TaskStatus | undefined;
      component.statusChange.subscribe((s: TaskStatus) => (emittedStatus = s));

      const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.menu li button');
      const backlogBtn = Array.from(buttons).find(b => b.textContent?.trim() === 'Backlog');
      backlogBtn?.click();

      expect(emittedStatus).toBe('backlog');
    });

    it('should emit "blocked" when the Blocked option is clicked', () => {
      let emittedStatus: TaskStatus | undefined;
      component.statusChange.subscribe((s: TaskStatus) => (emittedStatus = s));

      const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.menu li button');
      const blockedBtn = Array.from(buttons).find(b => b.textContent?.trim() === 'Blocked');
      blockedBtn?.click();

      expect(emittedStatus).toBe('blocked');
    });
  });
});
