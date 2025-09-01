import { Routes } from '@angular/router';
import { HomePage } from './pages/components/home-page/home-page';
import { Login } from './authentification/components/login/login';
import { Register } from './authentification/components/register/register';
import { Dashboard } from './pages/components/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'backoffice',
    loadChildren: () => import('./backoffice/backoffice.routes'),
  },
];
