import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../authentification/services/auth/auth';
import { Transactions, ValidationResult } from './services/transactions';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  userInfo: any;

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
  cards = [
    {
      number: '3600',
      expiry: '04/24',
      balance: 10000.0,
      color: 'from-gray-600 to-teal-600',
    },
    {
      number: '6997',
      expiry: '12/25',
      balance: 2280.51,
      color: 'from-gray-400 to-gray-500',
    },
  ];
  vaultBalance = 79000.0;

  // Transactions récentes
  recentTransactions = [
    {
      date: 'Lun, 1 Mar',
      transactions: [
        {
          type: 'payment',
          description: 'Paiement à Nick',
          amount: -560.0,
          icon: 'red',
          selected: false,
        },
        {
          type: 'receive',
          description: 'Reception Salaire',
          amount: 12200.0,
          icon: 'black',
          selected: false,
        },
        {
          type: 'transfer',
          description: 'Transfert Moneygram',
          amount: -3000.0,
          icon: 'red',
          selected: false,
        },
      ],
    },
    {
      date: 'Lun, 1 Mar',
      transactions: [
        {
          type: 'receive',
          description: 'Reception Remboursement',
          amount: 1550.0,
          icon: 'black',
          selected: true,
        },
      ],
    },
  ];

  transactions: any[] = [];

  // Détails de la transaction sélectionnée
  selectedTransaction = {
    from: 'Olith Bank Refund',
    amount: 1550.0,
    type: 'Cash Refund',
    category: 'Annual Cashback',
    time: '13:48 Lun, 1 Mar',
  };

  constructor(
    private auth: Auth,
    private router: Router,
    private transactionsService: Transactions,
    private userService: Auth
  ) {}

  ngOnInit() {

    this.checkAuth();

    this.refreshUserInfo();
    this.getTransactions();
  }

  checkAuth() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/login');
      return;
    }
  }

  refreshUserInfo() {
    this.auth.getUserProfileV2().subscribe((userInfo: any) => {
      console.log({ userInfo: userInfo });
      if (userInfo?.success) {
        this.userInfo = userInfo.data;
        // Mettre à jour le solde du compte
        if (this.userInfo.solde !== undefined) {
          this.accountBalance = this.userInfo.solde;
        }
      }
    });
  }

  getTransactions() {
    this.transactionsService
      .getTransactionsByUserId()
      .subscribe((transactions: any) => {
        console.log({ transactions: transactions.data });
        if (transactions.success) {
          this.transactions = transactions.data.reverse();
        }
      });
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

  async processDeposit() {
    console.log('processDeposit');
    this.clearValidationMessage();

    if (!this.depositAmount || parseFloat(this.depositAmount) <= 0) {
      this.showValidation('Veuillez saisir un montant valide', 'error');
      return;
    }

    const montant = parseFloat(this.depositAmount);

    // Validation du dépôt
    const validation = this.transactionsService.validateDepot(montant);
    if (!validation.isValid) {
      this.showValidation(validation.message, 'error');
      return;
    }

    this.isProcessing = true;

    try {
      this.transactionsService.effectuerDepot(montant).subscribe({
        next: (transaction: any) => {
          console.log({ transactionDepot: transaction });

          // Toujours considérer comme un succès si on reçoit une réponse
          console.log('Transaction dépôt réussie, fermeture de la modale...');
          this.showValidation(`Dépôt de ${montant.toLocaleString()} FCFA effectué avec succès !`, 'success');

          // Fermer la modale après 1 seconde
          setTimeout(() => {
            console.log('Fermeture forcée de la modale de dépôt');
            this.closeDepositDrawer();
            this.getTransactions();
            this.refreshUserInfo();
          }, 1000);

          this.isProcessing = false;
        },
        error: (error: any) => {
          console.error('Erreur lors du dépôt:', error);
          this.showValidation(error.message || 'Une erreur est survenue lors du dépôt', 'error');
          this.isProcessing = false;
        }
      });
    } catch (error) {
      console.error('Erreur lors du dépôt:', error);
      this.showValidation('Une erreur est survenue lors du dépôt', 'error');
      this.isProcessing = false;
    }
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

  async processRetrait() {
    console.log('processRetrait');
    this.clearValidationMessage();

    if (!this.retraitAmount || parseFloat(this.retraitAmount) <= 0) {
      this.showValidation('Veuillez saisir un montant valide', 'error');
      return;
    }

    const montant = parseFloat(this.retraitAmount);

    // Validation du retrait
    const validation = this.transactionsService.validateRetrait(montant, this.accountBalance);
    if (!validation.isValid) {
      this.showValidation(validation.message, 'error');
      return;
    }

    this.isProcessing = true;

    try {
      this.transactionsService.effectuerRetrait(montant, this.accountBalance).subscribe({
        next: (transaction: any) => {
          console.log({ transactionRetrait: transaction });

          // Toujours considérer comme un succès si on reçoit une réponse
          console.log('Transaction retrait réussie, fermeture de la modale...');
          this.showValidation(`Retrait de ${montant.toLocaleString()} FCFA effectué avec succès !`, 'success');

          // Fermer la modale après 1 seconde
          setTimeout(() => {
            console.log('Fermeture forcée de la modale de retrait');
            this.closeRetraitDrawer();
            this.getTransactions();
            this.refreshUserInfo();
          }, 1000);

          this.isProcessing = false;
        },
        error: (error: any) => {
          console.error('Erreur lors du retrait:', error);
          this.showValidation(error.message || 'Une erreur est survenue lors du retrait', 'error');
          this.isProcessing = false;
        }
      });
    } catch (error) {
      console.error('Erreur lors du retrait:', error);
      this.showValidation('Une erreur est survenue lors du retrait', 'error');
      this.isProcessing = false;
    }
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
        this.users = response.data.filter((user: any) => user.id !== this.userInfo?.id);
      }
    });
  }

  selectUser(user: any) {
    this.selectedUserId = user.id;
    this.searchTerm = `${user.prenom} ${user.nom}`;
  }

  getSelectedUser() {
    return this.users.find(user => user.id === this.selectedUserId);
  }

  clearUserSelection() {
    this.selectedUserId = '';
    this.searchTerm = '';
    this.virementAmount = '';
    this.clearValidationMessage();
  }

  async processVirement() {
    console.log('processVirement');
    this.clearValidationMessage();

    if (!this.virementAmount || parseFloat(this.virementAmount) <= 0) {
      this.showValidation('Veuillez saisir un montant valide', 'error');
      return;
    }

    if (!this.selectedUserId) {
      this.showValidation('Veuillez sélectionner un destinataire', 'error');
      return;
    }

    const montant = parseFloat(this.virementAmount);

    // Validation du virement
    const validation = this.transactionsService.validateVirement(montant, this.accountBalance);
    if (!validation.isValid) {
      this.showValidation(validation.message, 'error');
      return;
    }

    this.isProcessing = true;

    try {
      this.transactionsService.effectuerVirement(montant, this.selectedUserId).subscribe({
        next: (transaction: any) => {
          console.log({ transactionVirement: transaction });

          // Toujours considérer comme un succès si on reçoit une réponse
          console.log('Transaction virement réussie, fermeture de la modale...');
          this.showValidation(`Virement de ${montant.toLocaleString()} FCFA effectué avec succès !`, 'success');

          // Fermer la modale après 1 seconde
          setTimeout(() => {
            console.log('Fermeture forcée de la modale de virement');
            this.closeVirementDrawer();
            this.getTransactions();
            this.refreshUserInfo();
          }, 1000);

          this.isProcessing = false;
        },
        error: (error: any) => {
          console.error('Erreur lors du virement:', error);
          this.showValidation(error.message || 'Une erreur est survenue lors du virement', 'error');
          this.isProcessing = false;
        }
      });
    } catch (error) {
      console.error('Erreur lors du virement:', error);
      this.showValidation('Une erreur est survenue lors du virement', 'error');
      this.isProcessing = false;
    }
  }

  onVirementAmountChange() {
    if (this.virementAmount) {
      const montant = parseFloat(this.virementAmount);
      const validation = this.transactionsService.validateVirement(montant, this.accountBalance);

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
      const validation = this.transactionsService.validateRetrait(montant, this.accountBalance);

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
  showValidation(message: string, type: 'error' | 'warning' | 'success' = 'error') {
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
    return this.transactionsService.calculerMontantMaximumRetrait(this.accountBalance);
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

  // Méthode pour formater la date
  formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Si c'est aujourd'hui
    if (diffDays === 0) {
      return "Aujourd'hui " + this.formatTime(dateString);
    }
    // Si c'est hier
    else if (diffDays === 1) {
      return 'Hier ' + this.formatTime(dateString);
    }
    // Si c'est dans les 7 derniers jours
    else if (diffDays <= 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
    }
    // Sinon, format complet
    else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  // Méthode pour formater l'heure
  formatTime(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
