import { Injectable } from '@angular/core';
import { Abstract } from '../../../../core/services/abstract/abstract';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface TransactionData {
  montant: number;
  typeTransaction: 'DEPOT' | 'RETRAIT' | 'TRANSFERT';
  description?: string;
  destinataireId?: string;
  [key: string]: any;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  code?: string;
}

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

  createTransaction(data: TransactionData): any {
    return this.create('transactions', data);
  }

  updateTransaction(id: string, data: any): any {
    return this.update(`transactions/${id}`, data);
  }

  deleteTransaction(id: string): any {
    return this.delete(`transactions/${id}`);
  }

  /**
   * Valide un retrait avant de l'effectuer
   */
  validateRetrait(montant: number, soldeActuel: number): ValidationResult {
    // Validation du montant
    if (!montant || montant <= 0) {
      return {
        isValid: false,
        message: 'Le montant doit être supérieur à 0',
        code: 'INVALID_AMOUNT'
      };
    }

    // Validation du montant minimum
    const montantMinimum = 100; // 100 FCFA minimum
    if (montant < montantMinimum) {
      return {
        isValid: false,
        message: `Le montant minimum pour un retrait est de ${montantMinimum} FCFA`,
        code: 'MINIMUM_AMOUNT'
      };
    }

    // Validation du montant maximum
    const montantMaximum = 500000; // 500 000 FCFA maximum
    if (montant > montantMaximum) {
      return {
        isValid: false,
        message: `Le montant maximum pour un retrait est de ${montantMaximum.toLocaleString()} FCFA`,
        code: 'MAXIMUM_AMOUNT'
      };
    }

    // Validation du solde
    if (montant > soldeActuel) {
      return {
        isValid: false,
        message: `Solde insuffisant. Votre solde actuel est de ${soldeActuel.toLocaleString()} FCFA`,
        code: 'INSUFFICIENT_BALANCE'
      };
    }

    // Validation du solde après retrait (garder un minimum)
    const soldeMinimum = 1000; // 1000 FCFA minimum après retrait
    const soldeApresRetrait = soldeActuel - montant;
    if (soldeApresRetrait < soldeMinimum) {
      return {
        isValid: false,
        message: `Vous devez garder au minimum ${soldeMinimum.toLocaleString()} FCFA sur votre compte. Montant maximum possible: ${(soldeActuel - soldeMinimum).toLocaleString()} FCFA`,
        code: 'MINIMUM_BALANCE_REQUIRED'
      };
    }

    return {
      isValid: true,
      message: 'Retrait validé'
    };
  }

  /**
   * Valide un dépôt avant de l'effectuer
   */
  validateDepot(montant: number): ValidationResult {
    // Validation du montant
    if (!montant || montant <= 0) {
      return {
        isValid: false,
        message: 'Le montant doit être supérieur à 0',
        code: 'INVALID_AMOUNT'
      };
    }

    // Validation du montant minimum
    const montantMinimum = 100; // 100 FCFA minimum
    if (montant < montantMinimum) {
      return {
        isValid: false,
        message: `Le montant minimum pour un dépôt est de ${montantMinimum} FCFA`,
        code: 'MINIMUM_AMOUNT'
      };
    }

    // Validation du montant maximum
    const montantMaximum = 1000000; // 1 000 000 FCFA maximum
    if (montant > montantMaximum) {
      return {
        isValid: false,
        message: `Le montant maximum pour un dépôt est de ${montantMaximum.toLocaleString()} FCFA`,
        code: 'MAXIMUM_AMOUNT'
      };
    }

    return {
      isValid: true,
      message: 'Dépôt validé'
    };
  }

  /**
   * Effectue un retrait avec validation
   */
  effectuerRetrait(montant: number, soldeActuel: number): Observable<any> {
    const validation = this.validateRetrait(montant, soldeActuel);

    if (!validation.isValid) {
      return throwError(() => new Error(validation.message));
    }

    return this.createTransaction({
      montant: montant,
      typeTransaction: 'RETRAIT',
      description: `Retrait de ${montant.toLocaleString()} FCFA`
    }).pipe(
      catchError((error) => {
        console.error('Erreur lors du retrait:', error);
        return throwError(() => new Error('Erreur lors du traitement du retrait'));
      })
    );
  }

  /**
   * Effectue un dépôt avec validation
   */
  effectuerDepot(montant: number): Observable<any> {
    const validation = this.validateDepot(montant);

    if (!validation.isValid) {
      return throwError(() => new Error(validation.message));
    }

    return this.createTransaction({
      montant: montant,
      typeTransaction: 'DEPOT',
      description: `Dépôt de ${montant.toLocaleString()} FCFA`
    }).pipe(
      catchError((error) => {
        console.error('Erreur lors du dépôt:', error);
        return throwError(() => new Error('Erreur lors du traitement du dépôt'));
      })
    );
  }

  /**
   * Récupère le solde actuel de l'utilisateur
   */
  getSoldeActuel(): Observable<any> {
    return this.read('utilisateurs/me');
  }

  /**
   * Calcule le montant maximum possible pour un retrait
   */
  calculerMontantMaximumRetrait(soldeActuel: number): number {
    const soldeMinimum = 1000; // 1000 FCFA minimum à garder
    const montantMaximum = 500000; // 500 000 FCFA maximum

    const montantDisponible = soldeActuel - soldeMinimum;
    return Math.min(montantDisponible, montantMaximum);
  }
}