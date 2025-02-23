import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { Routes } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    component: HomeComponent,
    path: '',
    canActivate: [authGuard],
  },
  {
    component: LoginComponent,
    path: 'login',
  },
  {
    component: SearchComponent,
    path: 'search',
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
];
