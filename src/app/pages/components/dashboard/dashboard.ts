import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../authentification/services/auth/auth';
import { Transactions, ValidationResult } from './services/transactions';
import { FormsModule } from '@angular/forms';
import { RelativeDatePipe } from '../../../core/pipe/relative-date-pipe-pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RelativeDatePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  private transactionsService = inject(Transactions);
  private cd = inject(ChangeDetectorRef);

  transactions: any[] = [];
  userInfo: any;
  isLoading = false;
  // Propriétés pour le drawer de dépôt
  isDepositDrawerOpen = false;
  depositAmount = '';
  retraitAmount = '';
  isProcessing = false;

  isRetraitDrawerOpen = false;

  // Propriétés pour le drawer de virement
  isVirementDrawerOpen = false;
  virementAmount = '';
  selectedUserId = '';
  users: any[] = [];
  searchTerm = '';

  // Propriétés pour les validations
  validationMessage = '';
  validationType: 'error' | 'warning' | 'success' = 'error';
  showValidationMessage = false;

  // Données du compte
  accountBalance = 12280.51;
  vaultBalance = 79000.0;

  ngOnInit() {
    this.loadTransactionsAndUser();
  }
  getTransactions() {
    this.transactionsService.getTransactionsByUserId().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.transactions = res.data.slice().reverse();
          localStorage.setItem(
            'transactions',
            JSON.stringify(this.transactions)
          );
          this.cd.detectChanges();
        }
      },
      error: (err: any) => console.error(err),
      complete: () => (this.isLoading = false),
    });
  }

  loadTransactionsAndUser() {
    this.isLoading = true;
    // Charger le cache local
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      this.transactions = JSON.parse(savedTransactions);
    }
    // Recharger depuis l’API
    this.auth.getUserProfileV2().subscribe((userInfo) => {
      if (userInfo?.success) {
        this.userInfo = userInfo.data;
        this.accountBalance = this.userInfo.solde ?? this.accountBalance;
      }
    });
    this.getTransactions();
  }

  onDepot() {
    this.router.navigateByUrl('/backoffice/users/send-transactions');
  }

  onRetrait() {
    this.router.navigateByUrl('/backoffice/users/withdraw-money');
  }

  onTransfert() {
    this.openVirementDrawer();
  }

  // Méthodes pour le drawer de dépôt
  openDepositDrawer() {
    this.isDepositDrawerOpen = true;
    this.depositAmount = '';
    this.retraitAmount = '';
    this.clearValidationMessage();
    console.log('openDepositDrawer');
  }

  closeDepositDrawer() {
    this.isDepositDrawerOpen = false;
    this.depositAmount = '';
    this.retraitAmount = '';
    this.clearValidationMessage();
    console.log('closeDepositDrawer');
  }
  // Met à jour le solde en fonction du type de transaction
  updateBalance(type: 'deposit' | 'withdraw' | 'virement', montant: number) {
    if (type === 'deposit') {
      this.accountBalance += montant;
    } else if (type === 'withdraw' || type === 'virement') {
      this.accountBalance -= montant;
    }

    // Forcer Angular à détecter le changement
    this.cd.detectChanges();
  }

  processDeposit() {
    this.clearValidationMessage();

    const montant = parseFloat(this.depositAmount);
    if (!montant || montant <= 0) {
      this.showValidation('Veuillez saisir un montant valide', 'error');
      return;
    }

    const validation = this.transactionsService.validateDepot(montant);
    if (!validation.isValid) {
      this.showValidation(validation.message, 'error');
      return;
    }

    this.isProcessing = true;

    this.transactionsService.effectuerDepot(montant).subscribe({
      next: (transaction: any) => {
        console.log({ transactionDepot: transaction });

        this.updateBalance('deposit', montant);
        this.showValidation(
          `Dépôt de ${montant.toLocaleString()} FCFA effectué avec succès !`,
          'success'
        );

        setTimeout(() => {
          this.closeDepositDrawer();
          this.getTransactions();
        }, 1000);

        this.isProcessing = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du dépôt:', error);
        this.showValidation(
          error.message || 'Une erreur est survenue lors du dépôt',
          'error'
        );
        this.isProcessing = false;
      },
    });
  }

  processRetrait() {
    this.clearValidationMessage();

    const montant = parseFloat(this.retraitAmount);
    if (!montant || montant <= 0) {
      this.showValidation('Veuillez saisir un montant valide', 'error');
      return;
    }

    const validation = this.transactionsService.validateRetrait(
      montant,
      this.accountBalance
    );
    if (!validation.isValid) {
      this.showValidation(validation.message, 'error');
      return;
    }

    this.isProcessing = true;

    this.transactionsService
      .effectuerRetrait(montant, this.accountBalance)
      .subscribe({
        next: (transaction: any) => {
          console.log({ transactionRetrait: transaction });

          this.updateBalance('withdraw', montant);
          this.showValidation(
            `Retrait de ${montant.toLocaleString()} FCFA effectué avec succès !`,
            'success'
          );

          setTimeout(() => {
            this.closeRetraitDrawer();
            this.getTransactions();
          }, 1000);

          this.isProcessing = false;
        },
        error: (error: any) => {
          console.error('Erreur lors du retrait:', error);
          this.showValidation(
            error.message || 'Une erreur est survenue lors du retrait',
            'error'
          );
          this.isProcessing = false;
        },
      });
  }

  processVirement() {
    this.clearValidationMessage();

    const montant = parseFloat(this.virementAmount);
    if (!montant || montant <= 0) {
      this.showValidation('Veuillez saisir un montant valide', 'error');
      return;
    }

    if (!this.selectedUserId) {
      this.showValidation('Veuillez sélectionner un destinataire', 'error');
      return;
    }

    const validation = this.transactionsService.validateVirement(
      montant,
      this.accountBalance
    );
    if (!validation.isValid) {
      this.showValidation(validation.message, 'error');
      return;
    }

    this.isProcessing = true;

    this.transactionsService
      .effectuerVirement(montant, this.selectedUserId)
      .subscribe({
        next: (transaction: any) => {
          console.log({ transactionVirement: transaction });

          this.updateBalance('virement', montant);
          this.showValidation(
            `Virement de ${montant.toLocaleString()} FCFA effectué avec succès !`,
            'success'
          );

          setTimeout(() => {
            this.closeVirementDrawer();
            this.getTransactions();
          }, 1000);

          this.isProcessing = false;
        },
        error: (error: any) => {
          console.error('Erreur lors du virement:', error);
          this.showValidation(
            error.message || 'Une erreur est survenue lors du virement',
            'error'
          );
          this.isProcessing = false;
        },
      });
  }

  onRetraitDrawer() {
    this.isRetraitDrawerOpen = true;
    this.retraitAmount = '';
    this.clearValidationMessage();
    console.log('onRetraitDrawer');
  }

  closeRetraitDrawer() {
    this.isRetraitDrawerOpen = false;
    this.retraitAmount = '';
    this.clearValidationMessage();
    console.log('closeRetraitDrawer');
  }

  // Méthodes pour le drawer de virement
  openVirementDrawer() {
    this.isVirementDrawerOpen = true;
    this.virementAmount = '';
    this.selectedUserId = '';
    this.searchTerm = '';
    this.clearValidationMessage();
    this.getUsers();
    console.log('openVirementDrawer');
  }

  closeVirementDrawer() {
    this.isVirementDrawerOpen = false;
    this.virementAmount = '';
    this.selectedUserId = '';
    this.searchTerm = '';
    this.clearValidationMessage();
    console.log('closeVirementDrawer');
  }

  getUsers() {
    // Récupérer la liste des utilisateurs (en excluant l'utilisateur actuel)
    this.auth.getUsers().subscribe((response: any) => {
      if (response?.success) {
        // Filtrer pour exclure l'utilisateur actuel
        this.users = response.data.filter(
          (user: any) => user.id !== this.userInfo?.id
        );
      }
    });
  }

  selectUser(user: any) {
    this.selectedUserId = user.id;
    this.searchTerm = `${user.prenom} ${user.nom}`;
  }

  getSelectedUser() {
    return this.users.find((user) => user.id === this.selectedUserId);
  }

  clearUserSelection() {
    this.selectedUserId = '';
    this.searchTerm = '';
    this.virementAmount = '';
    this.clearValidationMessage();
  }

  onVirementAmountChange() {
    if (this.virementAmount) {
      const montant = parseFloat(this.virementAmount);
      const validation = this.transactionsService.validateVirement(
        montant,
        this.accountBalance
      );

      if (!validation.isValid) {
        this.showValidation(validation.message, 'error');
      } else {
        this.clearValidationMessage();
      }
    } else {
      this.clearValidationMessage();
    }
  }

  // Méthodes pour la validation en temps réel
  onRetraitAmountChange() {
    if (this.retraitAmount) {
      const montant = parseFloat(this.retraitAmount);
      const validation = this.transactionsService.validateRetrait(
        montant,
        this.accountBalance
      );

      if (!validation.isValid) {
        this.showValidation(validation.message, 'error');
      } else {
        this.clearValidationMessage();
      }
    } else {
      this.clearValidationMessage();
    }
  }

  onDepositAmountChange() {
    if (this.depositAmount) {
      const montant = parseFloat(this.depositAmount);
      const validation = this.transactionsService.validateDepot(montant);

      if (!validation.isValid) {
        this.showValidation(validation.message, 'error');
      } else {
        this.clearValidationMessage();
      }
    } else {
      this.clearValidationMessage();
    }
  }

  // Méthodes pour afficher les messages de validation
  showValidation(
    message: string,
    type: 'error' | 'warning' | 'success' = 'error'
  ) {
    this.validationMessage = message;
    this.validationType = type;
    this.showValidationMessage = true;
  }

  clearValidationMessage() {
    this.validationMessage = '';
    this.showValidationMessage = false;
  }

  // Méthode pour obtenir le montant maximum possible pour un retrait
  getMontantMaximumRetrait(): number {
    return this.transactionsService.calculerMontantMaximumRetrait(
      this.accountBalance
    );
  }

  // Méthode pour formater le montant maximum
  getMontantMaximumFormatted(): string {
    const max = this.getMontantMaximumRetrait();
    return max > 0 ? max.toLocaleString() : '0';
  }

  onVoirTransactions() {
    this.router.navigateByUrl('/backoffice/users/transactions-list');
  }

  logout() {
    this.auth.logout();
  }

  // Méthodes pour les actions du coffre-fort
  onAddToVault() {
    console.log('Ajouter au coffre-fort');
  }

  onAutoVault() {
    console.log('Configuration automatique du coffre-fort');
  }

  // Méthodes pour les détails de transaction
  onManageTransaction() {
    console.log('Gérer la transaction');
  }

  onInvoiceTransaction() {
    console.log('Voir la facture');
  }

  onAddRecipient() {
    console.log('Ajouter comme destinataire');
  }
}
