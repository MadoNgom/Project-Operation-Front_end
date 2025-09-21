import { Routes } from '@angular/router';
import { Transactions } from '../admin/components/transactions/transactions';
import { SendTransactions } from './components/send-transactions/send-transactions';
import { WithdrawMoney } from './components/withdraw-money/withdraw-money';
import { CancelTransactions } from './components/cancel-transactions/cancel-transactions';
import { Account } from './account';
import { userGuard } from '../../../core/guards/userGuard/user-guard';

export default [
  {
    path: '',
    component: Account,
    children: [
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full',
      },
      {
        path: 'account',
        component: Account,
        canActivate: [userGuard],
      },
      {
        path: 'transactions',
        component: Transactions,
        canActivate: [userGuard],
      },
      {
        path: 'send-money',
        component: SendTransactions,
        canActivate: [userGuard],
      },
      {
        path: 'withdraw-money',
        component: WithdrawMoney,
        canActivate: [userGuard],
      },
      {
        path: 'cancel-transactions',
        component: CancelTransactions,
        canActivate: [userGuard],
      },
    ],
  },
] satisfies Routes;
