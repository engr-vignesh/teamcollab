import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styles: [`:host { display: block; }`]
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  isDark = signal(false);

  toggleTheme() {
    this.isDark.update(v => !v);
    document.documentElement.setAttribute('data-theme', this.isDark() ? 'dark' : 'light');
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
