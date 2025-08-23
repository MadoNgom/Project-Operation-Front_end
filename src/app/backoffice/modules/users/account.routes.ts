import { Routes } from '@angular/router';
import { Transactions } from '../admin/components/transactions/transactions';
import { SendTransactions } from './components/send-transactions/send-transactions';
import { WithdrawMoney } from './components/withdraw-money/withdraw-money';
import { CancelTransactions } from './components/cancel-transactions/cancel-transactions';
import { Account } from './account';

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
      },
      {
        path: 'transactions',
        component: Transactions,
      },
      {
        path: 'send-money',
        component: SendTransactions,
      },
      {
        path: 'withdraw-money',
        component: WithdrawMoney,
      },
      {
        path: 'cancel-transactions',
        component: CancelTransactions,
      },
    ],
  },
] satisfies Routes;
