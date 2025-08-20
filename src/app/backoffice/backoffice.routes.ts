import { Routes } from '@angular/router';
import { Backoffice } from './backoffice';

const routes: Routes = [
  {
    path: '',
    component: Backoffice,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'backoffice',
      },
      {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.routes'),
      },
      {
        path: 'account',
        loadChildren: () => import('./modules/users/account.routes'),
      },
    ],
  },
];
export default routes;
