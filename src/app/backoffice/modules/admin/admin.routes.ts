import { Routes } from '@angular/router';
import { Admin } from './admin';
import { Transactions } from './components/transactions/transactions';
import { Users } from './components/users/users';

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
        path: 'users',
        component: Users,
      },
      {
        path: 'transactions',
        component: Transactions,
      },
    ],
  },
] satisfies Routes;
