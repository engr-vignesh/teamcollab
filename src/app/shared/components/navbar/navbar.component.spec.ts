import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/task.model';

function makeAuthMock(user: User | null = null) {
  return {
    currentUser: signal<User | null>(user),
    loginWithGoogle: jasmine.createSpy('loginWithGoogle'),
    logout: jasmine.createSpy('logout'),
    isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(user !== null)
  };
}

const mockUser: User = {
  id: '1',
  name: 'Jane Smith',
  email: 'jane@example.com',
  avatar: 'https://example.com/jane.svg'
};

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authMock: ReturnType<typeof makeAuthMock>;

  function setup(user: User | null = null) {
    authMock = makeAuthMock(user);
    TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [{ provide: AuthService, useValue: authMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  describe('when logged out', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NavbarComponent],
        providers: [{ provide: AuthService, useValue: makeAuthMock(null) }]
      }).compileComponents();

      fixture = TestBed.createComponent(NavbarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display the TeamCollab brand name', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain('TeamCollab');
    });

    it('should show the login button', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain('Login with Google');
    });

    it('should not show user avatar or name', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.avatar')).toBeNull();
    });

    it('should call loginWithGoogle when login button is clicked', () => {
      const loginBtn = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
        'button.btn-primary'
      );
      loginBtn?.click();
      expect(component.auth.loginWithGoogle).toHaveBeenCalled();
    });
  });

  describe('when logged in', () => {
    let authMockLoggedIn: ReturnType<typeof makeAuthMock>;

    beforeEach(async () => {
      authMockLoggedIn = makeAuthMock(mockUser);
      await TestBed.configureTestingModule({
        imports: [NavbarComponent],
        providers: [{ provide: AuthService, useValue: authMockLoggedIn }]
      }).compileComponents();

      fixture = TestBed.createComponent(NavbarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should display the user name', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain('Jane Smith');
    });

    it('should display the user email', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain('jane@example.com');
    });

    it('should show the avatar element', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.avatar')).not.toBeNull();
    });

    it('should not show the login button', () => {
      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).not.toContain('Login with Google');
    });

    it('should call logout when logout button is clicked', () => {
      const logoutBtn = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
        '.menu button'
      );
      logoutBtn?.click();
      expect(authMockLoggedIn.logout).toHaveBeenCalled();
    });
  });
});
