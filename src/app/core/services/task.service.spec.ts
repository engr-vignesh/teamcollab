import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

const TASKS_KEY = 'tc_tasks';

const mockTask: Task = {
  id: 'test-1',
  title: 'Test Task',
  description: 'Test description',
  status: 'backlog',
  priority: 'medium',
  assignee: { name: 'Alice', avatar: 'https://example.com/alice.svg' },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
};

function createService(initialStore: { [key: string]: string } = {}): {
  service: TaskService;
  store: { [key: string]: string };
} {
  const store = { ...initialStore };
  spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] ?? null);
  spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => { store[key] = value; });
  spyOn(localStorage, 'removeItem').and.callFake((key: string) => { delete store[key]; });
  TestBed.configureTestingModule({});
  return { service: TestBed.inject(TaskService), store };
}

describe('TaskService', () => {
  describe('initialization', () => {
    it('should be created', () => {
      const { service } = createService();
      expect(service).toBeTruthy();
    });

    it('should seed 3 tasks when localStorage is empty', () => {
      const { service } = createService();
      expect(service.tasks().length).toBe(3);
    });

    it('should persist seed data to localStorage', () => {
      const { store } = createService();
      const saved = JSON.parse(store[TASKS_KEY]);
      expect(saved.length).toBe(3);
    });

    it('should load tasks from localStorage when data exists', () => {
      const { service } = createService({ [TASKS_KEY]: JSON.stringify([mockTask]) });
      expect(service.tasks().length).toBe(1);
      expect(service.tasks()[0].title).toBe('Test Task');
    });

    it('should not overwrite existing localStorage data with seed data', () => {
      const saved = [mockTask];
      const { service } = createService({ [TASKS_KEY]: JSON.stringify(saved) });
      expect(service.tasks()[0].id).toBe('test-1');
    });
  });

  describe('addTask', () => {
    let service: TaskService;
    let store: { [key: string]: string };

    beforeEach(() => {
      ({ service, store } = createService());
    });

    it('should add a new task', () => {
      const before = service.tasks().length;
      service.addTask({
        title: 'New Task',
        description: 'Desc',
        status: 'backlog',
        priority: 'low',
        assignee: mockTask.assignee
      });
      expect(service.tasks().length).toBe(before + 1);
    });

    it('should assign a generated id to the new task', () => {
      service.addTask({
        title: 'Task X',
        description: 'D',
        status: 'backlog',
        priority: 'high',
        assignee: mockTask.assignee
      });
      const added = service.tasks().find(t => t.title === 'Task X');
      expect(added?.id).toBeTruthy();
    });

    it('should set createdAt and updatedAt on the new task', () => {
      service.addTask({
        title: 'Dated Task',
        description: 'D',
        status: 'wip',
        priority: 'medium',
        assignee: mockTask.assignee
      });
      const added = service.tasks().find(t => t.title === 'Dated Task')!;
      expect(added.createdAt).toBeTruthy();
      expect(added.updatedAt).toBeTruthy();
    });

    it('should persist the new task to localStorage', () => {
      service.addTask({
        title: 'Persisted',
        description: 'D',
        status: 'backlog',
        priority: 'low',
        assignee: mockTask.assignee
      });
      const saved: Task[] = JSON.parse(store[TASKS_KEY]);
      expect(saved.some(t => t.title === 'Persisted')).toBeTrue();
    });
  });

  describe('updateTask', () => {
    let service: TaskService;
    let store: { [key: string]: string };

    beforeEach(() => {
      ({ service, store } = createService({ [TASKS_KEY]: JSON.stringify([mockTask]) }));
    });

    it('should update task fields', () => {
      service.updateTask('test-1', { title: 'Updated Title' });
      expect(service.tasks()[0].title).toBe('Updated Title');
    });

    it('should not modify other fields when updating', () => {
      service.updateTask('test-1', { title: 'Updated' });
      expect(service.tasks()[0].description).toBe('Test description');
    });

    it('should update updatedAt timestamp', () => {
      service.updateTask('test-1', { title: 'Updated' });
      expect(service.tasks()[0].updatedAt).not.toBe(mockTask.updatedAt);
    });

    it('should persist the update to localStorage', () => {
      service.updateTask('test-1', { title: 'Saved Update' });
      const saved: Task[] = JSON.parse(store[TASKS_KEY]);
      expect(saved[0].title).toBe('Saved Update');
    });

    it('should not affect tasks with other ids', () => {
      const second: Task = { ...mockTask, id: 'test-2', title: 'Second' };
      const { service: svc } = createService({ [TASKS_KEY]: JSON.stringify([mockTask, second]) });
      svc.updateTask('test-1', { title: 'Modified' });
      expect(svc.tasks().find(t => t.id === 'test-2')?.title).toBe('Second');
    });
  });

  describe('deleteTask', () => {
    let service: TaskService;
    let store: { [key: string]: string };

    beforeEach(() => {
      const two = [mockTask, { ...mockTask, id: 'test-2', title: 'Second' }];
      ({ service, store } = createService({ [TASKS_KEY]: JSON.stringify(two) }));
    });

    it('should remove the task with the given id', () => {
      service.deleteTask('test-1');
      expect(service.tasks().find(t => t.id === 'test-1')).toBeUndefined();
    });

    it('should leave other tasks intact', () => {
      service.deleteTask('test-1');
      expect(service.tasks().length).toBe(1);
      expect(service.tasks()[0].id).toBe('test-2');
    });

    it('should persist the deletion to localStorage', () => {
      service.deleteTask('test-1');
      const saved: Task[] = JSON.parse(store[TASKS_KEY]);
      expect(saved.some(t => t.id === 'test-1')).toBeFalse();
    });
  });

  describe('updateTaskStatus', () => {
    let service: TaskService;

    beforeEach(() => {
      ({ service } = createService({ [TASKS_KEY]: JSON.stringify([mockTask]) }));
    });

    it('should update the status of the task', () => {
      service.updateTaskStatus('test-1', 'completed');
      expect(service.tasks()[0].status).toBe('completed');
    });

    it('should update updatedAt when status changes', () => {
      service.updateTaskStatus('test-1', 'wip');
      expect(service.tasks()[0].updatedAt).not.toBe(mockTask.updatedAt);
    });
  });
});
