import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  template: `
    <div class="min-h-screen bg-base-100 text-base-content flex flex-col">
      @if (auth.isAuthenticated()) {
        <app-navbar></app-navbar>
      }
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AppComponent {
  title = 'teamcollab';
  auth = inject(AuthService);
}
