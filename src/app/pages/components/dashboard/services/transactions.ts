import { Injectable } from '@angular/core';
import { Abstract } from '../../../../core/services/abstract/abstract';

@Injectable({
  providedIn: 'root'
})
export class Transactions extends Abstract<any> {

  getTransactionsByUserId(): any {
    return this.read('transactions/user');
  }

  getTransactionById(id: string): any {
    return this.read(`transactions/${id}`);
  }

  createTransaction(data: any): any {
    return this.create('transactions', data);
  }

  updateTransaction(id: string, data: any): any {
    return this.update(`transactions/${id}`, data);
  }

  deleteTransaction(id: string): any {
    return this.delete(`transactions/${id}`);
  }
}