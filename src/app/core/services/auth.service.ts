import { Injectable, signal, NgZone, inject } from '@angular/core';
import { User } from '../models/task.model';

// Declare the global google namespace from GIS library
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'tc_user';
  private readonly CLIENT_ID = '1048749968228-rn0j9vhipohkva3nhmsnukd2s3ij7f5f.apps.googleusercontent.com';
  private ngZone = inject(NgZone);

  currentUser = signal<User | null>(null);

  constructor() {
    const savedUser = localStorage.getItem(this.USER_KEY);
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  /**
   * Initialize Google Identity Services and render the Sign-In button,
   * or trigger the One Tap / popup flow.
   *
   * @param buttonElement - Optional HTML element to render the Google button into
   */
  initializeGoogleSignIn(buttonElement?: HTMLElement): void {
    if (typeof google === 'undefined' || !google.accounts) {
      console.warn('Google Identity Services not loaded yet. Retrying in 500ms...');
      setTimeout(() => this.initializeGoogleSignIn(buttonElement), 500);
      return;
    }

    google.accounts.id.initialize({
      client_id: this.CLIENT_ID,
      callback: (response: any) => this.handleCredentialResponse(response),
      auto_select: false,
      cancel_on_tap_outside: true
    });

    if (buttonElement) {
      google.accounts.id.renderButton(buttonElement, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: 360,
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left'
      });
    }
  }

  /**
   * Trigger the Google sign-in popup programmatically.
   */
  promptGoogleSignIn(): void {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.prompt();
    }
  }

  /**
   * Handle the credential response from Google.
   * Decodes the JWT to extract user profile info.
   */
  private handleCredentialResponse(response: any): void {
    const payload = this.decodeJwtPayload(response.credential);
    if (!payload) return;

    const user: User = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      avatar: payload.picture
    };

    // Run inside Angular zone so signals/change detection update
    this.ngZone.run(() => {
      this.currentUser.set(user);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    });
  }

  /**
   * Decode the payload portion of a JWT (no verification — that should happen server-side).
   */
  private decodeJwtPayload(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to decode JWT:', e);
      return null;
    }
  }

  /**
   * Fallback mock login for development when no Client ID is configured.
   */
  loginWithGoogle() {
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
    // Also revoke Google session if GIS is loaded
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.disableAutoSelect();
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
