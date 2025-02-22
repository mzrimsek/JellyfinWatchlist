import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    component: LoginComponent,
    path: 'login',
  },
  {
    component: HomeComponent,
    path: '',
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
];
