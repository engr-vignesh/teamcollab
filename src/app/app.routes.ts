import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StatusOverviewComponent } from './features/status-overview/status-overview.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'status', component: StatusOverviewComponent },
  { path: '**', redirectTo: '' }
];
