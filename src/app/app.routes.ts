import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StatusOverviewComponent } from './features/status-overview/status-overview.component';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'status', component: StatusOverviewComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
