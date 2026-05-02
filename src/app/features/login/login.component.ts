import { Component, inject, AfterViewInit, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './login.component.html',
  styles: [`
    :host { display: block; }

    @keyframes blob {
      0%   { transform: translate(0px, 0px) scale(1); }
      33%  { transform: translate(30px, -50px) scale(1.1); }
      66%  { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%      { transform: translateY(-20px); }
    }

    .animate-blob { animation: blob 7s infinite; }
    .animation-delay-2s { animation-delay: 2s; }
    .animation-delay-4s { animation-delay: 4s; }
    .animate-float { animation: float 6s ease-in-out infinite; }
  `]
})
export class LoginComponent implements AfterViewInit {
  auth = inject(AuthService);
  private router = inject(Router);

  @ViewChild('googleBtnContainer') googleBtnContainer!: ElementRef;

  gisReady = signal(false);

  private authCheckInterval: any;

  ngAfterViewInit() {
    // Initialize GIS and render the real Google button
    this.auth.initializeGoogleSignIn(this.googleBtnContainer.nativeElement);

    // Poll to detect when GIS renders (hides fallback button)
    setTimeout(() => {
      if (this.googleBtnContainer.nativeElement.children.length > 0) {
        this.gisReady.set(true);
      }
    }, 1500);

    // Watch for auth state change from GIS callback to navigate away
    this.authCheckInterval = setInterval(() => {
      if (this.auth.isAuthenticated()) {
        clearInterval(this.authCheckInterval);
        this.router.navigate(['/dashboard']);
      }
    }, 300);
  }

  /** Fallback for when GIS is not loaded / no client ID */
  signInWithGoogle() {
    this.auth.loginWithGoogle();
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
    if (this.authCheckInterval) {
      clearInterval(this.authCheckInterval);
    }
  }
}
