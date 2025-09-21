import { Routes } from '@angular/router';
import { Admin } from './admin';
import { Transactions } from './components/transactions/transactions';
import { Users } from './components/users/users';
import { adminGuard } from '../../../core/guards/adminGuard/admin-guard';

export default [
  {
    path: '',
    component: Admin,
    children: [
      {
        path: '',
        redirectTo: 'admin',
        pathMatch: 'full',
      },
      {
        path: 'admin',
        component: Admin,
        canActivate: [adminGuard],
      },
      {
        path: 'users',
        component: Users,
        canActivate: [adminGuard],
      },
    ],
  },
] satisfies Routes;
