import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have title set to teamcollab', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.title).toBe('teamcollab');
  });

  it('should render the navbar', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-navbar')).not.toBeNull();
  });

  it('should render the dashboard', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-dashboard')).not.toBeNull();
  });

  it('should render a footer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('footer')).not.toBeNull();
  });

  it('should show the copyright text in the footer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const footer = (fixture.nativeElement as HTMLElement).querySelector('footer');
    expect(footer?.textContent).toContain('TeamCollab');
  });
});
