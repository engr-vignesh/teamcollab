import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { User } from '../models/task.model';

const USER_KEY = 'tc_user';

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
};

function createService(initialStore: { [key: string]: string } = {}): {
  service: AuthService;
  store: { [key: string]: string };
} {
  const store = { ...initialStore };
  spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] ?? null);
  spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => { store[key] = value; });
  spyOn(localStorage, 'removeItem').and.callFake((key: string) => { delete store[key]; });
  TestBed.configureTestingModule({});
  return { service: TestBed.inject(AuthService), store };
}

describe('AuthService', () => {
  describe('initialization', () => {
    it('should be created', () => {
      const { service } = createService();
      expect(service).toBeTruthy();
    });

    it('should have no current user when localStorage is empty', () => {
      const { service } = createService();
      expect(service.currentUser()).toBeNull();
    });

    it('should restore user from localStorage on init', () => {
      const { service } = createService({ [USER_KEY]: JSON.stringify(mockUser) });
      expect(service.currentUser()?.name).toBe('John Doe');
      expect(service.currentUser()?.email).toBe('john.doe@example.com');
    });
  });

  describe('loginWithGoogle', () => {
    let service: AuthService;
    let store: { [key: string]: string };

    beforeEach(() => {
      ({ service, store } = createService());
    });

    it('should set currentUser signal after login', () => {
      service.loginWithGoogle();
      expect(service.currentUser()).not.toBeNull();
      expect(service.currentUser()?.name).toBe('John Doe');
    });

    it('should persist the user to localStorage', () => {
      service.loginWithGoogle();
      expect(store[USER_KEY]).toBeTruthy();
      const saved: User = JSON.parse(store[USER_KEY]);
      expect(saved.email).toBe('john.doe@example.com');
    });

    it('should make isAuthenticated return true', () => {
      service.loginWithGoogle();
      expect(service.isAuthenticated()).toBeTrue();
    });
  });

  describe('logout', () => {
    let service: AuthService;
    let store: { [key: string]: string };

    beforeEach(() => {
      ({ service, store } = createService({ [USER_KEY]: JSON.stringify(mockUser) }));
    });

    it('should clear currentUser signal', () => {
      service.logout();
      expect(service.currentUser()).toBeNull();
    });

    it('should remove user from localStorage', () => {
      service.logout();
      expect(store[USER_KEY]).toBeUndefined();
    });

    it('should make isAuthenticated return false', () => {
      service.logout();
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no user is logged in', () => {
      const { service } = createService();
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return true when a user is present', () => {
      const { service } = createService({ [USER_KEY]: JSON.stringify(mockUser) });
      expect(service.isAuthenticated()).toBeTrue();
    });
  });
});
