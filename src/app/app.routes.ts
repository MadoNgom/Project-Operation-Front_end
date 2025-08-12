import { Routes } from '@angular/router';
import { HomePage } from './pages/components/home-page/home-page';
import { Login } from './authentification/components/login/login';
import { Register } from './authentification/components/register/register';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
];
