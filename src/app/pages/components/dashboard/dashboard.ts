import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../authentification/services/auth/auth';
import { Transactions } from './services/transactions';
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
  isProcessing = false;

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
    if (!this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.refreshUserInfo();
    this.getTransactions();
  }

  refreshUserInfo() {
    this.auth.getUserProfileV2().subscribe((userInfo: any) => {
      console.log({ userInfo: userInfo });
      if (userInfo?.success) {
        this.userInfo = userInfo.data;
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
        // this.recentTransactions = transactions;
      });
  }

  onDepot() {
    this.router.navigateByUrl('/backoffice/users/send-transactions');
  }

  onRetrait() {
    this.router.navigateByUrl('/backoffice/users/withdraw-money');
  }

  onTransfert() {
    this.router.navigateByUrl('/backoffice/users/send-transactions');
  }

  // Méthodes pour le drawer de dépôt
  openDepositDrawer() {
    this.isDepositDrawerOpen = true;
    this.depositAmount = '';
    console.log('openDepositDrawer');
  }

  closeDepositDrawer() {
    this.isDepositDrawerOpen = false;
    this.depositAmount = '';
    console.log('closeDepositDrawer');
  }

  async processDeposit() {
    console.log('processDeposit');
    if (!this.depositAmount || parseFloat(this.depositAmount) <= 0) {
      alert('Veuillez saisir un montant valide');
      return;
    }

    this.isProcessing = true;

    try {
      // Ici vous pouvez ajouter la logique pour traiter le dépôt
      // Par exemple, appeler un service API
      console.log('Dépôt en cours pour le montant:', this.depositAmount);

      this.transactionsService.createTransaction({
        montant: parseFloat(this.depositAmount),
        typeTransaction: 'DEPOT',
      }).subscribe({
        next: (transaction: any) => {
          console.log({ transactionDepot: transaction });
          if (transaction.success) {
            // alert(`Dépôt de ${this.depositAmount} FCFA effectué avec succès !`);
            this.closeDepositDrawer();
            this.getTransactions();
            this.refreshUserInfo(); // Mettre à jour le solde
          } else {
            alert('Une erreur est survenue lors du dépôt');
          }
          this.isProcessing = false;
        },
        error: (error: any) => {
          console.error('Erreur lors du dépôt:', error);
          alert('Une erreur est survenue lors du dépôt');
          this.isProcessing = false;
        }
      });
    } catch (error) {
      console.error('Erreur lors du dépôt:', error);
      alert('Une erreur est survenue lors du dépôt');
      this.isProcessing = false;
    }
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
