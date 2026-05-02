import { Injectable, signal } from '@angular/core';
import { User } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'tc_user';
  currentUser = signal<User | null>(null);

  constructor() {
    const savedUser = localStorage.getItem(this.USER_KEY);
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  loginWithGoogle() {
    // Mocking Google Login
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    };
    
    this.currentUser.set(mockUser);
    localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser));
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
